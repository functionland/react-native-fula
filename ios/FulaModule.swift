import Foundation
import CommonCrypto
import Wnfs
import Fula

@objc(FulaModule)
class FulaModule: NSObject {
    public let NAME: String = "FulaModule"
    var fula: FulamobileClient?
    
    var client: Client?
    var wnfs: Wnfs?
    var fulaConfig: FulamobileConfig?
    var appDir: URL
    var fulaStorePath: String
    // Related to the Wnfs library
    var rootCid: Cid?
    var wnfsKey: Data?
    let userDataHelper = UserDataHelper()
    var secretKeyGlobal: Array<UInt8>?
    var identityEncryptedGlobal: String?
    static let PRIVATE_KEY_STORE_ID = "PRIVATE_KEY"

    // FIXME: Hardcoded ,fula should remove all the codec arguments as the rs-wnfs library removed its usage now.
    static let CODEC_DAG_CBOR = Int64(113)

    enum MyError: Error {
        case runtimeError(String)
    }
    
    @objc(Client)
    public class Client: NSObject {
        let internalClient: FulamobileClient
        
        init(clientInput:  FulamobileClient) {
            internalClient = clientInput
        }
        
        func get(_ cid: Data) throws -> Data {
            do {
                print(String(format: "ReactNative get cid: %s", cid.toString()))
                return try internalClient.get(cid)
            } catch let error {
                throw error
            }
        }
        
        func put(_ cid: Data, _ data: Data) throws -> Void {
            do {
                print(String(format: "ReactNative put data: %s", data.toString()))
                try internalClient.put(data, codec: 113)
            } catch let error {
                print("ReactNative put Error")
                throw error
            }
            print("ReactNative Error put")
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
    }
    func convertConfigToJson(config: Cid) -> String {
        return String(format: "{\"cid\": \"%@\"}", config)
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
                    let peerId = fula?.id_()
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
                if (fula != nil && !fula?.id_().isEmpty) {
                    if (filesystemCheck) {
                        if (client != nil && rootCid != nil && !rootCid!.isEmpty) {
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
        @objc(initFula:withStorePath:withBloxAddr:withExchange:withAutoFlush:withrootCid:withUseRelay:withResolver:withRejecter:)
        func initFula(identityString: String, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, rootCid: String, useRelay: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
            Task{
                print("ReactNative", "init started")
                do {

                    var resultData = Dictionary<String, String>()
                    print("ReactNative", "init storePath= ", storePath)
                    let identity = toByte(identityString)
                    print("ReactNative", "init identity= ", identityString)
                    let obj = try await initInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, rootCid: rootCid, useRelay: useRelay)
                    print("ReactNative", "init object created: [ " + obj[0] + ", " + obj[1] + ", " + obj[2] + " ]")
                    resultData["peerId"] = obj[0]
                    resultData["rootCid"] = obj[1]
                    resultData["wnfs_key"] = obj[2]
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
                    let obj = try await logoutInternal(identity: identity, _storePath: storePath)
                    print("ReactNative", "logout completed")
                    resolve(obj)

                } catch let error {
                    print("ReactNative", "logout failed with Error: ", error.localizedDescription)
                    reject("ERR_FULA", "logout failed", error)
                }
            }
        }

        func checkConnectionInternal() async throws  {
            print("ReactNative", "checkConnectionInternal started")
            if (fula != nil) {
                do {
                    print("ReactNative", "connectToBlox started")
                    try fula?.connectToBlox()
                } catch let error {
                    print("ReactNative", "checkConnectionInternal failed with Error: ", error.localizedDescription)
                    throw error
                }
            } else {
                print("ReactNative", "checkConnectionInternal failed because fula is not initialized ")
            }
        }

        @objc(checkFailedActions:withRetry:withResolver:withRejecter:)
        func checkFailedActions(retry: Bool, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void{
            do {
                if (fula != nil) {
                    if (!retry) {
                        print("ReactNative", "checkFailedActions without retry")
                        let failedLinks = try fula?.listFailedPushes()
                        if (failedLinks.hasNext()) {
                            print("ReactNative", "checkFailedActions found: ", try failedLinks.next().toString())
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    } else {
                        print("ReactNative", "checkFailedActions with retry")
                        Task{
                            let retryResults = await retryFailedActionsInternal()
                            resolve(!retryResults)
                        }
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
            print("ReactNative", "retryFailedActionsInternal started")
            if (fula != nil) {
                //Fula is initialized
                do {
                    try await checkConnectionInternal()

                    do {
                        print("ReactNative", "retryFailedPushes started")
                        try fula?.retryFailedPushes()
                        print("ReactNative", "flush started")
                        try fula?.flush()
                        return true
                    }
                    catch let error {
                        try fula?.flush()
                        print("ReactNative", "retryFailedActionsInternal failed with Error: ", error.localizedDescription)
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

        }


        func createPeerIdentity(privateKey: Data) throws -> Data {
            do {
                // 1: First: create public key from provided private key
                // 2: Should read the local keychain store (if it is key-value, key is public key above,
                // 3: if found, decrypt using the private key
                // 4: If not found or decryption not successful, generate an identity
                // 5: then encrypt and store in keychain
                // TODO: recheck error handling
                var encryptedKey = userDataHelper.getValue(FulaModule.PRIVATE_KEY_STORE_ID)
                let secretKey = try Cryptography.generateKey(privateKey)
                if (encryptedKey == nil) {
                    var error: NSError?
                    let autoGeneratedIdentity = FulamobileGenerateEd25519Key(&error)
                    if error != nil {
                        throw error!
                    }
                    encryptedKey = try Cryptography.encryptMsg(autoGeneratedIdentity!.toUint8Array(), secretKey)
                    userDataHelper.add(FulaModule.PRIVATE_KEY_STORE_ID, encryptedKey!)
                }
                return try Cryptography.decryptMsg(encryptedKey!, secretKey).toData()

            } catch let error {
                print("ReactNative", "createPeerIdentity failed with Error: ", error.localizedDescription)
                throw error
            }
        }

        func createNewrootCid(identity: Data) throws -> Void {
            rootCid = try wnfs?.Init(wnfsKey: identity)
            wnfsKey = identity
            print("ReactNative", "privateForest is created: ", rootCid!)
            if (fula != nil) {
                try fula?.flush()
            }
            print("ReactNative", "rootCid is created: cid=", rootCid!, " & wnfs_key=", identity)
            try encryptAndStoreConfig()
        }

        func loadWnfs(_ wnfsKey: Data , _ _rootCid: String) throws {
            print("ReactNative", "loadWnfs called: rootCid=", _rootCid)
            try wnfs?.LoadWithWNFSKey(wnfsKey: wnfsKey, cid: _rootCid)
            rootCid = _rootCid
            if (fula != nil) {
                try fula?.flush()
            }
            print("ReactNative", "loadWnfs completed")
            try encryptAndStoreConfig()
        }


        func encryptAndStoreConfig() throws {
            do {
                if(identityEncryptedGlobal != nil) {
                    let cid_encrypted = try Cryptography.encryptMsg(rootCid!.toUint8Array(), secretKeyGlobal!)
                    let wnfs_key_encrypted = try Cryptography.encryptMsg(wnfsKey!.toUint8Array(), secretKeyGlobal!)

                    userDataHelper.add("cid_encrypted_" + identityEncryptedGlobal!, cid_encrypted)
                    userDataHelper.add("wnfs_key_encrypted_" + identityEncryptedGlobal!, wnfs_key_encrypted)
                }
            } catch let error {
                print("ReactNative", "encryptAndStoreConfig failed with Error: ", error.localizedDescription)
                throw error
            }
        }

        func logoutInternal(identity: Data, _storePath: String?) throws {
            do {
                if (fula != nil) {
                    try fula?.flush()
                }
                let secretKey = try Cryptography.generateKey(identity)
                let identity_encrypted: String = try Cryptography.encryptMsg(identity.toUint8Array(), secretKey)
                userDataHelper.remove("cid_encrypted_"+identity_encrypted)

                //TODO: Should also remove peerid @Mahdi

                userDataHelper.remove("cid_encrypted_"+identity_encrypted)

                rootCid = nil
                secretKeyGlobal = nil
                identityEncryptedGlobal = nil
                var storePath = _storePath
                if (storePath == nil || storePath!.isEmpty) {
                    storePath = fulaStorePath
                }

                do{
                    try FileManager.default.removeItem(atPath: fulaStorePath)
                }catch let error{
                    print("Deleting fula store path", error.localizedDescription)
                    throw error
                }
            } catch let error {
                print("ReactNative", "logout internal failed with Error: ", error.localizedDescription)
                throw error
            }
        }

        func getFulaClient() -> FulamobileClient? {
            return fula
        }

        func newClientInternal(identity: Data, storePath: String?, bloxAddr: String, exchange: String, autoFlush: Bool, useRelay: Bool) throws -> Data {
            do {
                fulaConfig = FulamobileConfig()
                if (storePath == nil || storePath!.isEmpty) {
                    fulaConfig!.storePath = fulaStorePath
                } else {
                    fulaConfig!.storePath = storePath!
                }
                print("ReactNative", "storePath is set: " + fulaConfig!.storePath)

                let peerIdentity = try createPeerIdentity(privateKey: identity)
                fulaConfig!.identity = peerIdentity
                print("ReactNative", "peerIdentity is set: " + fulaConfig!.identity!.toString())
                fulaConfig!.bloxAddr = bloxAddr
                print("ReactNative", "bloxAddr is set: " + fulaConfig!.bloxAddr)
                fulaConfig!.exchange = exchange
                fulaConfig!.syncWrites = autoFlush
                if (useRelay) {
                    fulaConfig!.allowTransientConnection = true
                    fulaConfig!.forceReachabilityPrivate = true
                }
                if (fula == nil) {
                    print("ReactNative", "Creating a Fula instance")
                    fula = FulamobileClient(fulaConfig)
                }
                if (fula != nil) {
                    try fula?.flush()
                }
                return peerIdentity
            } catch let error {
                print("ReactNative", "newclientInternal failed with Error: ", error.localizedDescription)
                throw error
            }
        }

        func initInternal(identity: Data, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, _rootCid: String, useRelay: Bool) throws -> [String] {

            do {
                if (fula == nil) {
                    try newClientInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, useRelay: useRelay)
                }
                if(client == nil) {
                    client = Client(clientInput: fula!)
                    wnfs = Wnfs(putFn: { cid, data in
                        guard let c = self.client else {
                            throw MyError.runtimeError("wnfs: fula client not ready")
                        }
                        try c.put(cid, data)
                    }, getFn: { cid in
                        guard let c = self.client else {
                            throw MyError.runtimeError("wnfs: fula client not ready")
                        }
                        return try c.get(cid)
                    })
                    print("ReactNative", "fula initialized: " + fula?.id_())
                }

                let secretKey = try Cryptography.generateKey(identity)
                let identity_encrypted = try Cryptography.encryptMsg(identity.toUint8Array(), secretKey)
                identityEncryptedGlobal = identity_encrypted
                secretKeyGlobal = secretKey

                if (rootCid == nil || rootCid!.isEmpty) {
                    print("ReactNative", "rootCid is empty.")
                    //Load from keystore

                    let cid_encrypted_fetched = userDataHelper.getValue("cid_encrypted_"+identity_encrypted)
                    print("ReactNative", "Here1")
                    var cid: Array<UInt8>
                    if(cid_encrypted_fetched != nil && !cid_encrypted_fetched!.isEmpty) {
                        print("ReactNative", "decrypting cid="+cid_encrypted_fetched!+" with secret="+secretKey.toString())
                        cid = try Cryptography.decryptMsg(cid_encrypted_fetched!, secretKey)
                    }
                    print("ReactNative", "Here2")
                    //print("ReactNative", "Attempted to fetch cid from keystore cid="+cid+" & wnfs_key="+wnfs_key)
                    if(cid.isEmpty){
                        print("ReactNative", "cid or wnfs key was not found")
                        if(!_rootCid.isEmpty){
                            print("ReactNative", "Re-setting cid from input: "+_rootCid)
                            cid = _rootCid.toUint8Array()
                        }
                        if(cid.isEmpty){
                            print("ReactNative", "Tried to recover cid and privateRef but was not successful. Creating ones")
                            try createNewrootCid(identity: identity)
                        }
                    } else {
                        print("ReactNative", "Found cid and wnfs key in keychain store")
                        print("ReactNative", "Recovered cid and private ref from keychain store. cid=",cid," & wnfs_key=",identity)
                        try loadWnfs(identity, cid.toString())
                    }
                    print("ReactNative", "creating/reloading rootCid completed")

                    /*
                     byte[] testbyte = convertStringToByte("-104,40,24,-93,24,100,24,114,24,111,24,111,24,116,24,-126,24,-126,0,0,24,-128,24,103,24,118,24,101,24,114,24,115,24,105,24,111,24,110,24,101,24,48,24,46,24,49,24,46,24,48,24,105,24,115,24,116,24,114,24,117,24,99,24,116,24,117,24,114,24,101,24,100,24,104,24,97,24,109,24,116")
                     long testcodec = 85
                     byte[] testputcid = client!.put(testbyte, testcodec)
                     print("ReactNative", "client!.put test done"+ Arrays.toString(testputcid))
                     byte[] testfetchedcid = convertStringToByte("1,113,18,32,-6,-63,-128,79,-102,-89,57,77,-8,67,-98,8,-81,40,-87,123,122,29,-52,-124,-60,-53,100,105,125,123,-5,-99,41,106,-124,-64")
                     byte[] testfetchedbytes = client!.get(testfetchedcid)
                     print("ReactNative", "client!.get test done"+ Arrays.toString(testfetchedbytes))
                     */


                    print("ReactNative", "rootCid is created: cid=" , rootCid,"& wnfs_key=",wnfsKey!.toString())
                } else {
                    print("ReactNative", "rootCid existed: cid=" , rootCid," & wnfs_key=",wnfsKey!.toString())
                }
                let peerId = fula?.id_()
                var obj = [String]()
                obj.append(peerId)
                obj.append(rootCid!)
                obj.append(wnfsKey!.toString())
                print("ReactNative", "initInternal is completed successfully")
                if (fula != nil) {
                    try fula?.flush()
                }
                return obj
            } catch let error {
                print("ReactNative", "init internal failed with Error: " , error.localizedDescription)
                throw error
            }
        }


    @objc(mkdir:withResolver:withRejecter:)
    func mkdir(path: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        print("ReactNative", "mkdir: path = " + path)
        do {
            let cid = try wnfs?.MkDir(cid: rootCid!, remotePath: path)
            if(cid != nil) {
                rootCid = cid
                try encryptAndStoreConfig()
                if (fula != nil) {
                    try fula?.flush()
                }
                resolve(rootCid)
            } else {
                print("ReactNative", "mkdir Error: config is nil")
                reject("ERR_WNFS", "Can't make dir", nil)
            }

        } catch let error{
            print("mkdir", error.localizedDescription)
            reject("ERR_WNFS", "mkdir", error)
        }
    }

    @objc(writeFile:withLocalFilename:withResolver:withRejecter:)
    func writeFile(fulaTargetFilename: String, localFilename: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        /*
         // reads content of the file form localFilename (should include full absolute path to local file with read permission
         // writes content to the specified location by fulaTargetFilename in Fula filesystem
         // fulaTargetFilename: a string including full path and filename of target file on Fula (e.g. root/pictures/cat.jpg)
         // localFilename: a string containing full path and filename of local file on hte device (e.g /usr/bin/cat.jpg)
         // Returns: new cid of the root after this file is placed in the tree
         */
            print("ReactNative", "writeFile to : path = " + fulaTargetFilename + ", from: " + localFilename)
            do {
                let cid = try wnfs?.WriteFileFromPath(cid: rootCid!, remotePath: fulaTargetFilename, fileUrl: URL.init(string: localFilename)!)
                if(cid != nil) {
                    rootCid = cid
                    try encryptAndStoreConfig()
                    if (fula != nil) {
                        try fula?.flush()
                    }
                    resolve(rootCid)
                } else {
                    print("ReactNative", "writeFile Error: config is nil")
                    reject("ERR_WNFS", "writeFile Error: config is nil", nil)
                }
            } catch let error {
                print("writeFile", error.localizedDescription)
                reject("ERR_WNFS", "writeFile", error)
            }
    }

    @objc(writeFileContent:withContentString:withResolver:withRejecter:)
    func writeFileContent(path: String, contentString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {

            print("ReactNative", "writeFile: contentString = " + contentString)
            print("ReactNative", "writeFile: path = " + path)
            do {
                let content = convertStringToByte(contentString)
                let cid = try wnfs?.WriteFile(cid: rootCid!, remotePath: path, data: content.toData())
                rootCid = cid
                try encryptAndStoreConfig()
                if (fula != nil) {
                    try fula?.flush()
                }
                resolve(rootCid)
            } catch let error {
                print("writeFileContent", error.localizedDescription)
                reject("ERR_WNFS", "writeFileContent", error)
            }

    }

    @objc(ls:withResolver:withRejecter:)
    func ls(path: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "ls: path = " + path)
            do {
                let res =  try wnfs?.Ls(cid: rootCid!, remotePath: path)

                //JSONArray jsonArray = new JSONArray(res)
                guard let s = res?.toString() else {
                    throw MyError.runtimeError("converting bytes to utf8 string")
                }
                print("ReactNative", "ls: res = " + s)
                resolve(s)
            } catch let error {
                print("ls", error.localizedDescription)
                reject("ERR_WNFS", "ls", error, nil)
            }

    }

    @objc(rm:withResolver:withRejecter:)
    func rm(path: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {

            print("ReactNative", "rm: path = " + path)
            do {
                let cid = try wnfs?.Rm(cid: rootCid!, remotePath: path)
                if(cid != nil) {
                    rootCid = cid
                    try encryptAndStoreConfig()
                    if (fula != nil) {
                        try fula?.flush()
                    }
                    resolve(rootCid)
                } else {
                    print("ReactNative", "rm Error: config is nil")
                    reject("ERR_WNFS", "rm Error: config is nil", nil)
                }
            } catch let error {
                print("rm", error.localizedDescription)
                reject("ERR_WNFS", "rm", error)
            }

    }

    @objc(cp:withTargetPath:withResolver:withRejecter:)
    func cp(sourcePath: String, targetPath: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {

            print("ReactNative", "rm: sourcePath = " + sourcePath)
            do {
                let cid = wnfs?.Cp(cid: rootCid!, remotePathFrom: sourcePath, remotePathTo: targetPath)
                if(cid != nil) {
                    rootCid = cid
                    try encryptAndStoreConfig()
                    if (fula != nil) {
                        try fula?.flush()
                    }
                    resolve(rootCid)
                } else {
                    print("ReactNative", "cp Error: config is nil")
                    reject("ERR_WNFS", "cp Error: config is nil", nil)
                }
            } catch let error {
                print("cp", error.localizedDescription)
                reject("ERR_WNFS", "cp", error)
            }

    }

    @objc(mv:withTargetPath:withResolver:withRejecter:)
    func mv(sourcePath: String, targetPath: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "rm: sourcePath = " + sourcePath)
            do {
                let cid = try wnfs?.Mv(cid: rootCid!, remotePathFrom: sourcePath, remotePathTo: targetPath)
                if(cid != nil) {
                    rootCid = cid
                    try encryptAndStoreConfig()
                    if (fula != nil) {
                        try fula?.flush()
                    }
                    resolve(rootCid)
                } else {
                    print("ReactNative", "mv Error: config is nil")
                    reject("ERR_WNFS", "mv Error: config is nil", nil)
                }
            } catch let error {
                print("mv", error.localizedDescription)
                reject("ERR_WNFS", "mv", error)
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
            print("ReactNative", "readFile: fulaTargetFilename = " + fulaTargetFilename)
            do {
                let path = try wnfs?.ReadFileToPath(cid: rootCid!, remotePath: fulaTargetFilename, fileUrl: URL.init(string: localFilename)!)
                resolve(path)
            } catch let error {
                print("readFile", error.localizedDescription)
                reject("ERR_WNFS", "readFile", error)
            }

    }

    @objc(readFileContent:withResolver:withRejecter:)
    func readFileContent(path: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        Task {
            print("ReactNative", "readFileContent: path = " + path)
            do {
                let res = wnfs?.ReadFile(cid: rootCid!, remotePath: path)
                guard let resString = res?.toString() else{
                    throw MyError.runtimeError("converting bytes to utf8 string")
                }
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
                let key: Data = convertStringToByte(keyString).toData()
                let value = try getInternal(key)
                let valueString: String = toString(value)
                resolve(valueString)
            } catch let error {
                print("get", error.localizedDescription)
                reject("ERR_FULA", "get", error)
            }
        }
    }

    func getInternal(_ key: Data) throws -> Data {
        do {
            print("ReactNative", "getInternal: key.toString() = " + toString(key))
            print("ReactNative", "getInternal: key.toString().bytes = " + key.toString())
            let value = try fula?.get(key)
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
                let key: Data = convertStringToByte(keyString).toData()
                let result = try hasInternal(key)
                resolve(result)
            } catch let error {
                print("has", error.localizedDescription)
                reject("ERR_FULA", "has", error)
            }
        }
    }

    func hasInternal(_ key: Data) throws -> Bool {
        do {
            let ret = UnsafeMutablePointer<ObjCBool>.allocate(capacity: 1)
            try fula?.has(key, ret0_: ret)
            let res = ret.pointee.boolValue
            ret.deallocate()
            return res
        } catch let error {
            print("hasInternal", error.localizedDescription)
            throw error
        }
    }

    func pullInternal(key: Data) throws -> Data {
        do {
            return try fula?.pull(key)
        } catch let error {
            print("pullInternal", error.localizedDescription)
            throw error
        }
    }

    @objc(push:withResolver:withRejecter:)
    func push(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "push started")
            do {
                try pushInternal(key: convertStringToByte(rootCid).toData())
                resolve(rootCid)
            } catch let error {
                print("get", error.localizedDescription)
                reject("ERR_FULA", "push", error)
            }
    }

    func pushInternal(key: Data) throws -> Void {
        do {
            let hasIt = try hasInternal(key)
            if (fula != nil && hasIt) {
                try fula?.push(key)
                try fula?.flush()
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

            print("ReactNative", "put: codecString = " + codecString)
            print("ReactNative", "put: valueString = " + valueString)
            do {
                //byte[] codec = convertStringToByte(CodecString)
                let codec = Int(codecString)


                print("ReactNative", "put: codec = ", codec)
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

    func putInternal(value: Data, codec: Int) throws -> Data {
        do {
            if(fula != nil) {
                let key: Data = try fula?.put(value, codec: FulaModule.CODEC_DAG_CBOR)
                try fula?.flush()
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

            print("ReactNative", "setAuth: peerIdString = " + peerIdString)
            do {
                if (fula != nil && !(fula?.id_().isEmpty)! && fulaConfig != nil && !fulaConfig!.bloxAddr.isEmpty) {
                    let bloxAddr = fulaConfig!.bloxAddr
                    print("ReactNative", "setAuth: bloxAddr = '",bloxAddr,"'"," peerIdString = '",peerIdString,"'")
                    let parts = bloxAddr.split(separator: "/").map(String.init)
                    try fula?.setAuth(parts.last, subject: peerIdString, allow: allow)
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

    @objc(shutdown:withRejecter:)
    func shutdown( resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            do {
                if(fula != nil) {
                    try fula?.shutdown()
                    fula = nil
                    client = nil
                }
                resolve(true)
            } catch let error {
                print("ReactNative", "shutdown", error.localizedDescription)
                reject("ERR_FULA", "shutdown", error)
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
            print("ReactNative", "createAccount: seedString = ", seedString)
            do {
                if (fula == nil ||  ((fula?.id_().isEmpty) != nil)) {
                    reject("ERR_FULA", "createAccount", MyError.runtimeError("Fula client is not initialized"))
                } else {

                    if (!seedString.starts(with: "/")) {
                        reject("ERR_FULA", "createAccount", MyError.runtimeError("seed should start with /"))
                    }
                    let result = try fula!.seeded(seedString)
                    let resultString = toString(result)
                    resolve(resultString)
                }
            } catch let error {
                print("createAccount", error.localizedDescription)
                reject("ERR_FULA", "createAccount", error)
            }

    }

    @objc(checkAccountExists:withResolver:withRejecter:)
    func checkAccountExists(accountString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "checkAccountExists: accountString = ", accountString)
            do {
                let result = try fula!.accountExists(accountString)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("checkAccountExists", error.localizedDescription)
                reject("ERR_FULA", "checkAccountExists", error)
            }

    }

    @objc(createPool:withPoolName:withResolver:withRejecter:)
    func createPool(seedString: String, poolName: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "createPool: seedString = " + seedString + " poolName = " + poolName)
            do {
                let result = try fula!.poolCreate(seedString, poolName: poolName)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("createPool", error.localizedDescription)
                reject("ERR_FULA", "createPool", error)
            }

    }

    @objc(listPools:withRejecter:)
    func listPools( resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "listPools")
            do {
                let result = try fula!.poolList()
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("listPools", error.localizedDescription)
                reject("ERR_FULA", "listPools", error)
            }

    }

    @objc(joinPool:withPoolID:withResolver:withRejecter:)
    func joinPool(seedString: String, poolID: Int,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "joinPool: seedString = ",seedString," poolID = ",poolID)
            do {
                let result = try fula!.poolJoin(seedString, poolID: poolID)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("joinPool", error.localizedDescription)
                reject("ERR_FULA", "joinPool", error)
            }

    }

    @objc(cancelPoolJoin:withPoolID:withResolver:withRejecter:)
    func cancelPoolJoin(seedString: String, poolID: long,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "cancelPoolJoin: seedString = " + seedString + " poolID = " + poolID)
            do {
                let result = try fula?.poolCancelJoin(seedString, poolID: poolID)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("cancelPoolJoin", error.localizedDescription)
                reject("ERR_FULA", "cancelPoolJoin", error)
            }

    }

    @objc(listPoolJoinRequests:withResolver:withRejecter:)
    func listPoolJoinRequests(poolID: Int,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "listPoolJoinRequests: poolID = ", poolID)
            do {
                let result = try fula!.poolRequests(poolID)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("listPoolJoinRequests", error.localizedDescription)
                reject("ERR_FULA", "listPoolJoinRequests", error)
            }

    }

    @objc(votePoolJoinRequest:withPoolID:withAccountString:withAccept:withResolver:withRejecter:)
    func votePoolJoinRequest(seedString: String, poolID: Int, accountString: String, accept: Bool,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "votePoolJoinRequest: seedString = ", seedString ," poolID = ", poolID, " accountString = ", accountString , " accept = ", accept)
            do {
                let result = try fula!.poolVote(seedString, poolID: Int(poolID), account: accountString, voteValue: accept)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("votePoolJoinRequest", error.localizedDescription)
                reject("ERR_FULA", "votePoolJoinRequest", error)
            }

    }

    @objc(leavePool:withPoolID:withResolver:withRejecter:)
    func leavePool(seedString: String, poolID: long,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "leavePool: seedString = " + seedString + " poolID = " + poolID)
            do {
                let result = try fula!.poolLeave(seedString, poolID: poolID)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("leavePool", error.localizedDescription)
                reject("ERR_FULA", "leavePool", error)
            }

    }

    @objc(newReplicationRequest:withPoolID:withReplicationFactor:withCid:withResolver:withRejecter:)
    func newReplicationRequest(seedString: String, poolID: Int, replicationFactor: Int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "newReplicationRequest: seedString = " + seedString + " poolID = " + poolID + " replicationFactor = " + replicationFactor + " cid = " + cid)
            do {
                let result = try fula!.manifestUpload(seedString, poolID, replicationFactor, cid)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("newReplicationRequest", error.localizedDescription)
                reject("ERR_FULA", "newReplicationRequest", error)
            }

    }

    @objc(newStoreRequest:withPoolID:withUploader:withCid:withResolver:withRejecter:)
    func newStoreRequest(seedString: String, poolID: Int, uploader: String, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "newStoreRequest: seedString = " + seedString + " poolID = " + poolID + " uploader = " + uploader + " cid = " + cid)
            do {
                let result = try fula!.manifestStore(seedString, poolID, uploader, cid)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("newStoreRequest", error.localizedDescription)
                reject("ERR_FULA", "newStoreRequest", error)
            }

    }

    @objc(listAvailableReplicationRequests:withResolver:withRejecter:)
    func listAvailableReplicationRequests(poolID: Int,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "listAvailableReplicationRequests: poolID = ", poolID)
            do {
                let result = try fula!.manifestAvailable(poolID)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("listAvailableReplicationRequests", error.localizedDescription)
                reject("ERR_FULA", "listAvailableReplicationRequests", error)
            }

    }

    @objc(removeReplicationRequest:withPoolID:withCid:withResolver:withRejecter:)
    func removeReplicationRequest(seedString: String, poolID: Int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "newReplicationRequest: seedString = " + seedString + " poolID = " + poolID + " cid = " + cid)
            do {
                let result = try fula!.manifestRemove(seedString, poolID,  cid)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("removeReplicationRequest", error.localizedDescription)
                reject("ERR_FULA", "removeReplicationRequest", error)
            }

    }

    @objc(removeStorer:withStorage:withPoolID:withCid:withResolver:withRejecter:)
    func removeStorer(seedString: String, storage: String, poolID: int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "removeStorer: seedString = " + seedString + " storage = " + storage + " poolID = " + poolID + " cid = " + cid)
            do {
                let result = try fula!.manifestRemoveStorer(seedString, storage, poolID, cid)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("removeStorer", error.localizedDescription)
                reject("ERR_FULA", "removeStorer", error)
            }

    }

    @objc(removeStoredReplication:withUploader:withPoolID:withCid:withResolver:withRejecter:)
    func removeStoredReplication(seedString: String, uploader: String, poolID: Int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "removeStoredReplication: seedString = " + seedString + " uploader = " + uploader + " poolID = " + poolID + " cid = " + cid)
            do {
                let result = try fula!.manifestRemoveStored(seedString, uploader, poolID, cid)
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("removeStoredReplication", error.localizedDescription)
                reject("ERR_FULA", "removeStoredReplication", error)
            }

    }

    @objc(bloxFreeSpace:withResolver:withRejecter:)
    func bloxFreeSpace( resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
            print("ReactNative", "bloxFreeSpace")
            do {
                let result = try fula!.BloxFreeSpace()
                let resultString = toString(result)
                resolve(resultString)
            } catch let error {
                print("bloxFreeSpace", error.localizedDescription)
                reject("ERR_FULA", "bloxFreeSpace", error)
            }

    }

}
