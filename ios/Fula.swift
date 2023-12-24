import Foundation
import Foundation.NSDate // for TimeInterval
import CommonCrypto
import Wnfs
import Fula
import os.log

extension OSLog {

    private static var subsystem = Bundle.main.bundleIdentifier!

    /// Logs the view cycles like a view that appeared.
    static let viewCycle = OSLog(subsystem: subsystem, category: "viewcycle")

    /// All logs related to tracking and analytics.
    static let statistics = OSLog(subsystem: subsystem, category: "statistics")
}

extension OSLog {

    func info(_ msg: String, _ args: CVarArg...) {
        os_log("%{public}@", log: self, type: .info, msg)
    }

    func error(_ msg: String, _ args: CVarArg...) {
        os_log("%{public}@", log: self, type: .error, msg)
    }

    // ... (more methods for different log levels, if needed)
}


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
    static let CODEC_DAG_CBOR = Int(113)

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
                print(String(format: "ReactNative get cid: %s", cid.toHex()))
                return try internalClient.get(cid)
            } catch let error {
                throw error
            }
        }

        func put(_ cid: Data, _ data: Data) throws -> Void {
            do {
                print(String(format: "ReactNative put(%s) data: %s", cid.toHex(), data.toHex()))
                try internalClient.put(data, codec: 0xFF & Int64(cid[1]))
            } catch let error {
                print("ReactNative put: ", error.localizedDescription)
                throw error
            }
        }
    }
    override init() {

        self.appDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            let fulaStoreURL = appDir.appendingPathComponent("/fula")

            self.fulaStorePath = fulaStoreURL.path
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
                   super.init()

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
    func checkConnection(timeout: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        OSLog.viewCycle.info("ReactNative checkConnection started with timeout=\(timeout)")

        if let timeoutInt = timeout as? Int {
            if fula != nil {
                DispatchQueue.global(qos: .default).async {
                    do {
                        let connectionStatus = try self.checkConnectionInternal(timeout: timeoutInt)
                        OSLog.viewCycle.info("ReactNative checkConnection ended \(connectionStatus)")
                        resolve(connectionStatus)
                    }
                    catch let error {
                        OSLog.viewCycle.info("ReactNative checkConnection failed with Error: \(error.localizedDescription)")
                        resolve(false)
                    }
                }
            } else {
                OSLog.viewCycle.info("ReactNative checkConnection fula is null")
                resolve(false)
            }
        } else {
            OSLog.viewCycle.error("ReactNative checkConnection - invalid timeout value")
            reject("ERR_INVALID_TIMEOUT", "Invalid timeout value", nil)
        }
    }


    @objc(newClient:withStorePath:withBloxAddr:withExchange:withAutoFlush:withUseRelay:withRefresh:withResolver:withRejecter:)
    func newClient(identityString: String, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, useRelay: Bool, refresh: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void  {
            print("ReactNative", "newClient storePath= " , storePath , " bloxAddr= " , bloxAddr , " exchange= " , exchange , " autoFlush= " , autoFlush , " useRelay= " , useRelay , " refresh= " , refresh);
            do {
                print("ReactNative", "newClient storePath= ", storePath)
                let identity = toByte(identityString)
                print("ReactNative", "newClient identity= ", identityString)
                try newClientInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, useRelay: useRelay, refresh: refresh)
                let peerId = fula?.id_()
                resolve(peerId)
            } catch let error {
                print("ReactNative", "newClient failed with Error: ", error.localizedDescription)
                reject("ERR_FULA", "Can't create client", error)
            }

    }

    @objc(isReady:withResolver:withRejecter:)
    func isReady(filesystemCheck: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void{
        print("ReactNative", "isReady started")
        var initialized = false
        do {
            if (fula != nil && !fula!.id_().isEmpty) {
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
    @objc(initFula:withStorePath:withBloxAddr:withExchange:withAutoFlush:withRootConfig:withUseRelay:withRefresh:withResolver:withRejecter:)
    func initFula(identityString: String, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, rootConfig: String, useRelay: Bool, refresh: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {

        OSLog.viewCycle.info("ReactNative - init started")

        do {

            var resultData = Dictionary<String, String>()
            OSLog.viewCycle.info("ReactNative init storePath= \(storePath)")
            let identity = self.toByte(identityString)
            OSLog.viewCycle.info("ReactNative init identity= \(identityString)")
            let obj = try initInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, _rootCid: rootConfig, useRelay: useRelay, refresh: refresh)
            OSLog.viewCycle.info("ReactNative init object created: [  \(obj[0]), \(obj[1]), \(obj[2]) ]")
            resultData["peerId"] = obj[0]
            resultData["rootCid"] = obj[1]
            resultData["wnfs_key"] = obj[2]
            resolve(resultData as NSDictionary)

        } catch let error {
            OSLog.viewCycle.info("ReactNative init failed with Error: \(error.localizedDescription)")
            reject("ERR_FULA", "init failed", error)
        }

    }

    @objc(logout:withStorePath:withResolver:withRejecter:)
    func logout(identityString: String, storePath: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void{

            print("ReactNative", "logout started")
            do {
                let identity = toByte(identityString)
                try logoutInternal(identity: identity, _storePath: storePath)
                print("ReactNative", "logout completed")
                resolve("")

            } catch let error {
                print("ReactNative", "logout failed with Error: ", error.localizedDescription)
                reject("ERR_FULA", "logout failed", error)
            }

    }

    func checkConnectionInternal(timeout: Int) throws -> Bool {
        OSLog.viewCycle.info("ReactNative checkConnectionInternal started with timeout: \(timeout)")
        var connectionStatus = false

        if let fula = self.fula {
            let semaphore = DispatchSemaphore(value: 0)
            let queue = DispatchQueue(label: "com.yourapp.checkConnection", attributes: .concurrent)

            queue.async {
                do {
                    OSLog.viewCycle.info("ReactNative connectToBlox started")
                    try fula.connectToBlox()
                    connectionStatus = true
                    OSLog.viewCycle.info("ReactNative checkConnectionInternal succeeded")
                    semaphore.signal()
                } catch let error {
                    OSLog.viewCycle.info("ReactNative checkConnectionInternal failed with Error: \(error.localizedDescription)")
                    semaphore.signal()
                }
            }

            let timeoutResult = semaphore.wait(timeout: .now() + .seconds(timeout))
            switch timeoutResult {
            case .timedOut:
                OSLog.viewCycle.info("ReactNative checkConnectionInternal timed out")
                return false
            case .success:
                return connectionStatus
            }
        } else {
            OSLog.viewCycle.info("ReactNative checkConnectionInternal failed because fula is not initialized")
            return false
        }
    }

    @objc(checkFailedActions:withTimeout:withResolver:withRejecter:)
    func checkFailedActions(retry: Bool, timeout: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
            do {
                guard let fula = fula else {
                    throw NSError(domain: "ERR_FULA", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula is not initialized"])
                }

                if !retry {
                    OSLog.viewCycle.info("ReactNative checkFailedActions without retry")
                    let failedLinks = try fula.listFailedPushes()

                    let nextFailedLink = try failedLinks.next()
                    if nextFailedLink != nil {
                        // Assuming nextFailedLink is of type Data; replace `toHex()` with an appropriate method to convert Data to a hex string
                        OSLog.viewCycle.info("ReactNative checkFailedActions found")
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                } else {
                    OSLog.viewCycle.info("ReactNative checkFailedActions with retry")
                    let retryResults = try retryFailedActionsInternal(timeout: timeout)  // Ensure retryFailedActionsInternal accepts a timeout parameter
                    resolve(!retryResults)
                }
            } catch let error {
                OSLog.viewCycle.info("ReactNative checkFailedActions failed with Error: \(error.localizedDescription)")
                reject("ERR_FULA", "CheckFailedActions failed", error)
            }
    }



    func retryFailedActionsInternal(timeout: Int) throws -> Bool {
        OSLog.viewCycle.info("ReactNative retryFailedActionsInternal started")

        guard let fula = fula else {
            OSLog.viewCycle.info("ReactNative retryFailedActionsInternal failed because fula is not initialized")
            return false
        }

        do {
            let connectionCheck = try checkConnectionInternal(timeout: timeout)

            if connectionCheck {
                do {
                    OSLog.viewCycle.info("ReactNative retryFailedPushes started")
                    try fula.retryFailedPushes()
                    OSLog.viewCycle.info("ReactNative flush started")
                    try fula.flush()
                    return true
                } catch let error {
                    try fula.flush()
                    OSLog.viewCycle.info("ReactNative retryFailedActionsInternal failed with Error: \(error.localizedDescription)")
                    return false
                }
            } else {
                OSLog.viewCycle.info("ReactNative retryFailedActionsInternal failed because blox is offline")
                return false
            }
        } catch let error {
            OSLog.viewCycle.info("ReactNative retryFailedActionsInternal failed with Error: \(error.localizedDescription)")
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
        let hash32 = identity.sha256()
        print("ReactNative", "wnfsKey=" , identity.toHex() , "; hash32 = " , hash32.toHex());
        if (fula != nil) {
            try fula?.flush()
        }
        rootCid = try wnfs?.Init(wnfsKey: hash32)
        print("ReactNative", "privateForest is created: ", rootCid!)
        wnfsKey = identity
        print("ReactNative", "rootCid is created: cid=", rootCid!, " ; wnfs_key=", wnfsKey!.toHex(), "; hash32=", hash32)
        try encryptAndStoreConfig()
    }

    func loadWnfs(_ _wnfsKey: Data , _ _rootCid: String) throws {
        OSLog.viewCycle.info("ReactNative loadWnfs called: rootCid=\(_rootCid)")
        let hash32 = _wnfsKey.sha256()
        OSLog.viewCycle.info("ReactNative wnfsKey= \(_wnfsKey.toHex()) ; hash32 = \(hash32.toHex())");
        try wnfs?.LoadWithWNFSKey(wnfsKey: hash32, cid: _rootCid)
        rootCid = _rootCid
        wnfsKey = _wnfsKey
        if (fula != nil) {
            try fula?.flush()
        }
        OSLog.viewCycle.info("ReactNative loadWnfs completed")
        try encryptAndStoreConfig()
    }


    func encryptAndStoreConfig() throws {
        do {
            if let identityEncryptedGlobalUnwrapped = identityEncryptedGlobal {
                OSLog.viewCycle.info("ReactNative encryptAndStoreConfig started")

                if let rootCidUnwrapped = rootCid, let wnfsKeyUnwrapped = wnfsKey, let secretKeyGlobalUnwrapped = secretKeyGlobal {
                    OSLog.viewCycle.info("ReactNative encryptAndStoreConfig started with rootCid: \(rootCidUnwrapped.toUint8Array()) and wnfsKey:\(wnfsKeyUnwrapped)")

                    let cid_encrypted = try Cryptography.encryptMsg(rootCidUnwrapped.toUint8Array(), secretKeyGlobalUnwrapped)
                    OSLog.viewCycle.info("ReactNative encryptAndStoreConfig cid_encrypted: \(cid_encrypted)")

                    let wnfs_key_encrypted = try Cryptography.encryptMsg(wnfsKeyUnwrapped.toUint8Array(), secretKeyGlobalUnwrapped)
                    OSLog.viewCycle.info("ReactNative encryptAndStoreConfig wnfs_key_encrypted: \(wnfs_key_encrypted)")

                    userDataHelper.add("cid_encrypted_" + identityEncryptedGlobalUnwrapped, cid_encrypted)
                    userDataHelper.add("wnfs_key_encrypted_" + identityEncryptedGlobalUnwrapped, wnfs_key_encrypted)
                } else {
                    // Handle the case where rootCid, wnfsKey, or secretKeyGlobal is nil
                    OSLog.viewCycle.info("ReactNative encryptAndStoreConfig failed because one of the values is nil")
                }
            }
        } catch let error {
            OSLog.viewCycle.info("ReactNative encryptAndStoreConfig failed with Error: \(error.localizedDescription)")
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

    func newClientInternal(identity: Data, storePath: String?, bloxAddr: String, exchange: String, autoFlush: Bool, useRelay: Bool, refresh: Bool) throws -> Data {
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
            print("ReactNative", "peerIdentity is set: " + fulaConfig!.identity!.toHex())
            fulaConfig!.bloxAddr = bloxAddr
            print("ReactNative", "bloxAddr is set: " + fulaConfig!.bloxAddr)
            fulaConfig!.exchange = exchange
            fulaConfig!.syncWrites = autoFlush
            if (useRelay) {
                fulaConfig!.allowTransientConnection = true
                fulaConfig!.forceReachabilityPrivate = true
            }
            if (fula == nil || refresh) {
                print("ReactNative", "Creating a new Fula instance");
                do {
                try shutdownInternal();
                fula = FulamobileClient(fulaConfig)
                if (fula != nil) {
                    try fula?.flush();
                }
                } catch let error {
                print("ReactNative", "Failed to create new Fula instance: " , error.localizedDescription);
                throw MyError.runtimeError("Failed to create new Fula instance")
                }
            }
            return peerIdentity
        } catch let error {
            print("ReactNative", "newclientInternal failed with Error: ", error.localizedDescription)
            throw error
        }
    }

    func initInternal(identity: Data, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, _rootCid: String, useRelay: Bool, refresh: Bool) throws -> [String] {

        do {
            if (fula == nil || refresh) {
                try newClientInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, useRelay: useRelay, refresh: refresh)
                OSLog.viewCycle.info("ReactNative fula initialized: \(self.fula!.id_())")
            }
            if(client == nil || refresh) {
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
                OSLog.viewCycle.info("ReactNative wnfs initialized")
            }

            let secretKey = try Cryptography.generateKey(identity)
            let identity_encrypted = try Cryptography.encryptMsg(identity.toUint8Array(), secretKey)
            identityEncryptedGlobal = identity_encrypted
            secretKeyGlobal = secretKey

            if (rootCid == nil || rootCid!.isEmpty) {
                OSLog.viewCycle.info("ReactNative rootCid is empty.")
                //Load from keystore

                let cid_encrypted_fetched = userDataHelper.getValue("cid_encrypted_"+identity_encrypted)
                OSLog.viewCycle.info("ReactNative Here1")
                var cid: Array<UInt8>? = nil
                if(cid_encrypted_fetched != nil && !cid_encrypted_fetched!.isEmpty) {
                    OSLog.viewCycle.info("ReactNative decrypting cid= \(cid_encrypted_fetched!) with secret \(secretKey.toHex())")
                    cid = try Cryptography.decryptMsg(cid_encrypted_fetched!, secretKey)
                }
                print("ReactNative", "Here2")
                //print("ReactNative", "Attempted to fetch cid from keystore cid="+cid+" & wnfs_key="+wnfs_key)
                if(cid == nil || cid!.isEmpty){
                    OSLog.viewCycle.info("ReactNative cid or wnfs key was not found")
                    if(!_rootCid.isEmpty){
                        OSLog.viewCycle.info("ReactNative Re-setting cid from input: \(_rootCid)")
                        cid = _rootCid.toUint8Array()
                    }

                }
                if(cid == nil || cid!.isEmpty){
                        OSLog.viewCycle.info("ReactNative Tried to recover cid but was not successful. Creating ones")
                        try createNewrootCid(identity: identity)
                } else {
                    OSLog.viewCycle.info("ReactNative Found cid and wnfs key in keychain store")
                    OSLog.viewCycle.info("ReactNative Recovered cid and private ref from keychain store. cid=\(cid!) & wnfs_key=\(identity)")
                    try loadWnfs(identity, cid!.toData().toUTF8String()!)
                }
                OSLog.viewCycle.info("ReactNative creating/reloading rootCid completed")

                /*
                 byte[] testbyte = convertStringToByte("-104,40,24,-93,24,100,24,114,24,111,24,111,24,116,24,-126,24,-126,0,0,24,-128,24,103,24,118,24,101,24,114,24,115,24,105,24,111,24,110,24,101,24,48,24,46,24,49,24,46,24,48,24,105,24,115,24,116,24,114,24,117,24,99,24,116,24,117,24,114,24,101,24,100,24,104,24,97,24,109,24,116")
                 long testcodec = 85
                 byte[] testputcid = client!.put(testbyte, testcodec)
                 print("ReactNative", "client!.put test done"+ Arrays.toString(testputcid))
                 byte[] testfetchedcid = convertStringToByte("1,113,18,32,-6,-63,-128,79,-102,-89,57,77,-8,67,-98,8,-81,40,-87,123,122,29,-52,-124,-60,-53,100,105,125,123,-5,-99,41,106,-124,-64")
                 byte[] testfetchedbytes = client!.get(testfetchedcid)
                 print("ReactNative", "client!.get test done"+ Arrays.toString(testfetchedbytes))
                 */


                OSLog.viewCycle.info("ReactNative rootCid is created: cid=\(self.rootCid!) & wnfs_key=\(self.wnfsKey!.toHex())")
            } else {
                OSLog.viewCycle.info("ReactNative rootCid existed: cid=\(self.rootCid!) & wnfs_key=\(self.wnfsKey!.toHex())")
            }
            let peerId = fula!.id_()
            var obj = [String]()
            obj.append(peerId)
            obj.append(rootCid!)
            obj.append(wnfsKey!.toHex())
            OSLog.viewCycle.info("ReactNative initInternal is completed successfully")
            if (fula != nil) {
                try fula?.flush()
            }
            return obj
        } catch let error {
            OSLog.viewCycle.info("ReactNative init internal failed with Error: \(error.localizedDescription)")
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
            guard let s = res?.toUTF8String() else {
                throw MyError.runtimeError("converting bytes to utf8 string")
            }
            print("ReactNative", "ls: res = " + s)
            resolve(s)
        } catch let error {
            print("ls", error.localizedDescription)
            reject("ERR_WNFS", "ls", error)
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
            let cid = try wnfs?.Cp(cid: rootCid!, remotePathFrom: sourcePath, remotePathTo: targetPath)
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

            print("ReactNative", "readFileContent: path = " + path)
            do {
                // FIXME: dhouldn't we output an NSData object instead?
                let res = try wnfs?.ReadFile(cid: rootCid!, remotePath: path)
                guard let resString = res?.toUTF8String() else{
                    throw MyError.runtimeError("converting bytes to utf8 string")
                }
                resolve(resString)
            } catch let error {
                print("readFileContent", error.localizedDescription)
                reject("ERR_WNFS", "readFileContent", error)
            }

    }

    @objc(get:withResolver:withRejecter:)
    func get(keyString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {

            print("ReactNative", "get: keyString = " + keyString)
            do {
                let key: Data = convertStringToByte(keyString).toData()
                let value = try getInternal(key)
                let valueString: String = value.toUTF8String()!
                resolve(valueString)
            } catch let error {
                print("get", error.localizedDescription)
                reject("ERR_FULA", "get", error)
            }

    }

    func getInternal(_ key: Data) throws -> Data {
        do {
            print("ReactNative", "getInternal: key.toUTF8String() = " , key.toUTF8String()!)
            print("ReactNative", "getInternal: key.toHex().bytes = " , key.toHex())
            let value = try fula!.get(key)
            print("ReactNative", "getInternal: value.toHex() = " , value.toHex())
            return value
        } catch let error {
            print("ReactNative", "getInternal: error = " + error.localizedDescription)
            print("getInternal", error.localizedDescription)
            throw error
        }
    }

    @objc(has:withResolver:withRejecter:)
    func has(keyString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {

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

    func pullInternal(key: Data) throws -> Void {
        do {
            try fula!.pull(key)
        } catch let error {
            print("pullInternal", error.localizedDescription)
            throw error
        }
    }

    @objc(push:withRejecter:)
    func push(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        print("ReactNative", "push started")
        do {
            try pushInternal(key: convertStringToByte(rootCid!).toData())
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

    // FIXME: unused codecString arg
    @objc(put:withCodecString:withResolver:withRejecter:)
    func put(valueString: String, codecString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {

        print("ReactNative", "put: codecString = " + codecString)
        print("ReactNative", "put: valueString = " + valueString)
        do {
            //byte[] codec = convertStringToByte(CodecString)
            let codec = FulaModule.CODEC_DAG_CBOR


            print("ReactNative", "put: codec = ", codec)
            let value = valueString.toData()

            print("ReactNative", "put: value.toHex() = " , value.toHex())
            let key = try putInternal(value: value, codec: codec)
            print("ReactNative", "put: key.toHex() = " , key.toUTF8String()!)
            resolve(key.toUTF8String()!)
        } catch let error {
            print("ReactNative", "put: error = ", error.localizedDescription)
            reject("ERR_FULA", "put", error)
        }

    }

    // FIXME: unused codec arg
    func putInternal(value: Data, codec: Int) throws -> Data {
        do {
            if(fula != nil) {
                let key: Data = try fula!.put(value, codec: Int64(FulaModule.CODEC_DAG_CBOR))
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
    func shutdown( resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        do {
            try shutdownInternal()
            resolve(true)
        } catch let error {
            print("ReactNative", "shutdown", error.localizedDescription)
            reject("ERR_FULA", "shutdown", error)
        }

    }

    func shutdownInternal() throws {
        if(fula != nil) {
            try fula?.shutdown()
            fula = nil
            client = nil
            wnfs = nil
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
                let resultString = result.toUTF8String()!
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
            let resultString = result.toUTF8String()!
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
            let resultString = result.toUTF8String()!
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
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("listPools", error.localizedDescription)
            reject("ERR_FULA", "listPools", error)
        }

    }

    @objc(joinPool:withResolver:withRejecter:)
    func joinPool(poolID: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("ReactNative", "joinPool: poolID = ", poolID)
        do {
            // Note: Adjust this line if fula!.poolJoin requires seedString
            let result = try fula!.poolJoin(poolID: poolID)
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("joinPool", error.localizedDescription)
            reject("ERR_FULA", "joinPool", error)
        }
    }

    @objc(cancelPoolJoin:withResolver:withRejecter:)
    func cancelPoolJoin(poolID: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("ReactNative", "cancelPoolJoin: poolID = ", poolID)
        do {
            // Note: Adjust this line if fula!.poolCancelJoin requires seedString
            let result = try fula!.poolCancelJoin(poolID: poolID)
            let resultString = result.toUTF8String()!
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
            let resultString = result.toUTF8String()!
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
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("votePoolJoinRequest", error.localizedDescription)
            reject("ERR_FULA", "votePoolJoinRequest", error)
        }

    }

    @objc(leavePool:withResolver:withRejecter:)
    func leavePool(poolID: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("ReactNative", "leavePool: poolID = ", poolID)
        do {
            // Note: Adjust this line if fula!.poolLeave requires seedString
            let result = try fula!.poolLeave(poolID: poolID)
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("leavePool", error.localizedDescription)
            reject("ERR_FULA", "leavePool", error)
        }
    }

    @objc(newReplicationRequest:withPoolID:withReplicationFactor:withCid:withResolver:withRejecter:)
    func newReplicationRequest(seedString: String, poolID: Int, replicationFactor: Int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        print("ReactNative", "newReplicationRequest: seedString = " , seedString , " poolID = " , poolID , " replicationFactor = " , replicationFactor , " cid = " , cid)
        do {
            let result = try fula!.manifestUpload(seedString, poolID: poolID, replicationFactor: replicationFactor, uri: cid)
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("newReplicationRequest", error.localizedDescription)
            reject("ERR_FULA", "newReplicationRequest", error)
        }

    }

    @objc(newStoreRequest:withPoolID:withUploader:withCid:withResolver:withRejecter:)
    func newStoreRequest(seedString: String, poolID: Int, uploader: String, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        print("ReactNative", "newStoreRequest: seedString = " + seedString + " poolID = " , poolID , " uploader = " , uploader , " cid = " , cid)
        do {
            let result = try fula!.manifestStore(seedString, poolID: poolID, uploader: uploader, cid: cid)
            let resultString = result.toUTF8String()!
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
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("listAvailableReplicationRequests", error.localizedDescription)
            reject("ERR_FULA", "listAvailableReplicationRequests", error)
        }

    }

    @objc(removeReplicationRequest:withPoolID:withCid:withResolver:withRejecter:)
    func removeReplicationRequest(seedString: String, poolID: Int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        print("ReactNative", "newReplicationRequest: seedString = " , seedString , " poolID = " , poolID , " cid = " , cid)
        do {
            let result = try fula!.manifestRemove(seedString, poolID: poolID,  cid: cid)
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("removeReplicationRequest", error.localizedDescription)
            reject("ERR_FULA", "removeReplicationRequest", error)
        }

    }

    @objc(removeStorer:withStorage:withPoolID:withCid:withResolver:withRejecter:)
    func removeStorer(seedString: String, storage: String, poolID: Int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        print("ReactNative", "removeStorer: seedString = " , seedString , " storage = " , storage , " poolID = " , poolID , " cid = " , cid)
        do {
            let result = try fula!.manifestRemoveStorer(seedString, storage: storage, poolID: poolID, cid: cid)
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("removeStorer", error.localizedDescription)
            reject("ERR_FULA", "removeStorer", error)
        }

    }

    @objc(removeStoredReplication:withUploader:withPoolID:withCid:withResolver:withRejecter:)
    func removeStoredReplication(seedString: String, uploader: String, poolID: Int, cid: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        print("ReactNative", "removeStoredReplication: seedString = " , seedString , " uploader = " , uploader , " poolID = " , poolID , " cid = " , cid)
        do {
            let result = try fula!.manifestRemoveStored(seedString, uploader: uploader, poolID: poolID, cid: cid)
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("removeStoredReplication", error.localizedDescription)
            reject("ERR_FULA", "removeStoredReplication", error)
        }

    }

    @objc(bloxFreeSpace:withRejecter:)
    func bloxFreeSpace( resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        print("ReactNative", "bloxFreeSpace")
        do {
            let result = try fula!.bloxFreeSpace()
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("bloxFreeSpace", error.localizedDescription)
            reject("ERR_FULA", "bloxFreeSpace", error)
        }

    }

    @objc(assetsBalance:assetId:classId:withResolver:withRejecter:)
    func assetsBalance(account: String, assetId: String, classId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .default).async {
            do {
                print("ReactNative", "assetsBalance called")
                let result = try fula!.assetsBalance(account, assetId: assetId, classId: classId)
                let resultString = String(data: result!, encoding: .utf8)
                resolve(resultString)
            } catch let error {
                print("ReactNative", "assetsBalance failed with Error: \(error.localizedDescription)")
                reject("ERR_FULA_ASSETS_BALANCE", "assetsBalance failed", error)
            }
        }
    }
    @objc(transferToFula:wallet:chain:withResolver:withRejecter:)
    func transferToFula(amount: String, wallet: String, chain: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .default).async {
            do {
                print("ReactNative", "transferToFula called")
                let result = try fula!.transferToFula(amount, wallet: wallet, chain: chain)
                let resultString = String(data: result!, encoding: .utf8)
                resolve(resultString)
            } catch let error {
                print("ReactNative", "transferToFula failed with Error: \(error.localizedDescription)")
                reject("ERR_FULA_TRANSFER", "transferToFula failed", error)
            }
        }
    }

}
