import Foundation
import CommonCrypto
import WnfsSwift
import Mobile


@objc(FulaModule)
class FulaModule: NSObject {
    public let NAME: String = "FulaModule"
    var fula: Mobile.Fula?
    
    var client: Client?
    var fulaConfig: Mobile.Config
    var appDir: URL
    var fulaStorePath: String
    var privateForest: String
    var rootConfig: WnfsConfig?
    var sharedPref: SharedPreferenceHelper
    var secretKeyGlobal: SecretKey
    var identityEncryptedGlobal: String
    static let PRIVATE_KEY_STORE_ID = "PRIVATE_KEY"
    
    @objc(Client)
    public class Client: NSObject {
        var internalClient: Mobile.Client
        
        override init(clientInput: Mobile.Client) {
            internalClient = clientInput
        }
        
        func get(cid: Data?) -> Data? {
            do {
                print(String(format: "ReactNative get cid: %s", cid! as NSData))
                return try internalClient.get(cid)
            } catch let error {
                print (error.localizedDescription)
            }
            print("ReactNative Error get")
            return nil
        }
        
        func put(data: Data?, codec: Int) -> Data? {
            do {
                print(String(format: "ReactNative put data: %s , codec: %d", data! as NSData, codec))
                return try internalClient.put(data, codec)
            } catch let error {
                print("ReactNative put Error")
                print (error.localizedDescription)
            }
            print("ReactNative Error put")
            return nil
        }
    }
    var wnfsWrapper: WnfsWrapper
    override init() {
        
        if let appDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
            fulaStoreURL = appDir.appendingPathComponent("/fula")
            
            fulaStorePath = fulaStoreURL.path
            let fileManager = FileManager.default
            var success = true
            if !fileManager.fileExists(atPath: fulaStorePath) {
                do{
                    try fileManager.createDirectory(atPath: fulaStorePath, withIntermediateDirectories: true)
                }catch let error{
                    print(error.localizedDescription)
                    success = false
                }
                
            }
            if success {
                print("Fula store folder created")
            } else {
                print("Unable to create fula store folder!")
                
            }
        }
        func convertConfigToJson(config: WnfsConfig) -> String {
            return String(format: "{\"cid\": \"%@\", \"private_ref\": \"%@\"}", config.getCid(), config.getPrivateRef())
        }
        
        func getName() -> String {
            return NAME
        }
        
        func toByte(_ input: String) -> Data {
            return input.data(using: .utf8)!
        }
        
        func toString(_ input: Data) -> String {
            return String(data: input, encoding: .utf8)!
        }
        
        func stringArrToIntArr(_ s: Array<String>) -> Array<Int> {
            return s.map { Int($0)!}
        }
        
        func convertIntToByte(_ s: Array<Int>) -> Array<UInt8> {
            return s.map { UInt8(exactly: $0)!}
        }
        
        func convertStringToByte(_ input: String) -> Array<UInt8> {
            let splitted = input.split(separator: ",").map { String($0) }
            let keyInt = stringArrToIntArr(splitted)
            return convertIntToByte(keyInt)
        }
        
        @objc(checkConnection:withResolver:withRejecter:)
        func checkConnection(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void  {
            print("ReactNative", "checkConnection started")
            
            if (fula != nil) {
                do {
                    Task {
                        let connectionStatus = try await checkConnectionInternal()
                        resolve(connectionStatus)
                    }
                }
                catch let error {
                    print("ReactNative", "checkConnection failed with Error: ", error.localizedDescription)
                    resolve(false)
                }
            }
        }
        
        @objc(newClient:withIdentityString:withStorePath:withBloxAddr:withExchange:withAutoFlush:withUseRelay:withResolver:withRejecter:)
        func newClient(identityString: String, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, useRelay: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void  {
            print("ReactNative", "newClient started")
            
            do {
                Task{
                    print("ReactNative", "newClient storePath= ", storePath)
                    let identity = toByte(identityString)
                    print("ReactNative", "newClient identity= ", identityString)
                    try await newClientInternal(identity, storePath, bloxAddr, exchange, autoFlush, useRelay)
                    let peerId = fula.id()
                    resolve(peerId)
                }
            } catch let error {
                print("ReactNative", "newClient failed with Error: ", error.localizedDescription)
                reject("ERR_FULA", "Can't create client", error.localizedDescription)
            }
            
        }
       
        @objc(isReady:withFilesystemCheck:withResolver:withRejecter:)
        func isReady(filesystemCheck: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void{
          print("ReactNative", "isReady started")
            var initialized = false
            do {
              if (fula != nil && fula.id() != nil) {
                if (filesystemCheck) {
                  if (client != nil && rootConfig != nil && !rootConfig!.getCid().isEmpty) {
                    initialized = true
                  }
                } else {
                  initialized = true
                }
              }
                resolve(initialized)
            } catch let error {
                print("ReactNative", "isReady failed with Error: " + error.localizedDescription)
                reject("ERR_FULA", "Check if fula is ready", error.localizedDescription)
            }
        }
        
        @objc(init:withIdentityString:withStorePath:withBloxAddr:withExchange:withAutoFlush:withRootConfig:withUseRelay:withResolver:withRejecter:)
        func init(identityString: String, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, rootConfig: String, useRelay: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
            print("ReactNative", "init started")
            do {
                Task{
                    var resultData = Dictionary<String, String>()
                    print("ReactNative", "init storePath= ", storePath)
                    let identity = toByte(identityString)
                    print("ReactNative", "init identity= ", identityString)
                    let obj = try await initInternal(identity, storePath, bloxAddr, exchange, autoFlush, rootConfig, useRelay)
                    print("ReactNative", "init object created: [ " + obj[0] + ", " + obj[1] + ", " + obj[2] + " ]")
                    resultData["peerId"] = obj[0]
                    resultData["rootCid"] = obj[1]
                    resultData["private_ref"] = obj[2]
                    resolve(resultData)
                }
            } catch let error {
                print("ReactNative", "init failed with Error: ", error.localizedDescription)
                reject("ERR_FULA", "init failed", error.localizedDescription)
            }
        }
        
        @objc(logout:withIdentityString:withStorePath:withResolver:withRejecter:)
        func logout(identityString: String, storePath: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void{
            print("ReactNative", "logout started")
            do {
                Task{
                    let identity = toByte(identityString)
                    let obj = try await logoutInternal(identity, storePath)
                    print("ReactNative", "logout completed")
                    resolve(obj)
                }
            } catch let error {
                print("ReactNative", "logout failed with Error: ", error.localizedDescription)
                reject("ERR_FULA", "logout failed", error.localizedDescription)
            }
        }
        
        func checkConnectionInternal() async throws -> Bool {
            do {
                print("ReactNative", "checkConnectionInternal fstarted")
                if (fula != nil) {
                    do {
                        print("ReactNative", "connectToBlox started")
                        try fula.connectToBlox()
                        return true
                    } catch let error {
                        print("ReactNative", "checkConnectionInternal failed with Error: ", error.localizedDescription)
                        return false
                    }
                } else {
                    print("ReactNative", "checkConnectionInternal failed because fula is not initialized ")
                    return false
                }
            } catch let error {
                print("ReactNative", "checkConnectionInternal failed with Error: ", error.localizedDescription)
                throw error
            }
        }
        
        @objc(checkFailedActions:withRetry:withResolver:withRejecter:)
        func checkFailedActions(retry: Bool, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void{
          do {
            if (fula != nil) {
              if (!retry) {
                print("ReactNative", "checkFailedActions without retry")
                let failedLinks = fula.listFailedPushes()
                if (failedLinks.hasNext()) {
                    print("ReactNative", "checkFailedActions found: ", failedLinks.next().joined())
                  resolve(true)
                } else {
                  resolve(false)
                }
              } else {
                print("ReactNative", "checkFailedActions with retry")
                let retryResults = retryFailedActionsInternal()
                resolve(!retryResults)
              }
            } else {
                reject("ERR_FULA", "Fula is not initialized")
            }
          } catch let error {
              print("ReactNative", "checkFailedActions failed with Error: ", error.localizedDescription)
              reject("ERR_FULA", "CheckFailedActions failed", error.localizedDescription)
          }
        }

        func retryFailedActionsInternal() async throws -> Bool {
            do {
                print("ReactNative", "retryFailedActionsInternal started")
                if (fula != nil) {
                    //Fula is initialized
                    do {
                        let connectionCheck = try await checkConnectionInternal()
                        if(connectionCheck) {
                            do {
                                print("ReactNative", "retryFailedPushes started")
                                try fula.retryFailedPushes()
                                print("ReactNative", "flush started")
                                fula.flush()
                                return true
                            }
                            catch let error {
                                fula.flush()
                                print("ReactNative", "retryFailedActionsInternal failed with Error: ", error.localizedDescription)
                                return false
                            }
                            
                        } else {
                            print("ReactNative", "retryFailedActions failed because blox is offline")
                            //Blox Offline
                            return false
                        }
                    }
                    catch let error {
                        print("ReactNative", "retryFailedActions failed with Error: ", error.localizedDescription)
                        return false
                    }
                } else {
                    print("ReactNative", "retryFailedActions failed because fula is not initialized")
                    //Fula is not initialized
                    return false
                }
            } catch let error {
                print("ReactNative", "retryFailedActions failed with Error: ", error.localizedDescription)
                throw error
            }
        }
        
        
        func createPeerIdentity(privateKey: Data) throws -> Data {
          do {
            // 1: First: create public key from provided private key
            // 2: Should read the local keychain store (if it is key-value, key is public key above,
            // 3: if found, decrypt using the private key
            // 4: If not found or decryption not successful, generate an identity
            // 5: then encrypt and store in keychain
            // TODO: recheck error handling
            var encryptedKey = userDataHelper.getValue(PRIVATE_KEY_STORE_ID)
            let secretKey = try Cryptography.generateKey(privateKey)
            if (encryptedKey == nil) {
              let autoGeneratedIdentity = Fulamobile.generateEd25519Key()
              encryptedKey = try Cryptography.encryptMsg(Data(autoGeneratedIdentity).base64EncodedString(), secretKey)
              userDataHelper.add(PRIVATE_KEY_STORE_ID, encryptedKey)
            }
            return Data(Cryptography.decryptMsg(encryptedKey, secretKey).utf8)

          } catch let error {
            print("ReactNative", "createPeerIdentity failed with Error: ", error.localizedDescription)
            throw error
          }
        }

        func createNewRootConfig(iClient: FulaModule.Client , identity: Data) throws -> Void {
            privateForest = wnfsWrapper.createPrivateForest(iClient)
            print("ReactNative", "privateForest is created: ", privateForest)
            rootConfig = wnfsWrapper.createRootDir(iClient, privateForest, identity)
            if (fula != nil) {
                fula.flush()
            }
            print("ReactNative", "rootConfig is created: cid=", rootConfig.getCid(), " & private_ref=", rootConfig.getPrivate_ref())
            encrypt_and_store_config()
        }

        func getPrivateRef(iClient: FulaModule.Client ,wnfsKey: Data , rootCid: String) throws -> String {
            print("ReactNative", "getPrivateRef called: rootCid=", rootCid)
            let privateRef = try wnfsWrapper.getPrivateRef(iClient, wnfsKey, rootCid)
            print("ReactNative", "getPrivateRef completed: privateRef=", privateRef)
            return privateRef
        }

        
        func encrypt_and_store_config() throws -> Bool {
            do {
            if(identityEncryptedGlobal != nil && !identityEncryptedGlobal.isEmpty) {
                let cid_encrypted = Cryptography.encryptMsg(rootConfig.getCid(), secretKeyGlobal)
                let private_ref_encrypted = Cryptography.encryptMsg(rootConfig.getPrivate_ref(), secretKeyGlobal)

                userDataHelper.add("cid_encrypted_" + identityEncryptedGlobal, cid_encrypted)
                userDataHelper.add("private_ref_encrypted_" + identityEncryptedGlobal, private_ref_encrypted)
                return true
            } else {
                return false
            }
            } catch let error {
            print("ReactNative", "encrypt_and_store_config failed with Error: ", error.localizedDescription)
            throw error
            }
        }

        func logoutInternal(identity: Data, storePath: String) throws -> Bool {
            do {
            if (fula != nil) {
                fula.flush()
            }
            let secretKey = try Cryptography.generateKey(identity)
            let identity_encrypted: String = try Cryptography.encryptMsg(identity.toHex(), secretKey)
            userDataHelper.remove("cid_encrypted_"+ identity_encrypted)
            userDataHelper.remove("private_ref_encrypted_"+identity_encrypted)

            //TODO: Should also remove peerid @Mahdi

            userDataHelper.remove("cid_encrypted_"+ identity_encrypted)
            userDataHelper.remove("private_ref_encrypted_"+ identity_encrypted)

            rootConfig = nil
            secretKeyGlobal = nil
            identityEncryptedGlobal = nil

            if (storePath == nil || storePath.trim().isEmpty) {
                storePath = fulaStorePath
            }

            do{
                try fileManager.removeItem(atPath: fulaStorePath)
            }catch let error{
                print("Deleting fula store path", error.localizedDescription)
            }      
            return true

            } catch let error {
                print("ReactNative", "logout internal failed with Error: ", error.localizedDescription)
                throw error
            }
        }

        func getFulaClient() -> fulamobile.Client {
            return fula
        }

        func newClientInternal(identity: Data, storePath: String, bloxAddr: String, exchange: String, autoFlush: String, useRelay: String) throws -> Data {
            do {
                fulaConfig = Config()
                if (storePath == nil || storePath.trim().isEmpty) {
                    fulaConfig.setStorePath(fulaStorePath)
                } else {
                    fulaConfig.setStorePath(storePath)
                }
                print("ReactNative", "storePath is set: " + fulaConfig.getStorePath())

                let peerIdentity = createPeerIdentity(identity)
                fulaConfig.setIdentity(peerIdentity)
                print("ReactNative", "peerIdentity is set: " + fulaConfig.getIdentity().toString())
                fulaConfig.setBloxAddr(bloxAddr)
                print("ReactNative", "bloxAddr is set: " + fulaConfig.getBloxAddr())
                fulaConfig.setExchange(exchange)
                fulaConfig.setSyncWrites(autoFlush)
                if (useRelay) {
                    fulaConfig.setAllowTransientConnection(true)
                    fulaConfig.setForceReachabilityPrivate(true)
                }
                if (fula == nil) {
                    print("ReactNative", "Creating a Fula instance")
                    fula = Fulamobile.newClient(fulaConfig)
                }
                if (fula != nil) {
                    fula.flush()
                }
                return peerIdentity
            } catch let error {
                print("ReactNative", "newclientInternal failed with Error: ", error.localizedDescription)
                throw error
            }
        }

        func initInternal(identity: Data, storePath: String, bloxAddr: String, exchange: String, autoFlush: String, rootCid: String, useRelay: String) throws -> [String] {
            do {
            if (fula == nil) {
                newClientInternal(identity, storePath, bloxAddr, exchange, autoFlush, useRelay)
            }
            if(client == nil) {
                client = Client(fula)
                print("ReactNative", "fula initialized: " + fula.id())
            }

            let secretKey = Cryptography.generateKey(identity)
            let identity_encrypted =Cryptography.encryptMsg(identity.toString(), secretKey)
            identityEncryptedGlobal = identity_encrypted
            secretKeyGlobal = secretKey

            if (rootConfig == nil || rootConfig.getCid().isEmpty || rootConfig.getPrivate_ref().isEmpty) {
                print("ReactNative", "rootCid is empty.")
                //Load from keystore

                let cid_encrypted_fetched = sharedPref.getValue("cid_encrypted_"+ identity_encrypted)
                let private_ref_encrypted_fetched = sharedPref.getValue("private_ref_encrypted_"+identity_encrypted)
                print("ReactNative", "Here1")
                var cid = ""
                var private_ref = ""
                if(cid_encrypted_fetched != nil && !cid_encrypted_fetched.isEmpty) {
                print("ReactNative", "decrypting cid="+cid_encrypted_fetched+" with secret="+secretKey.toString())
                cid = Cryptography.decryptMsg(cid_encrypted_fetched, secretKey)
                }
                if(private_ref_encrypted_fetched != nil && !private_ref_encrypted_fetched.isEmpty) {
                print("ReactNative", "decrypting private_ref="+private_ref_encrypted_fetched+" with secret="+secretKey.toString())
                private_ref = Cryptography.decryptMsg(private_ref_encrypted_fetched, secretKey)
                }
                print("ReactNative", "Here2")
                //print("ReactNative", "Attempted to fetch cid from keystore cid="+cid+" & private_ref="+private_ref)
                if((cid == nil || cid.isEmpty) || (private_ref == nil || private_ref.isEmpty) ){
                print("ReactNative", "cid or PrivateRef was not found")
                if(rootCid != nil && !rootCid.isEmpty){
                    print("ReactNative", "Re-setting cid from input: "+rootCid)
                    cid = rootCid
                }
                if((private_ref == nil || private_ref.isEmpty) && (cid != nil && !cid.isEmpty)){
                    print("ReactNative", "Re-fetching privateRef from wnfs: cid="+cid)
                    private_ref = getPrivateRef(client, identity, cid)
                    print("ReactNative", "Re-fetching privateRef from wnfs: "+private_ref)
                }
                if(cid == nil || cid.isEmpty || private_ref == nil || private_ref.isEmpty) {
                    print("ReactNative", "Tried to recover cid and privateRef but was not successful. Creating ones")
                    createNewRootConfig(client, identity)
                } else {
                    print("ReactNative", "Tried to recover cid and privateRef and was successful. cid:"+cid+" & private_ref="+private_ref)
                    rootConfig = WnfsConfig(cid, private_ref)
                    encrypt_and_store_config()
                }
                } else if(cid != nil && !cid.isEmpty && private_ref != nil && !private_ref.isEmpty) {
                print("ReactNative", "Found cid and private ref in keychain store")
                if(cid != nil && !cid.isEmpty && private_ref != nil && !private_ref.isEmpty) {
                    print("ReactNative", "Recovered cid and private ref from keychain store. cid="+cid+" & private_ref="+private_ref)
                    rootConfig = WnfsConfig(cid, private_ref)
                } else{
                    print("ReactNative", "Found but Could not recover cid and private_ref from keychain store")
                    createNewRootConfig(client, identity)
                }
                } else{
                print("ReactNative", "This cid and private_ref generation should never happen!!!")
                //Create root and store cid and private_ref
                createNewRootConfig(client, identity)
                }


                print("ReactNative", "creating rootConfig completed")

                /*
                byte[] testbyte = convertStringToByte("-104,40,24,-93,24,100,24,114,24,111,24,111,24,116,24,-126,24,-126,0,0,24,-128,24,103,24,118,24,101,24,114,24,115,24,105,24,111,24,110,24,101,24,48,24,46,24,49,24,46,24,48,24,105,24,115,24,116,24,114,24,117,24,99,24,116,24,117,24,114,24,101,24,100,24,104,24,97,24,109,24,116")
                long testcodec = 85
                byte[] testputcid = client.put(testbyte, testcodec)
                print("ReactNative", "client.put test done"+ Arrays.toString(testputcid))
                byte[] testfetchedcid = convertStringToByte("1,113,18,32,-6,-63,-128,79,-102,-89,57,77,-8,67,-98,8,-81,40,-87,123,122,29,-52,-124,-60,-53,100,105,125,123,-5,-99,41,106,-124,-64")
                byte[] testfetchedbytes = client.get(testfetchedcid)
                print("ReactNative", "client.get test done"+ Arrays.toString(testfetchedbytes))
                */


                print("ReactNative", "rootConfig is created: cid=" + rootConfig.getCid()+"& private_ref="+rootConfig.getPrivate_ref())
            } else {
                print("ReactNative", "rootConfig existed: cid=" + rootConfig.getCid()+" & private_ref="+rootConfig.getPrivate_ref())
            }
            let peerId = fula.id()
            var obj = [String]()
            obj.append(peerId)
            obj.append(rootConfig.getCid())
            obj.append(rootConfig.getPrivate_ref())
            print("ReactNative", "initInternal is completed successfully")
            if (fula != nil) {
                fula.flush()
            }
            return obj
            } catch let error {
            print("ReactNative", "init internal failed with Error: " , error.localizedDescription)
            throw error
            }
        }
        
        @objc(createPrivateForest:withResolver:withRejecter:)
        func createPrivateForest(dbPath: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
            resolve(wnfsWrapper.CreatePrivateForest(wnfsKey: "test"))
        }
        
        @objc(createRootDir:withCid:withResolver:withRejecter:)
        func createRootDir(dbPath: String, cid: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
            resolve("")
        }
        
        @objc(writeFile:withCid:withPrivateRef:withPath:withLocalFilePath:withResolver:withRejecter:)
        func writeFile(dbPath: String, cid: String, privateRef: String, path: String, localFilePath: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
            do{
                let contentStr = try String(contentsOfFile: localFilePath)
                let data = contentStr.data(using: .utf8)
                let c = try wnfsWrapper.WriteFile(wnfsConfig: WnfsConfig(cid: cid, privateRef: privateRef), remotePath: path, data: data!)
                resolve(convertConfigToJson(config: c))
            }catch let error{
                reject("ERR_WRITE_WNFS", "Can't write file", error)
            }
            
        }
        
        @objc(readFile:withCid:withPrivateRef:withPath:withResolver:withRejecter:)
        func readFile(dbPath: String, cid: String, privateRef: String, path: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
            do{
                let data = try wnfsWrapper.ReadFile(wnfsConfig: WnfsConfig(cid: cid, privateRef: privateRef), remotePath: path)
                resolve(data)
            }catch let error{
                reject("ERR_READ_WNFS", "Can't read file", error)
            }
        }
        
        @objc(readFile:withCid:withPrivateRef:withPath:withResolver:withRejecter:)
        func ls(dbPath: String, cid: String, privateRef: String, path: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
            
            resolve(wnfsWrapper.Ls(wnfsConfig: WnfsConfig(cid: cid, privateRef: privateRef), remotePath: path))
            do{
                let data = try wnfsWrapper.Ls(wnfsConfig: WnfsConfig(cid: cid, privateRef: privateRef), remotePath: path)
                resolve(String(data: data!, encoding: .utf8))
            }catch let error{
                reject("ERR_LS_WNFS", "Can't list files", error)
            }
        }
    }
