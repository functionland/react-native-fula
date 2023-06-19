import Foundation
import CommonCrypto
import WnfsSwift
import Fula


@objc(FulaModule)
class FulaModule: NSObject {
    public let NAME: String = "FulaModule"
    var fula: FulamobileClient?
    
    var client: Client?
    var wnfsWrapper: WnfsWrapper
    var fulaConfig: FulamobileConfig
    var appDir: URL
    var fulaStorePath: String
    var privateForest: String
    var rootConfig: WnfsConfig?
    let userDataHelper = UserDataHelper()
    var secretKeyGlobal: String
    var identityEncryptedGlobal: String
    static let PRIVATE_KEY_STORE_ID = "PRIVATE_KEY"

    enum MyError: Error {
        case runtimeError(String)
    }
    
    @objc(Client)
    public class Client: NSObject {
        var internalClient: FulamobileClient
        
        init(clientInput: FulamobileClient) {
            internalClient = clientInput
        }
        
        func get(cid: Data?) -> Data? {
            do {
                print(String(format: "ReactNative get cid: %s", cid! as NSData))
                return try internalClient.get(cid: cid)
            } catch let error {
                print (error.localizedDescription)
            }
            print("ReactNative Error get")
            return nil
        }
        
        func put(data: Data?, codec: Int) -> Data? {
            do {
                print(String(format: "ReactNative put data: %s , codec: %d", data! as NSData, codec))
                return try internalClient.put(dataL data, codec: Int64(codec) )
            } catch let error {
                print("ReactNative put Error")
                print (error.localizedDescription)
            }
            print("ReactNative Error put")
            return nil
        }
    }
    override init() {
        if let appDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
            let fulaStoreURL = appDir.appendingPathComponent("/fula")
            
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
        Task {
            print("ReactNative", "checkConnection started")
            
            if (fula != nil) {
                do {
                        let connectionStatus = try await checkConnectionInternal()
                        resolve(connectionStatus)
                }
                catch let error {
                    print("ReactNative", "checkConnection failed with Error: ", error.localizedDescription)
                    resolve(false)
                }
            }
        }
        }
        
        @objc(newClient:withStorePath:withBloxAddr:withExchange:withAutoFlush:withUseRelay:withResolver:withRejecter:)
        func newClient(identityString: String, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, useRelay: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void  {
        Task {   
            print("ReactNative", "newClient started")
            
            do {
                
                    print("ReactNative", "newClient storePath= ", storePath)
                    let identity = toByte(identityString)
                    print("ReactNative", "newClient identity= ", identityString)
                try await newClientInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, useRelay: useRelay)
                    let peerId = fula.id_()
                    resolve(peerId)
            } catch let error {
                print("ReactNative", "newClient failed with Error: ", error.localizedDescription)
                reject("ERR_FULA", "Can't create client", error)
            }
        }
        }
       
        @objc(isReady:withFilesystemCheck:withResolver:withRejecter:)
        func isReady(filesystemCheck: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void{
          print("ReactNative", "isReady started")
            var initialized = false
            do {
              if (fula != nil && fula.id_() != nil) {
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
                reject("ERR_FULA", "Check if fula is ready", error)
            }
        }
        
        //TODO: we should consider refactor the name of this \
        // function to be compatible with the android version.
        @objc(init:withIdentityString:withStorePath:withBloxAddr:withExchange:withAutoFlush:withRootConfig:withUseRelay:withResolver:withRejecter:)
        func initFula(identityString: String, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, rootConfig: String, useRelay: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        Task{
            print("ReactNative", "init started")
            do {
                
                    var resultData = Dictionary<String, String>()
                    print("ReactNative", "init storePath= ", storePath)
                    let identity = toByte(identityString)
                    print("ReactNative", "init identity= ", identityString)
                let obj = try await initInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, rootCid: rootConfig, useRelay: useRelay)
                    print("ReactNative", "init object created: [ " + obj[0] + ", " + obj[1] + ", " + obj[2] + " ]")
                    resultData["peerId"] = obj[0]
                    resultData["rootCid"] = obj[1]
                    resultData["private_ref"] = obj[2]
                    resolve(resultData)
                
            } catch let error {
                print("ReactNative", "init failed with Error: ", error.localizedDescription)
                reject("ERR_FULA", "init failed", error)
            }
        }
        }
        
        @objc(logout:withStorePath:withResolver:withRejecter:)
        func logout(identityString: String, storePath: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void{
        Task {
            print("ReactNative", "logout started")
            do {
                    let identity = toByte(identityString)
                let obj = try await logoutInternal(identity: identity, storePath: storePath)
                    print("ReactNative", "logout completed")
                    resolve(obj)
                
            } catch let error {
                print("ReactNative", "logout failed with Error: ", error.localizedDescription)
                reject("ERR_FULA", "logout failed", error)
            }
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
                  let failedLinks = try fula.listFailedPushes()
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
              reject("ERR_FULA", "CheckFailedActions failed", error)
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
              var encryptedKey = userDataHelper.getValue(key: PRIVATE_KEY_STORE_ID)
              let secretKey = try Cryptography.generateKey(salt: privateKey)
            if (encryptedKey == nil) {
              let autoGeneratedIdentity = FulamobileGenerateEd25519Key()
              encryptedKey = try encryptMsg(Data(autoGeneratedIdentity).base64EncodedString(), secretKey)
                userDataHelper.add(key: PRIVATE_KEY_STORE_ID, value: encryptedKey)
            }
            return Data(decryptMsg(encryptedKey, secretKey).utf8)

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
                fula.Flush()
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
                fula.Flush()
            }
            let secretKey = try Cryptography.generateKey(identity)
            let identity_encrypted: String = try Cryptography.encryptMsg(identity.toHex(), secretKey)
            userDataHelper.remove("cid_encrypted_"+identity_encrypted)
            userDataHelper.remove("private_ref_encrypted_"+identity_encrypted)

            //TODO: Should also remove peerid @Mahdi

            userDataHelper.remove("cid_encrypted_"+identity_encrypted)
            userDataHelper.remove("private_ref_encrypted_"+identity_encrypted)

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

        func getFulaClient() -> FulamobileClient {
            return fula
        }

        func newClientInternal(identity: Data, storePath: String, bloxAddr: String, exchange: String, autoFlush: String, useRelay: String) throws -> Data {
            do {
                fulaConfig = FulamobileConfig()
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
                    fula.Flush()
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
                print("ReactNative", "fula initialized: " + fula.id_())
            }

            let secretKey = Cryptography.generateKey(identity)
            let identity_encrypted = Cryptography.encryptMsg(identity.toString(), secretKey)
            identityEncryptedGlobal = identity_encrypted
            secretKeyGlobal = secretKey

            if (rootConfig == nil || rootConfig.getCid().isEmpty || rootConfig.getPrivate_ref().isEmpty) {
                print("ReactNative", "rootCid is empty.")
                //Load from keystore

                let cid_encrypted_fetched = sharedPref.getValue("cid_encrypted_"+identity_encrypted)
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
            let peerId = fula.id_()
            var obj = [String]()
            obj.append(peerId)
            obj.append(rootConfig.getCid())
            obj.append(rootConfig.getPrivate_ref())
            print("ReactNative", "initInternal is completed successfully")
            if (fula != nil) {
                fula.Flush()
            }
            return obj
            } catch let error {
            print("ReactNative", "init internal failed with Error: " , error.localizedDescription)
            throw error
            }
        }

        
        @objc(mkdir:withPath:withResolver:withRejecter:)
        func mkdir(path: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        Task{
            print("ReactNative", "mkdir: path = " + path)
            do {
                
                    let config = try await wnfsWrapper.Mkdir(client, rootConfig.getCid(), rootConfig.getPrivate_ref(), path)
                    if(config != nil) {
                        rootConfig = config
                        encrypt_and_store_config()
                        if (fula != nil) {
                        fula.Flush()
                        }
                        resolve(config.getCid())
                    } else {
                        print("ReactNative", "mkdir Error: config is nil")
                        reject("ERR_WNFS", "Can't make dir", error)
                    }
                
            } catch let error{
                print("mkdir", error.localizedDescription)
                reject("ERR_WNFS", "mkdir", error)
            }
        }
        }

        @objc(writeFile:withFulaTargetFilename:withLocalFilename:withResolver:withRejecter:)
        func writeFile(fulaTargetFilename: String, localFilename: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        /*
        // reads content of the file form localFilename (should include full absolute path to local file with read permission
        // writes content to the specified location by fulaTargetFilename in Fula filesystem
        // fulaTargetFilename: a string including full path and filename of target file on Fula (e.g. root/pictures/cat.jpg)
        // localFilename: a string containing full path and filename of local file on hte device (e.g /usr/bin/cat.jpg)
        // Returns: new cid of the root after this file is placed in the tree
            */
        Task {
        print("ReactNative", "writeFile to : path = " + fulaTargetFilename + ", from: " + localFilename)
        do {
        let config = try wnfsWrapper.WriteFileFromPath(client, rootConfig.getCid(), rootConfig.getPrivate_ref(), fulaTargetFilename, localFilename)
        if(config != nil) {
            rootConfig = config
            encrypt_and_store_config()
            if (fula != nil) {
            fula.Flush()
            }
            resolve(config.getCid())
        } else {
            print("ReactNative", "writeFile Error: config is nil")
            reject("ERR_WNFS", "writeFile Error: config is nil", nil)
        }
        } catch let error {
        print("writeFile", error.localizedDescription)
        reject("ERR_WNFS", "writeFile", error)
        }
        }

        }

        @objc(writeFileContent:withContentString:withResolver:withRejecter:)
        func writeFileContent(path: String, contentString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task{
            print("ReactNative", "writeFile: contentString = " + contentString)
            print("ReactNative", "writeFile: path = " + path)
            do {  
            let content = convertStringToByte(contentString)
            let config = try wnfsWrapper.WriteFile(client, rootConfig.getCid(), rootConfig.getPrivate_ref(), path, content)
            rootConfig = config
            encrypt_and_store_config()
            if (fula != nil) {
                fula.Flush()
            }
            resolve(config.getCid())
            } catch let error {
            print("writeFileContent", error.localizedDescription)
            reject("ERR_WNFS", "writeFileContent", error)
            }
        }
        }

        @objc(ls:withResolver:withRejecter:)
        func ls(path: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task{
            print("ReactNative", "ls: path = " + path)
            do {
            let res =  try wnfsWrapper.Ls(client, rootConfig.getCid(), rootConfig.getPrivate_ref(), path)

            //JSONArray jsonArray = new JSONArray(res)
            let s = String(res, encodings: .utf8)
            print("ReactNative", "ls: res = " + s)
            resolve(s)
            } catch let error {
            print("ls", error.localizedDescription)
            reject("ERR_WNFS", "ls", error)
            }
        }
        }

        @objc(rm:withResolver:withRejecter:)
        func rm(path: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task{
            print("ReactNative", "rm: path = " + path)
            do {
            let config = try wnfsWrapper.Rm(client, rootConfig.getCid(), rootConfig.getPrivate_ref(), path)
            if(config != nil) {
                rootConfig = config
                encrypt_and_store_config()
                if (fula != nil) {
                fula.Flush()
                }
                resolve(config.getCid())
            } else {
                print("ReactNative", "rm Error: config is nil")
                reject("ERR_WNFS", "rm Error: config is nil", nil)
            }
            } catch let error {
            print("rm", error.localizedDescription)
            reject("ERR_WNFS", "rm", error)
            }
        }
        }

        @objc(cp:withTargetPath:withResolver:withRejecter:)
        func cp(sourcePath: String, targetPath: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "rm: sourcePath = " + sourcePath)
            do {
            let config = wnfsWrapper.Cp(client, rootConfig.getCid(), rootConfig.getPrivate_ref(), sourcePath, targetPath)
            if(config != nil) {
                rootConfig = config
                encrypt_and_store_config()
                if (fula != nil) {
                fula.Flush()
                }
                resolve(config.getCid())
            } else {
                print("ReactNative", "cp Error: config is nil")
                reject("ERR_WNFS", "cp Error: config is nil", nil)
            }
            } catch let error {
            print("cp", error.localizedDescription)
            reject("ERR_WNFS", "cp", error)
            }
        }
        }

        @objc(mv:withTargetPath:withResolver:withRejecter:)
        func mv(sourcePath: String, targetPath: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "rm: sourcePath = " + sourcePath)
            do {
            let config = wnfsWrapper.Mv(client, rootConfig.getCid(), rootConfig.getPrivate_ref(), sourcePath, targetPath)
            if(config != nil) {
                rootConfig = config
                encrypt_and_store_config()
                if (fula != nil) {
                fula.Flush()
                }
                resolve(config.getCid())
            } else {
                print("ReactNative", "mv Error: config is nil")
                reject("ERR_WNFS", "mv Error: config is nil", nil)
            }
            } catch let error {
            print("mv", error.localizedDescription)
            reject("ERR_WNFS", "mv", error)
            }
        }
        }

        @objc(readFile:withLocalFilename:withResolver:withRejecter:)
        func readFile(fulaTargetFilename: String, localFilename: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        /*
        // reads content of the file form localFilename (should include full absolute path to local file with read permission
        // writes content to the specified location by fulaTargetFilename in Fula filesystem
        // fulaTargetFilename: a string including full path and filename of target file on Fula (e.g. root/pictures/cat.jpg)
        // localFilename: a string containing full path and filename of local file on hte device (e.g /usr/bin/cat.jpg)
        // Returns: new cid of the root after this file is placed in the tree
            */
        Task {
            print("ReactNative", "readFile: fulaTargetFilename = " + fulaTargetFilename)
            do {
            let path = wnfsWrapper.ReadFilestreamToPath(client, rootConfig.getCid(), rootConfig.getPrivate_ref(), fulaTargetFilename, localFilename)
            resolve(path)
            } catch let error {
            print("readFile", error.localizedDescription)
            reject("ERR_WNFS", "readFile", error)
            }
        }
        }

        @objc(readFileContent:withResolver:withRejecter:)
        func readFileContent(path: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "readFileContent: path = " + path)
            do {
            let res = wnfsWrapper.ReadFile(client, rootConfig.getCid(), rootConfig.getPrivate_ref(), path)
            let resString = toString(res)
            resolve(resString)
            } catch let error {
            print("readFileContent", error.localizedDescription)
            reject("ERR_WNFS", "readFileContent", error)
            }
        }
        }

        @objc(get:withResolver:withRejecter:)
        func get(keyString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "get: keyString = " + keyString)
            do {
            let key: Data = convertStringToByte(keyString)
            let value = try getInternal(key)
            let valueString: String = toString(value)
            resolve(valueString)
            } catch let error {
            print("get", error.localizedDescription)
            reject("ERR_FULA", "get", error)
            }
        }
        }

        func getInternal(key: Data) throws -> Data {
        do {
            print("ReactNative", "getInternal: key.toString() = " + toString(key))
            print("ReactNative", "getInternal: key.toString().bytes = " + key.toString())
            let value = try fula.Get(key)
            print("ReactNative", "getInternal: value.toString() = " + toString(value))
            return value
        } catch let error {
            print("ReactNative", "getInternal: error = " + error.localizedDescription)
            print("getInternal", error.localizedDescription)
            throw error
        }
        }

        @objc(has:withResolver:withRejecter:)
        func has(keyString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "has: keyString = " + keyString)
            do {
            let key: Data = convertStringToByte(keyString)
            let result = try hasInternal(key)
            resolve(result)
            } catch let error {
            print("has", error.localizedDescription)
            reject("ERR_FULA", "has", error)
            }
        }
        }

        func hasInternal(key: Data) throws -> Bool {
        do {
            let res = try fula.Has(key)
            return res
        } catch let error {
            print("hasInternal", error.localizedDescription)
            throw error
        }
        }

        func pullInternal(key: Data) throws -> Data {
        do {
            return try fula.Pull(key)
        } catch let error {
            print("pullInternal", error.localizedDescription)
            throw error
        }
        }

        @objc(push:withResolver:withRejecter:)
        func push(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "push started")
            do {
            try pushInternal(convertStringToByte(rootConfig.getCid()))
            resolve(rootConfig.getCid())
            } catch let error {
            print("get", error.localizedDescription)
            reject("ERR_FULA", "push", error)
            }
        }
        }

        func pushInternal(key: Data) throws -> Void {
        do {
            if (fula != nil && try fula.Has(key)) {
            try fula.Push(key)
            try fula.Flush()
            } else {
            print("ReactNative", "pushInternal error: key wasn't found or fula is not initialized")
            throw MyError.runtimeError("pushInternal error: key wasn't found or fula is not initialized")
            }
        } catch let error {
            print("ReactNative", "pushInternal", error.localizedDescription)
            throw error
        }
        }

        @objc(put:withCodecString:withResolver:withRejecter:)
        func put(valueString: String, codecString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "put: codecString = " + codecString)
            print("ReactNative", "put: valueString = " + valueString)
            do {
            //byte[] codec = convertStringToByte(CodecString)
            let codec = Int(codecString)


            print("ReactNative", "put: codec = " + codec)
            let value = toByte(valueString)

            print("ReactNative", "put: value.toString() = " + toString(value))
            let key = try putInternal(value, codec)
            print("ReactNative", "put: key.toString() = " + toString(key))
            resolve(toString(key))
            } catch let error {
            print("ReactNative", "put: error = ", error.localizedDescription)
            reject("ERR_FULA", "put", error)
            }
        }
        }

        func putInternal(value: Data, codec: Int) throws -> Data {
        do {
            if(fula != nil) {
            let key: Data = try fula.Put(value, codec)
            try fula.Flush()
            return key
            } else {
            print("ReactNative", "putInternal Error: fula is not initialized")
            throw MyError.runtimeError("putInternal Error: fula is not initialized")
            }
        } catch let error {
            print("ReactNative", "putInternal", error.localizedDescription)
            throw error
        }
        }

        @objc(setAuth:withAllow:withResolver:withRejecter:)
        func setAuth(peerIdString: String, allow: Bool,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "setAuth: peerIdString = " + peerIdString)
            do {
            if (fula != nil && fula.id_() != nil && fulaConfig != nil && fulaConfig.getBloxAddr() != nil) {
                let bloxAddr = fulaConfig.getBloxAddr()
                print("ReactNative", "setAuth: bloxAddr = '",bloxAddr,"'"," peerIdString = '",peerIdString,"'")
                let index = bloxAddr.lastIndexOf("/")
                let bloxPeerId = bloxAddr.substring(index + 1)
                try fula.setAuth(bloxPeerId, peerIdString, allow)
                resolve(true)
            } else {
                print("ReactNative", "setAuth error: fula is not initialized")
                throw MyError.runtimeError("fula is not initialized")
            }
            resolve(false)
            } catch let error {
            print("get", error.localizedDescription)
            reject("ERR_FULA", "setAuth", error)
            }
        }
        }

        @objc(shutdown:withResolver:withRejecter:)
        func shutdown( resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            do {
            if(fula != nil) {
                try fula.Shutdown()
                fula = nil
                client = nil
            }
            resolve(true)
            } catch let error {
            print("ReactNative", "shutdown", error.localizedDescription)
            reject("ERR_FULA", "shutdown", error)
            }
        }
        }

        ///////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////
        //////////////////////ANYTHING BELOW IS FOR BLOCKCHAIN/////
        ///////////////////////////////////////////////////////////
        @objc(createAccount:withResolver:withRejecter:)
        func createAccount(seedString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "createAccount: seedString = ", seedString)
            do {
            if (fula == nil || fula.id_() == nil || fula.id_().isEmpty) {
                reject("ERR_FULA", "createAccount", MyError.runtimeError("Fula client is not initialized"))
            } else {

                if (!seedString.startsWith("/")) {
                reject("ERR_FULA", "createAccount", MyError.runtimeError("seed should start with /"))
                }
                let result = try fula.Seeded(seedString)
                let resultString = toString(result)
                resolve(resultString)
            }
            } catch let error {
            print("createAccount", error.localizedDescription)
            reject("ERR_FULA", "createAccount", error)
            }
        }
        }

        @objc(checkAccountExists:withResolver:withRejecter:)
        func checkAccountExists(accountString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "checkAccountExists: accountString = ", accountString)
            do {
            let result = try fula.AccountExists(accountString)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("checkAccountExists", error.localizedDescription)
            reject("ERR_FULA", "checkAccountExists", error)
            }
        }
        }

        @objc(createPool:withPoolName:withResolver:withRejecter:)
        func createPool(seedString: String, poolName: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "createPool: seedString = " + seedString + " poolName = " + poolName)
            do {
            let result = try fula.PoolCreate(seedString, poolName)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("createPool", error.localizedDescription)
            reject("ERR_FULA", "createPool", error)
            }
        }
        }

        @objc(listPools:withResolver:withRejecter:)
        func listPools( resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "listPools")
            do {
            let result = try fula.PoolList()
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("listPools", error.localizedDescription)
            reject("ERR_FULA", "listPools", error)
            }
        }
        }

        @objc(joinPool:withPoolID:withResolver:withRejecter:)
        func joinPool(seedString: String, poolID: Int,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "joinPool: seedString = ",seedString," poolID = ",poolID)
            do {
            let result = try fula.PoolJoin(seedString, poolID)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("joinPool", error.localizedDescription)
            reject("ERR_FULA", "joinPool", error)
            }
        }
        }

        @objc(cancelPoolJoin:withPoolID:withResolver:withRejecter:)
        func cancelPoolJoin(seedString: String, poolID: long,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "cancelPoolJoin: seedString = " + seedString + " poolID = " + poolID)
            do {
            let result = try fula.PoolCancelJoin(seedString, poolID)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("cancelPoolJoin", error.localizedDescription)
            reject("ERR_FULA", "cancelPoolJoin", error)
            }
        }
        }

        @objc(listPoolJoinRequests:withResolver:withRejecter:)
        func listPoolJoinRequests(poolID: Int,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task{
            print("ReactNative", "listPoolJoinRequests: poolID = " + poolID)
            do {
            let result = try fula.PoolRequests(poolID)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("listPoolJoinRequests", error.localizedDescription)
            reject("ERR_FULA", "listPoolJoinRequests", error)
            }
        }
        }

        @objc(votePoolJoinRequest:withPoolID:withAccountString:withAccept:withResolver:withRejecter:)
        func votePoolJoinRequest(seedString: String, poolID: long, accountString: String, accept: Bool,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "votePoolJoinRequest: seedString = " + seedString + " poolID = " + poolID + " accountString = " + accountString + " accept = " + accept)
            do {
            let result = try fula.PoolVote(seedString, poolID, accountString, accept)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("votePoolJoinRequest", error.localizedDescription)
            reject("ERR_FULA", "votePoolJoinRequest", error)
            }
        }
        }

        @objc(leavePool:withPoolID:withResolver:withRejecter:)
        func leavePool(seedString: String, poolID: long,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "leavePool: seedString = " + seedString + " poolID = " + poolID)
            do {
            let result = try fula.PoolLeave(seedString, poolID)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("leavePool", error.localizedDescription)
            reject("ERR_FULA", "leavePool", error)
            }
        }
        }

        @objc(newReplicationRequest:withPoolID:withReplicationFactor:withCid:withResolver:withRejecter:)
        func newReplicationRequest(seedString: String, poolID: Int, replicationFactor: Int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "newReplicationRequest: seedString = " + seedString + " poolID = " + poolID + " replicationFactor = " + replicationFactor + " cid = " + cid)
            do {
            let result = try fula.ManifestUpload(seedString, poolID, replicationFactor, cid)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("newReplicationRequest", error.localizedDescription)
            reject("ERR_FULA", "newReplicationRequest", error)
            }
        }
        }

        @objc(newStoreRequest:withPoolID:withUploader:withCid:withResolver:withRejecter:)
        func newStoreRequest(seedString: String, poolID: Int, uploader: String, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "newStoreRequest: seedString = " + seedString + " poolID = " + poolID + " uploader = " + uploader + " cid = " + cid)
            do {
            let result = try fula.ManifestStore(seedString, poolID, uploader, cid)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("newStoreRequest", error.localizedDescription)
            reject("ERR_FULA", "newStoreRequest", error)
            }
        }
        }

        @objc(listAvailableReplicationRequests:withResolver:withRejecter:)
        func listAvailableReplicationRequests(poolID: Int,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "listAvailableReplicationRequests: poolID = " + poolID)
            do {
            let result = try fula.ManifestAvailable(poolID)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("listAvailableReplicationRequests", error.localizedDescription)
            reject("ERR_FULA", "listAvailableReplicationRequests", error)
            }
        }
        }

        @objc(removeReplicationRequest:withPoolID:withCid:withResolver:withRejecter:)
        func removeReplicationRequest(seedString: String, poolID: Int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "newReplicationRequest: seedString = " + seedString + " poolID = " + poolID + " cid = " + cid)
            do {
            let result = try fula.ManifestRemove(seedString, poolID,  cid)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("removeReplicationRequest", error.localizedDescription)
            reject("ERR_FULA", "removeReplicationRequest", error)
            }
        }
        }

        @objc(removeStorer:withStorage:withPoolID:withCid:withResolver:withRejecter:)
        func removeStorer(seedString: String, storage: String, poolID: int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "removeStorer: seedString = " + seedString + " storage = " + storage + " poolID = " + poolID + " cid = " + cid)
            do {
            let result = try fula.ManifestRemoveStorer(seedString, storage, poolID, cid)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("removeStorer", error.localizedDescription)
            reject("ERR_FULA", "removeStorer", error)
            }
        }
        }

        @objc(removeStoredReplication:withUploader:withPoolID:withCid:withResolver:withRejecter:)
        func removeStoredReplication(seedString: String, uploader: String, poolID: Int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "removeStoredReplication: seedString = " + seedString + " uploader = " + uploader + " poolID = " + poolID + " cid = " + cid)
            do {
            let result = try fula.ManifestRemoveStored(seedString, uploader, poolID, cid)
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("removeStoredReplication", error.localizedDescription)
            reject("ERR_FULA", "removeStoredReplication", error)
            }
        }
        }

        @objc(bloxFreeSpace:withResolver:withRejecter:)
        func bloxFreeSpace( resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "bloxFreeSpace")
            do {
            let result = try fula.BloxFreeSpace()
            let resultString = toString(result)
            resolve(resultString)
            } catch let error {
            print("bloxFreeSpace", error.localizedDescription)
            reject("ERR_FULA", "bloxFreeSpace", error)
            }
        }
        }
    }
    }
