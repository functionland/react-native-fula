import Foundation
import Foundation.NSDate // for TimeInterval
import CommonCrypto
import Wnfs
import Fula
import os.log
import React

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
class FulaModule: RCTEventEmitter {
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

    @objc func applicationWillResignActive() {
        // Log that the app will resign active
        os_log("Application will resign active", log: OSLog.viewCycle, type: .info)
    }

    @objc func applicationDidEnterBackground() {
        // Log that the app has entered the background
        os_log("Application did enter background", log: OSLog.viewCycle, type: .info)
    }

    @objc func applicationWillTerminate() {
        // Attempt to shut down Fula cleanly (similar to onHostDestroy)
        os_log("Application will terminate - shutting down Fula", log: OSLog.viewCycle, type: .info)
        do {
            if let fulaClient = self.fula {
                try fulaClient.shutdown()
                os_log("Fula shutdown successfully.", log: OSLog.viewCycle, type: .info)
            }
        } catch {
            os_log("Error shutting down Fula: %{public}@", log: OSLog.viewCycle, type: .error, String(describing: error))
        }
    }

    @objc(registerLifecycleListener:withRejecter:)
    func registerLifecycleListener(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationWillResignActive),
            name: UIApplication.willResignActiveNotification,
            object: nil)

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationDidEnterBackground),
            name: UIApplication.didEnterBackgroundNotification,
            object: nil)

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationWillTerminate),
            name: UIApplication.willTerminateNotification,
            object: nil)

        // Assuming the operation is always successful
        resolve(true)
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    @objc(checkConnection:withResolver:withRejecter:)
    func checkConnection(timeout: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        NSLog("ReactNative checkConnection started with timeout=\(timeout)")

        if let timeoutInt = timeout as? Int {
            if self.fula != nil {
                DispatchQueue.global(qos: .default).async {
                    do {
                        let connectionStatus = try self.checkConnectionInternal(timeout: timeoutInt)
                        NSLog("ReactNative checkConnection ended \(connectionStatus)")
                        resolve(connectionStatus)
                    }
                    catch let error {
                        NSLog("ReactNative checkConnection failed with Error: \(error.localizedDescription)")
                        resolve(false)
                    }
                }
            } else {
                NSLog("ReactNative checkConnection fula is null")
                resolve(false)
            }
        } else {
            OSLog.viewCycle.error("ReactNative checkConnection - invalid timeout value")
            reject("ERR_INVALID_TIMEOUT", "Invalid timeout value", nil)
        }
    }


    @objc(newClient:withStorePath:withBloxAddr:withExchange:withAutoFlush:withUseRelay:withRefresh:withResolver:withRejecter:)
    func newClient(identityString: String, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, useRelay: Bool, refresh: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void  {
            print("ReactNative", "newClient storePath= " , storePath , " bloxAddr= " , bloxAddr , " exchange= " , exchange , " autoFlush= " , autoFlush , " useRelay= " , useRelay , " refresh= " , refresh)
            do {
                print("ReactNative", "newClient storePath= ", storePath)
                let identity = toByte(identityString)
                print("ReactNative", "newClient identity= ", identityString)
                try newClientInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, useRelay: useRelay, refresh: refresh)
                let peerId = self.fula?.id_()
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
            if (self.fula != nil && !self.fula!.id_().isEmpty) {
                if (filesystemCheck) {
                    if (self.client != nil && rootCid != nil && !rootCid!.isEmpty) {
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

        NSLog("ReactNative - init started")

        do {

            var resultData = Dictionary<String, String>()
            NSLog("ReactNative init storePath= \(storePath)")
            let identity = self.toByte(identityString)
            NSLog("ReactNative init identity= \(identityString)")
            let obj = try initInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, _rootCid: rootConfig, useRelay: useRelay, refresh: refresh)
            NSLog("ReactNative init object created: [  \(obj[0]), \(obj[1]), \(obj[2]) ]")
            resultData["peerId"] = obj[0]
            resultData["rootCid"] = obj[1]
            resultData["wnfs_key"] = obj[2]
            resolve(resultData as NSDictionary)

        } catch let error {
            NSLog("ReactNative init failed with Error: \(error.localizedDescription)")
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
        NSLog("ReactNative checkConnectionInternal started with timeout: \(timeout)")
        var connectionStatus = false

        if let fula = self.fula {
            let semaphore = DispatchSemaphore(value: 0)
            let queue = DispatchQueue(label: "com.yourapp.checkConnection", attributes: .concurrent)

            queue.async {
                do {
                    NSLog("ReactNative connectToBlox started")
                    try fula.connectToBlox()
                    connectionStatus = true
                    NSLog("ReactNative checkConnectionInternal succeeded")
                    semaphore.signal()
                } catch let error {
                    NSLog("ReactNative checkConnectionInternal failed with Error: \(error.localizedDescription)")
                    semaphore.signal()
                }
            }

            let timeoutResult = semaphore.wait(timeout: .now() + .seconds(timeout))
            switch timeoutResult {
            case .timedOut:
                NSLog("ReactNative checkConnectionInternal timed out")
                return false
            case .success:
                return connectionStatus
            }
        } else {
            NSLog("ReactNative checkConnectionInternal failed because fula is not initialized")
            return false
        }
    }

    @objc(checkFailedActions:withTimeout:withResolver:withRejecter:)
    func checkFailedActions(retry: Bool, timeout: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
            do {
                guard let fula = self.fula else {
                    throw NSError(domain: "ERR_FULA", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula is not initialized"])
                }

                if !retry {
                    NSLog("ReactNative checkFailedActions without retry")
                    let failedLinks = try fula.listFailedPushes()

                    let nextFailedLink = try failedLinks.next()
                    if nextFailedLink != nil {
                        // Assuming nextFailedLink is of type Data; replace `toHex()` with an appropriate method to convert Data to a hex string
                        NSLog("ReactNative checkFailedActions found")
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                } else {
                    NSLog("ReactNative checkFailedActions with retry")
                    let retryResults = try retryFailedActionsInternal(timeout: timeout)  // Ensure retryFailedActionsInternal accepts a timeout parameter
                    resolve(!retryResults)
                }
            } catch let error {
                NSLog("ReactNative checkFailedActions failed with Error: \(error.localizedDescription)")
                reject("ERR_FULA", "CheckFailedActions failed", error)
            }
    }



    func retryFailedActionsInternal(timeout: Int) throws -> Bool {
        NSLog("ReactNative retryFailedActionsInternal started")

        guard let fula = self.fula else {
            NSLog("ReactNative retryFailedActionsInternal failed because fula is not initialized")
            return false
        }

        do {
            let connectionCheck = try checkConnectionInternal(timeout: timeout)

            if connectionCheck {
                do {
                    NSLog("ReactNative retryFailedPushes started")
                    try fula.retryFailedPushes()
                    NSLog("ReactNative flush started")
                    try fula.flush()
                    return true
                } catch let error {
                    try fula.flush()
                    NSLog("ReactNative retryFailedActionsInternal failed with Error: \(error.localizedDescription)")
                    return false
                }
            } else {
                NSLog("ReactNative retryFailedActionsInternal failed because blox is offline")
                return false
            }
        } catch let error {
            NSLog("ReactNative retryFailedActionsInternal failed with Error: \(error.localizedDescription)")
            return false
        }
    }

    func createPeerIdentity(privateKey: Data) throws -> Data {
        let secretKey = try Cryptography.generateKey(privateKey)

        var encryptedKey: String? = userDataHelper.getValue(FulaModule.PRIVATE_KEY_STORE_ID)
        NSLog("ReactNative createPeerIdentity encryptedKey=\(encryptedKey ?? "nil")")
        if encryptedKey == nil {
            let privateKeyString = String(data: privateKey, encoding: .utf8) ?? ""

            guard !privateKeyString.isEmpty else {
                throw NSError(domain: "KeyGenerationError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Private key string conversion failed"])
            }
            var error: NSError?
            guard let autoGeneratedIdentity = FulamobileGenerateEd25519KeyFromString(privateKeyString, &error)?.toUint8Array() else {
                throw error ?? NSError(domain: "KeyGenerationError", code: -1, userInfo: nil)
            }
            encryptedKey = try Cryptography.encryptMsg([UInt8](autoGeneratedIdentity), [UInt8](secretKey))
            NSLog("ReactNative createPeerIdentity encryptedKey2=\(encryptedKey)")
            userDataHelper.add(FulaModule.PRIVATE_KEY_STORE_ID, encryptedKey ?? "")
        }

        // Assuming decryptMsg returns Data or throws an error if decryption fails
        guard let encryptedKeyData = encryptedKey, !encryptedKeyData.isEmpty else {
            throw NSError(domain: "DecryptionError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Encrypted key is empty"])
        }
        let decryptedData = try Cryptography.decryptMsg(encryptedKeyData, Array(secretKey))
        let hexString = decryptedData.map { String(format: "%02hhx", $0) }.joined()
        NSLog("ReactNative createPeerIdentity decryptedData=\(hexString)")
        return Data(decryptedData)
    }

    func decryptLibp2pIdentity(_ encryptedLibp2pId: String, with encryptionSecretKey: Data) throws -> String {
        // Convert Data to [UInt8]
        let secretKeyBytes = [UInt8](encryptionSecretKey)

        // Attempt decryption
        guard let decryptedBytes = try? Cryptography.decryptMsg(encryptedLibp2pId, secretKeyBytes) else {
            throw NSError(domain: "DecryptionError", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to decrypt Libp2p ID"])
        }

        // Assuming decryptedBytes is an array of UInt8
        return String(decoding: decryptedBytes, as: UTF8.self)
    }

    func createEncryptedLibp2pId(from identity: Data, with encryptionSecretKey: Data) throws -> String {
        var error: NSError?
        guard let autoGeneratedIdentity = FulamobileGenerateEd25519Key(&error) else {
            throw error ?? NSError(domain: "KeyGenerationError", code: -1, userInfo: nil)
        }
        let encryptedLibp2pId = try Cryptography.encryptMsg(Array(autoGeneratedIdentity), Array(encryptionSecretKey))
        userDataHelper.add(FulaModule.PRIVATE_KEY_STORE_ID, encryptedLibp2pId)
        return encryptedLibp2pId
    }

    func createNewrootCid(identity: Data) throws -> Void {
        let hash32 = identity.sha256()
        NSLog("ReactNative createNewrootCid wnfsKey= \(identity.toHex()) , hash32 = \(hash32.toHex())")
        if (self.fula != nil) {
            NSLog("ReactNative createNewrootCid self.fula not null")
            try self.fula?.flush()
        }
        NSLog("ReactNative fula flushed")
        rootCid = try self.wnfs?.Init(wnfsKey: hash32)
        NSLog("ReactNative privateForest is created: \(rootCid!)")
        wnfsKey = identity
        NSLog("ReactNative rootCid is created: cid= \(rootCid!) wnfs_key= \(wnfsKey!.toHex()), hash32=\(hash32)")
        try encryptAndStoreConfig()
    }

    func loadWnfs(_ _wnfsKey: Data , _ _rootCid: String) throws {
        NSLog("ReactNative loadWnfs called: _rootCid=\(_rootCid)")
        let hash32 = _wnfsKey.sha256()
        NSLog("ReactNative wnfsKey= \(_wnfsKey.toHex()) ; hash32 = \(hash32.toHex())")
        try self.wnfs?.LoadWithWNFSKey(wnfsKey: hash32, cid: _rootCid)
        NSLog("ReactNative loadWnfs LoadWithWNFSKey")
        rootCid = _rootCid
        wnfsKey = _wnfsKey
        NSLog("ReactNative loadWnfs called: rootCid=\(rootCid)")
        if (self.fula != nil) {
            try self.fula?.flush()
        }
        NSLog("ReactNative loadWnfs completed")
        try encryptAndStoreConfig()
    }


    func encryptAndStoreConfig() throws {
        do {
            if let identityEncryptedGlobalUnwrapped = identityEncryptedGlobal {
                NSLog("ReactNative encryptAndStoreConfig started")

                if let rootCidUnwrapped = rootCid, let wnfsKeyUnwrapped = wnfsKey, let secretKeyGlobalUnwrapped = secretKeyGlobal {
                    NSLog("ReactNative encryptAndStoreConfig started with rootCid: \(rootCidUnwrapped.toUint8Array()) and wnfsKey:\(wnfsKeyUnwrapped)")

                    let cid_encrypted = try Cryptography.encryptMsg(rootCidUnwrapped.toUint8Array(), secretKeyGlobalUnwrapped)
                    NSLog("ReactNative encryptAndStoreConfig cid_encrypted: \(cid_encrypted)")

                    let wnfs_key_encrypted = try Cryptography.encryptMsg(wnfsKeyUnwrapped.toUint8Array(), secretKeyGlobalUnwrapped)
                    NSLog("ReactNative encryptAndStoreConfig wnfs_key_encrypted: \(wnfs_key_encrypted)")

                    userDataHelper.add("cid_encrypted_" + identityEncryptedGlobalUnwrapped, cid_encrypted)
                    userDataHelper.add("wnfs_key_encrypted_" + identityEncryptedGlobalUnwrapped, wnfs_key_encrypted)
                } else {
                    // Handle the case where rootCid, wnfsKey, or secretKeyGlobal is nil
                    NSLog("ReactNative encryptAndStoreConfig failed because one of the values is nil")
                }
            }
        } catch let error {
            NSLog("ReactNative encryptAndStoreConfig failed with Error: \(error.localizedDescription)")
            throw error
        }
    }

    func logoutInternal(identity: Data, _storePath: String?) throws {
        do {
            if (self.fula != nil) {
                try self.fula?.flush()
            }
            let secretKey = try Cryptography.generateKey(identity)
            let identity_encrypted: String = try Cryptography.encryptMsg(identity.toUint8Array(), [UInt8](secretKey))

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
        return self.fula
    }

    func newClientInternal(identity: Data, storePath: String?, bloxAddr: String, exchange: String, autoFlush: Bool, useRelay: Bool, refresh: Bool) throws -> Void {
        do {
            NSLog("ReactNative fula newClientInternal refresh=\(refresh)")
            fulaConfig = FulamobileConfig()
            NSLog("ReactNative: cofig is set")
            if (storePath == nil || storePath!.isEmpty) {
                fulaConfig!.storePath = fulaStorePath
            } else {
                fulaConfig!.storePath = storePath!
            }
            NSLog("ReactNative storePath is set:  \(fulaConfig!.storePath)")

            let peerIdentity = try createPeerIdentity(privateKey: identity)
            fulaConfig!.identity = peerIdentity
            NSLog("ReactNative peerIdentity is set:  \(fulaConfig!.identity!.toHex())")
            fulaConfig!.bloxAddr = bloxAddr
            NSLog("ReactNative bloxAddr is set:  \(fulaConfig!.bloxAddr)")
            fulaConfig!.exchange = exchange
            fulaConfig!.syncWrites = autoFlush
            if (useRelay) {
                fulaConfig!.allowTransientConnection = true
                fulaConfig!.forceReachabilityPrivate = true
            }
            if (self.fula == nil || refresh) {
                NSLog("ReactNative Creating a new Fula instance")
                do {
                    try shutdownInternal()
                    NSLog("ReactNative Creating a new Fula instance shutdown done")
                    var error: NSError?
                    let client = FulamobileNewClient(fulaConfig, &error)
                    if let error = error {
                        throw error
                    }

                    self.fula = client
                    NSLog("ReactNative FulamobileClient created")
                    if (self.fula != nil) {
                        NSLog("ReactNative Creating a new Fula instance fula is not null, flushing")
                        try self.fula?.flush()
                    } else {
                        NSLog("** ReactNative Creating a new Fula instance fula failed **")
                    }
                } catch let error {
                    NSLog("ReactNative Failed to create new Fula instance: \(error.localizedDescription)")
                    throw MyError.runtimeError("ReactNative Failed to create new Fula instance")
                }
            }
            NSLog("ReactNative peerIdentity returned: \(peerIdentity)")
        } catch let error {
            NSLog("ReactNative newclientInternal failed with Error: \(error.localizedDescription)")
            throw error
        }
    }

    func initInternal(identity: Data, storePath: String, bloxAddr: String, exchange: String, autoFlush: Bool, _rootCid: String, useRelay: Bool, refresh: Bool) throws -> [String] {

        do {
            os_log("ReactNative: This is an info message.", log: OSLog.viewCycle, type: .info)
            NSLog("ReactNative: This is a simple log message.")

            NSLog("ReactNative fula initInternal=\(refresh)")
            if (self.fula == nil || refresh) {
                NSLog("ReactNative fula self.fula is null or refresh is set")
                try newClientInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, useRelay: useRelay, refresh: refresh)
                NSLog("ReactNative fula initialized")
                if (self.fula == nil) {
                    NSLog("ReactNative: fula is not initialized")
                }
                guard let fulaId = self.fula?.id_() else {
                    NSLog("ReactNative error: fula is not initialized")
                    throw MyError.runtimeError("ReactNative: fula client not ready")
                }
                NSLog("ReactNative fula initialized: \(fulaId)")
            }
            if(self.client == nil || self.wnfs == nil || refresh) {
                NSLog("ReactNative fula self.client is null or refresh is set")
                self.client = Client(clientInput: self.fula!)
                self.wnfs = Wnfs(putFn: { cid, data in
                    guard let c = self.client else {
                        NSLog("ReactNative wnfs put: fula client not ready")
                        throw MyError.runtimeError("ReactNative wnfs: fula client not ready")
                    }
                    try c.put(cid, data)
                }, getFn: { cid in
                    guard let c = self.client else {
                        NSLog("ReactNative wnfs get: fula client not ready")
                        throw MyError.runtimeError("ReactNative wnfs: fula client not ready")
                    }
                    return try c.get(cid)
                })
                NSLog("ReactNative wnfs initialized")
            }

            let secretKey = try Cryptography.generateKey(identity)
            let identity_encrypted = try Cryptography.encryptMsg(identity.toUint8Array(), [UInt8](secretKey))

            identityEncryptedGlobal = identity_encrypted
            secretKeyGlobal = [UInt8](secretKey)

            if (rootCid == nil || rootCid!.isEmpty) {
                NSLog("ReactNative rootCid is empty.")
                //Load from keystore

                let cid_encrypted_fetched = userDataHelper.getValue("cid_encrypted_"+identity_encrypted)
                NSLog("ReactNative Here1")
                var cid: Array<UInt8>? = nil
                if(cid_encrypted_fetched != nil && !cid_encrypted_fetched!.isEmpty) {
                    NSLog("ReactNative decrypting cid= \(cid_encrypted_fetched!) with secret \(secretKey.toHex())")
                    cid = try Cryptography.decryptMsg(cid_encrypted_fetched!, [UInt8](secretKey))

                }
                NSLog("ReactNative Here2")
                //print("ReactNative", "Attempted to fetch cid from keystore cid="+cid+" & wnfs_key="+wnfs_key)
                if(cid == nil || cid!.isEmpty){
                    NSLog("ReactNative cid or wnfs key was not found")
                    if(!_rootCid.isEmpty){
                        NSLog("ReactNative Re-setting cid from input: \(_rootCid)")
                        cid = _rootCid.toUint8Array()
                    }

                }
                if(cid == nil || cid!.isEmpty){
                        NSLog("ReactNative Tried to recover cid but was not successful. Creating ones")
                        try createNewrootCid(identity: identity)
                } else {
                    NSLog("ReactNative Found cid and wnfs key in keychain store")
                    NSLog("ReactNative Recovered cid and private ref from keychain store. cid=\(cid!) & wnfs_key=\(identity)")
                    try loadWnfs(identity, cid!.toData().toUTF8String()!)
                }
                NSLog("ReactNative creating/reloading rootCid completed")

                /*
                 byte[] testbyte = convertStringToByte("-104,40,24,-93,24,100,24,114,24,111,24,111,24,116,24,-126,24,-126,0,0,24,-128,24,103,24,118,24,101,24,114,24,115,24,105,24,111,24,110,24,101,24,48,24,46,24,49,24,46,24,48,24,105,24,115,24,116,24,114,24,117,24,99,24,116,24,117,24,114,24,101,24,100,24,104,24,97,24,109,24,116")
                 long testcodec = 85
                 byte[] testputcid = client!.put(testbyte, testcodec)
                 print("ReactNative", "client!.put test done"+ Arrays.toString(testputcid))
                 byte[] testfetchedcid = convertStringToByte("1,113,18,32,-6,-63,-128,79,-102,-89,57,77,-8,67,-98,8,-81,40,-87,123,122,29,-52,-124,-60,-53,100,105,125,123,-5,-99,41,106,-124,-64")
                 byte[] testfetchedbytes = client!.get(testfetchedcid)
                 print("ReactNative", "client!.get test done"+ Arrays.toString(testfetchedbytes))
                 */


                NSLog("ReactNative rootCid is created: cid=\(self.rootCid!) & wnfs_key=\(self.wnfsKey!.toHex())")
            } else {
                NSLog("ReactNative rootCid existed: cid=\(self.rootCid!) & wnfs_key=\(self.wnfsKey!.toHex())")
            }
            guard let peerId = self.fula?.id_() else {
                NSLog("ReactNative error: fula is not initialized")
                throw MyError.runtimeError("ReactNative: fula client not ready")
            }
            NSLog("ReactNative fula peerId initialized: \(peerId)")
            var obj = [String]()
            obj.append(peerId)
            obj.append(rootCid!)
            obj.append(wnfsKey!.toHex())
            NSLog("ReactNative initInternal is completed successfully")
            if (self.fula != nil) {
                try self.fula?.flush()
            }
            return obj
        } catch let error {
            NSLog("ReactNative init internal failed with Error: \(error.localizedDescription)")
            throw error
        }
    }


    @objc(mkdir:withResolver:withRejecter:)
    func mkdir(path: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        NSLog("ReactNative mkdir: path = \(path)")
        do {
            let cid = try self.wnfs?.MkDir(cid: rootCid!, remotePath: path)
            if(cid != nil) {
                rootCid = cid
                try encryptAndStoreConfig()
                if (self.fula != nil) {
                    try self.fula?.flush()
                }
                resolve(rootCid)
            } else {
                NSLog("ReactNative mkdir Error: config is nil")
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
        NSLog("ReactNative writeFile to : path = \(fulaTargetFilename) + from: \(localFilename)")
        do {
            let cid = try self.wnfs?.WriteFileFromPath(cid: rootCid!, remotePath: fulaTargetFilename, fileUrl: URL.init(string: localFilename)!)
            if(cid != nil) {
                rootCid = cid
                try encryptAndStoreConfig()
                if (self.fula != nil) {
                    try self.fula?.flush()
                }
                resolve(rootCid)
            } else {
                NSLog("ReactNative writeFile Error: config is nil")
                reject("ERR_WNFS", "writeFile Error: config is nil", nil)
            }
        } catch let error {
            print("writeFile", error.localizedDescription)
            reject("ERR_WNFS", "writeFile", error)
        }
    }

    @objc(writeFileContent:withContentString:withResolver:withRejecter:)
    func writeFileContent(path: String, contentString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {

        NSLog("ReactNative writeFile: contentString = \(contentString)")
        NSLog("ReactNative writeFile: path = \(path)")
        do {
            let content = convertStringToByte(contentString)
            let cid = try self.wnfs?.WriteFile(cid: rootCid!, remotePath: path, data: content.toData())
            rootCid = cid
            try encryptAndStoreConfig()
            if (self.fula != nil) {
                try self.fula?.flush()
            }
            resolve(rootCid)
        } catch let error {
            print("writeFileContent", error.localizedDescription)
            reject("ERR_WNFS", "writeFileContent", error)
        }

    }

    @objc(ls:withResolver:withRejecter:)
    func ls(path: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        NSLog("ReactNative ls: path = \(path)")
        do {
            let res =  try self.wnfs?.Ls(cid: rootCid!, remotePath: path)

            //JSONArray jsonArray = new JSONArray(res)
            guard let s = res?.toUTF8String() else {
                throw MyError.runtimeError("ReactNative converting bytes to utf8 string")
            }
            NSLog("ReactNative ls: res = \(s)")
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
            let cid = try self.wnfs?.Rm(cid: rootCid!, remotePath: path)
            if(cid != nil) {
                rootCid = cid
                try encryptAndStoreConfig()
                if (self.fula != nil) {
                    try self.fula?.flush()
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
            let cid = try self.wnfs?.Cp(cid: rootCid!, remotePathFrom: sourcePath, remotePathTo: targetPath)
            if(cid != nil) {
                rootCid = cid
                try encryptAndStoreConfig()
                if (self.fula != nil) {
                    try self.fula?.flush()
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
            let cid = try self.wnfs?.Mv(cid: rootCid!, remotePathFrom: sourcePath, remotePathTo: targetPath)
            if(cid != nil) {
                rootCid = cid
                try encryptAndStoreConfig()
                if (self.fula != nil) {
                    try self.fula?.flush()
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
            let path = try self.wnfs?.ReadFileToPath(cid: rootCid!, remotePath: fulaTargetFilename, fileUrl: URL.init(string: localFilename)!)
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
                let res = try self.wnfs?.ReadFile(cid: rootCid!, remotePath: path)
                guard let resString = res?.toUTF8String() else{
                    throw MyError.runtimeError(" ReactNative converting bytes to utf8 string")
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
            let value = try self.fula!.get(key)
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
            try self.fula?.has(key, ret0_: ret)
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
            try self.fula!.pull(key)
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
            if (self.fula != nil && hasIt) {
                try self.fula?.push(key)
                try self.fula?.flush()
            } else {
                print("ReactNative", "pushInternal error: key wasn't found or fula is not initialized")
                throw MyError.runtimeError("ReactNative pushInternal error: key wasn't found or fula is not initialized")
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
            if(self.fula != nil) {
                let key: Data = try self.fula!.put(value, codec: Int64(FulaModule.CODEC_DAG_CBOR))
                try self.fula?.flush()
                return key
            } else {
                print("ReactNative", "putInternal Error: fula is not initialized")
                throw MyError.runtimeError("ReactNative putInternal Error: fula is not initialized")
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
            if (self.fula != nil && !(self.fula?.id_().isEmpty)! && fulaConfig != nil && !fulaConfig!.bloxAddr.isEmpty) {
                let bloxAddr = fulaConfig!.bloxAddr
                print("ReactNative", "setAuth: bloxAddr = '",bloxAddr,"'"," peerIdString = '",peerIdString,"'")
                let parts = bloxAddr.split(separator: "/").map(String.init)
                try self.fula?.setAuth(parts.last, subject: peerIdString, allow: allow)
                resolve(true)
            } else {
                print("ReactNative", "setAuth error: fula is not initialized")
                throw MyError.runtimeError("ReactNative fula is not initialized")
            }
            resolve(false)
        } catch let error {
            print("get", error.localizedDescription)
            reject("ERR_FULA", "setAuth", error)
        }

    }

    @objc(clearCidsFromRecent:withResolver:withRejecter:)
    func clearCidsFromRecent(cidArray: NSArray, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .default).async {
            do {
                guard let fulaClient = self.fula else {
                    throw MyError.runtimeError("ReactNative Fula client is not initialized")
                }

                // Concatenate all CID strings into a single string separated by "|"
                let concatenatedCids = (cidArray as? [String])?.joined(separator: "|")

                guard let cidsData = concatenatedCids?.data(using: .utf8) else {
                    throw MyError.runtimeError("ReactNative Unable to encode CIDs as data")
                }

                try fulaClient.clearCids(fromRecent: cidsData)
                resolve(true)
            } catch let error {
                print("ReactNative", "clearCidsFromRecent failed with Error: \(error.localizedDescription)")
                reject("ERR_FULA_CLEAR_CIDS", "Failed to clear CIDs from recent", error)
            }
        }
    }


    @objc(listRecentCidsAsString:withRejecter:)
    func listRecentCidsAsString(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .default).async {
            do {
                guard let fulaClient = self.fula else {
                    throw MyError.runtimeError("ReactNative Fula client is not initialized")
                }

                let recentLinksIterator = try fulaClient.listRecentCidsAsString()
                var recentLinksList = [String]()

                while recentLinksIterator.hasNext() {
                    var error: NSError?
                    let nextLink = try recentLinksIterator.next(&error)

                    if let error = error {
                        throw error
                    }

                    recentLinksList.append(nextLink)
                }

                if !recentLinksList.isEmpty {
                    // Return the whole list
                    resolve(recentLinksList)
                } else {
                    resolve(false)
                }
            } catch let error {
                print("ReactNative", "listRecentCidsAsString failed with Error: \(error.localizedDescription)")
                reject("ERR_FULA_LIST_RECENT_CIDS", "Failed to list recent CIDs as string", error)
            }
        }
    }

    @objc(listRecentCidsAsStringWithChildren:withRejecter:)
    func listRecentCidsAsStringWithChildren(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .default).async {
            do {
                guard let fulaClient = self.fula else {
                    throw MyError.runtimeError("ReactNative Fula client is not initialized")
                }

                let recentLinksIterator = try fulaClient.listRecentCidsAsStringWithChildren()
                var recentLinksList = [String]()

                while recentLinksIterator.hasNext() {
                    var error: NSError?
                    let nextLink = try recentLinksIterator.next(&error)

                    if let error = error {
                        throw error
                    }

                    recentLinksList.append(nextLink)
                }

                if !recentLinksList.isEmpty {
                    // Return the whole list
                    resolve(recentLinksList)
                } else {
                    resolve(false)
                }
            } catch let error {
                print("ReactNative", "listRecentCidsAsStringWithChildren failed with Error: \(error.localizedDescription)")
                reject("ERR_FULA_LIST_RECENT_CIDS_WITH_CHILDREN", "Failed to list recent CIDs as string with children", error)
            }
        }
    }

    @objc(batchUploadManifest:withPoolId:withReplicationFactor:withResolver:withRejecter:)
    func batchUploadManifest(cidArray: NSArray, poolIDStr: String, replicationFactorStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .default).async {
            do {
                guard let fulaClient = self.fula else {
                    throw MyError.runtimeError("ReactNative Fula client is not initialized")
                }
                guard let poolID = Int64(poolIDStr) else {
                    let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Invalid poolID - not a valid number: \(poolIDStr)"])
                    reject("ERR_FULA", "Invalid poolID - not a valid number: \(poolIDStr)", error)
                    return
                }
                guard let replicationFactor = Int64(replicationFactorStr) else {
                    let error = NSError(domain: "FULAErrorDomain",
                                        code: 1002,
                                        userInfo: [NSLocalizedDescriptionKey: "Invalid replicationFactor - not a valid number: \(replicationFactorStr)"])
                    reject("ERR_FULA", "Invalid replicationFactorStr - not a valid number: \(replicationFactorStr)", error)
                    return
                }

                // Concatenate all CID strings into a single string separated by "|"
                let concatenatedCids = (cidArray as? [String])?.joined(separator: "|")

                guard let cidsData = concatenatedCids?.data(using: .utf8) else {
                    throw MyError.runtimeError("ReactNative Unable to encode CIDs as data")
                }

                // Adjusted call to match the expected method signature and argument types
                try fulaClient.batchUploadManifest(cidsData, poolID: Int(poolID), replicationFactor: Int(replicationFactor))
                resolve(true)
            } catch let error {
                print("ReactNative", "batchUploadManifest failed with Error: \(error.localizedDescription)")
                reject("ERR_FULA_BATCH_UPLOAD_MANIFEST", "Failed to batch upload CIDs", error)
            }
        }
    }



    @objc(shutdown:withRejecter:)
    func shutdown( resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        do {
            try shutdownInternal()
            resolve(true)
        } catch let error {
            NSLog("ReactNative shutdown \(error.localizedDescription)")
            reject("ERR_FULA", "shutdown", error)
        }

    }

    @objc
    func deleteDsLock(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let lockFilePath = (fulaConfig!.storePath as NSString).appendingPathComponent("LOCK")
        let fileManager = FileManager.default

        do {
            if fileManager.fileExists(atPath: lockFilePath) {
                try fileManager.removeItem(atPath: lockFilePath)
                NSLog("ReactNative: Lock file deleted successfully.")
                resolve(true)
            } else {
                NSLog("ReactNative: Lock file does not exist.")
                resolve(false) // Resolve with false if the file doesn't exist
            }
        } catch let error as NSError {
            NSLog("ReactNative: Failed to delete lock file: \(error.localizedDescription)")
            reject("delete_error", "Failed to delete lock file", error)
        }
    }

    func shutdownInternal() {
        NSLog("ReactNative shutdownInternal")
        if self.fula != nil {
            NSLog("ReactNative shutdownInternal fula is not null")
            do {
                try self.fula?.shutdown()
                NSLog("ReactNative shutdownInternal fula.shutdown called")
            } catch {
                // Handle specific errors if needed or log them
                NSLog("ReactNative shutdownInternal error: \(error.localizedDescription)")
            }
            // Ensure resources are cleaned up regardless of errors
            self.fula = nil
            self.client = nil
            self.wnfs = nil
        }
    }

    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    //////////////////////ANYTHING BELOW IS FOR BLOCKCHAIN/////
    ///////////////////////////////////////////////////////////

    @objc(checkAccountExists:withResolver:withRejecter:)
    func checkAccountExists(accountString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        print("ReactNative", "checkAccountExists: accountString = ", accountString)
        do {
            let result = try self.fula!.accountExists(accountString)
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("checkAccountExists", error.localizedDescription)
            reject("ERR_FULA", "checkAccountExists", error)
        }

    }

    @objc(accountFund:withResolver:withRejecter:)
    func accountFund(accountString: String,  resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        print("ReactNative", "accountFund: accountString = ", accountString)
        do {
            let result = try self.fula!.accountFund(accountString)
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("accountFund", error.localizedDescription)
            reject("ERR_FULA", "accountFund", error)
        }

    }

    @objc(listPools:withRejecter:)
    func listPools( resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)  -> Void {
        print("ReactNative", "listPools")
        do {
            let result = try self.fula!.poolList()
            let resultString = result.toUTF8String()!
            resolve(resultString)
        } catch let error {
            print("listPools", error.localizedDescription)
            reject("ERR_FULA", "listPools", error)
        }

    }

    @objc(listPoolJoinRequests:withResolver:withRejecter:)
    func listPoolJoinRequests(poolIDStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("ReactNative", "listPoolJoinRequests: poolIDStr = ", poolIDStr)
        do {
            if let poolID = Int64(poolIDStr), let intPoolID = Int(exactly: poolID) {
                // Conversion to Int successful - use intPoolID
                let result = try self.fula!.poolRequests(intPoolID)
                let resultString = result.toUTF8String()!
                resolve(resultString)
            } else {
                // Handle invalid input or Int64 not convertible to Int
                let error = NSError(domain: "FULAErrorDomain",
                                    code: 1003,
                                    userInfo: [NSLocalizedDescriptionKey: "Invalid poolIDStr - not a valid number or too large: \(poolIDStr)"])
                reject("ERR_FULA", "Invalid poolIDStr - not a valid number or too large: \(poolIDStr)", error)
            }
        } catch let error {
            print("listPoolJoinRequests", error.localizedDescription)
            let nsError = error as NSError
            reject("ERR_FULA", "Failed listPoolJoinRequests due to error", nsError)
        }
    }

    @objc(listAvailableReplicationRequests:withResolver:withRejecter:)
    func listAvailableReplicationRequests(poolIDStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("ReactNative", "listAvailableReplicationRequests: poolIDStr = ", poolIDStr)
        do {
            guard let poolID = Int64(poolIDStr), let intPoolID = Int(exactly: poolID) else {
                let error = NSError(domain: "FULAErrorDomain",
                                    code: 1004, // Use appropriate error code
                                    userInfo: [NSLocalizedDescriptionKey: "Invalid poolID - not a valid number: \(poolIDStr)"])
                reject("ERR_FULA", "Invalid poolID - not a valid number: \(poolIDStr)", error)
                return
            }
            let result = try self.fula!.manifestAvailable(intPoolID)
            guard let resultString = result.toUTF8String() else {
                let error = NSError(domain: "FULAErrorDomain",
                                    code: 1005, // Use appropriate error code
                                    userInfo: [NSLocalizedDescriptionKey: "Failed to convert result to UTF8 String"])
                reject("ERR_FULA", "Conversion Error", error)
                return
            }
            resolve(resultString)
        } catch let error as NSError {
            print("listAvailableReplicationRequests", error.localizedDescription)
            reject("ERR_FULA", "listAvailableReplicationRequests failed with error: \(error.localizedDescription)", error)
        }
    }


    @objc(bloxFreeSpace:withRejecter:)
    func bloxFreeSpace(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("ReactNative", "bloxFreeSpace")
        guard let fulaClient = self.fula else {
            print("bloxFreeSpace", "fula client is nil")
            let error = NSError(domain: "FulaModuleError", code: 0, userInfo: [NSLocalizedDescriptionKey: "Fula client is not initialized"])
            reject("ERR_FULA_NOT_INITIALIZED", "Fula client is not initialized", error)
            return
        }

        do {
            let result = try fulaClient.bloxFreeSpace()
            guard let resultString = result.toUTF8String() else {
                let error = NSError(domain: "FulaModuleError", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to convert result to String"])
                reject("ERR_FULA_RESULT_CONVERSION", "Failed to convert result to String", error)
                return
            }
            resolve(resultString)
        } catch let error {
            print("bloxFreeSpace", error.localizedDescription)
            reject("ERR_FULA", "bloxFreeSpace", error)
        }
    }

    @objc(transferToFula:wallet:chain:withResolver:withRejecter:)
    func transferToFula(amount: String, wallet: String, chain: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .default).async {
            do {
                print("ReactNative", "transferToFula called")
                let result = try self.fula!.transfer(toFula: amount, walletAccount: wallet, chain: chain)
                let resultString = String(data: result, encoding: .utf8)
                resolve(resultString)
            } catch let error {
                print("ReactNative", "transferToFula failed with Error: \(error.localizedDescription)")
                reject("ERR_FULA_TRANSFER", "transferToFula failed", error)
            }
        }
    }


  @objc(getAccount:withRejecter:)
    func getAccount(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let fulaClient = self.fula else {
            let error = NSError(domain: "FulaModuleError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Fula client is not initialized"])
            reject("ERR_FULA_NOT_INITIALIZED", "Fula client is not initialized", error)
            return
        }

        do {
            let account = try fulaClient.getAccount()
            guard let accountString = String(data: account, encoding: .utf8) else {
                let conversionError = NSError(domain: "FulaModuleError", code: -2, userInfo: [NSLocalizedDescriptionKey: "Unable to convert account data to String"])
                reject("ERR_FULA_CONVERSION_FAILED", "Unable to convert account data to String", conversionError)
                return
            }
            resolve(accountString)
        } catch let error {
            reject("ERR_FULA", "getAccount: \(error.localizedDescription)", error)
        }
    }

    @objc(assetsBalance:withAssetId:withClassId:withResolver:withRejecter:)
    func assetsBalance(account: String, assetId: String, classId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let assetIdInt = Int(assetId), let classIdInt = Int(classId) else {
            reject("ERR_FULA", "Invalid assetId or classId", nil)
            return
        }

        do {
            let balance = try self.fula!.assetsBalance(account, assetId: assetIdInt, classId: classIdInt)
            let balanceString = String(data: balance, encoding: .utf8)
            resolve(balanceString)
        } catch let error {
            reject("ERR_FULA", "assetsBalance: \(error.localizedDescription)", error)
        }
    }

  @objc(joinPool:withResolver:withRejecter:)
  func joinPool(poolID: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      print("ReactNative", "joinPool: poolID = ", poolID)
      do {
          guard let poolIdInt = Int(poolID) else {
              throw NSError(domain: "Invalid poolID", code: 0, userInfo: nil)
          }
          let result = try self.fula!.poolJoin(poolIdInt)
          let resultString = String(data: result, encoding: .utf8)
          resolve(resultString)
      } catch let error {
          reject("ERR_FULA", "joinPool: \(error.localizedDescription)", error)
      }
  }

  @objc(cancelPoolJoin:withResolver:withRejecter:)
  func cancelPoolJoin(poolID: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      do {
          guard let poolIdInt = Int(poolID) else {
              throw NSError(domain: "Invalid poolID", code: 0, userInfo: nil)
          }
          let result = try self.fula!.poolCancelJoin(poolIdInt)
          let resultString = String(data: result, encoding: .utf8)
          resolve(resultString)
      } catch let error {
          reject("ERR_FULA", "cancelPoolJoin: \(error.localizedDescription)", error)
      }
  }

  @objc(leavePool:withResolver:withRejecter:)
  func leavePool(poolID: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      print("ReactNative", "leavePool: poolID = ", poolID)
      do {
          guard let poolIdInt = Int(poolID) else {
              throw NSError(domain: "Invalid poolID", code: 0, userInfo: nil)
          }
          let result = try self.fula!.poolLeave(poolIdInt)
          let resultString = String(data: result, encoding: .utf8)
          resolve(resultString)
      } catch let error {
          reject("ERR_FULA", "leavePool: \(error.localizedDescription)", error)
      }
  }

  @objc(joinPoolWithChain:withChainName:withResolver:withRejecter:)
  func joinPoolWithChain(poolID: String, chainName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      print("ReactNative", "joinPoolWithChain: poolID = ", poolID, ", chainName = ", chainName)
      do {
          // Validate inputs
          guard !poolID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
              let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Pool ID cannot be null or empty"])
              reject("INVALID_POOL_ID", "Pool ID cannot be null or empty", error)
              return
          }

          guard !chainName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
              let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Chain name cannot be null or empty"])
              reject("INVALID_CHAIN_NAME", "Chain name cannot be null or empty", error)
              return
          }

          guard let fula = self.fula else {
              let error = NSError(domain: "FULAErrorDomain", code: 1003, userInfo: [NSLocalizedDescriptionKey: "Fula client is not initialized"])
              reject("FULA_NOT_INITIALIZED", "Fula client is not initialized", error)
              return
          }

          guard let poolIdInt = Int(poolID) else {
              let error = NSError(domain: "FULAErrorDomain", code: 1004, userInfo: [NSLocalizedDescriptionKey: "Pool ID must be a valid number: \(poolID)"])
              reject("INVALID_POOL_ID_FORMAT", "Pool ID must be a valid number: \(poolID)", error)
              return
          }

          let result = try fula.poolJoin(withChain: poolIdInt, chainName: chainName)
          let resultString = String(data: result, encoding: .utf8)
          resolve(resultString)
      } catch let error {
          reject("ERR_FULA", "joinPoolWithChain: \(error.localizedDescription)", error)
      }
  }

  @objc(leavePoolWithChain:withChainName:withResolver:withRejecter:)
  func leavePoolWithChain(poolID: String, chainName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      print("ReactNative", "leavePoolWithChain: poolID = ", poolID, ", chainName = ", chainName)
      do {
          // Validate inputs
          guard !poolID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
              let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Pool ID cannot be null or empty"])
              reject("INVALID_POOL_ID", "Pool ID cannot be null or empty", error)
              return
          }

          guard !chainName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
              let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Chain name cannot be null or empty"])
              reject("INVALID_CHAIN_NAME", "Chain name cannot be null or empty", error)
              return
          }

          guard let fula = self.fula else {
              let error = NSError(domain: "FULAErrorDomain", code: 1003, userInfo: [NSLocalizedDescriptionKey: "Fula client is not initialized"])
              reject("FULA_NOT_INITIALIZED", "Fula client is not initialized", error)
              return
          }

          guard let poolIdInt = Int(poolID) else {
              let error = NSError(domain: "FULAErrorDomain", code: 1004, userInfo: [NSLocalizedDescriptionKey: "Pool ID must be a valid number: \(poolID)"])
              reject("INVALID_POOL_ID_FORMAT", "Pool ID must be a valid number: \(poolID)", error)
              return
          }

          let result = try fula.poolLeave(withChain: poolIdInt, chainName: chainName)
          let resultString = String(data: result, encoding: .utf8)
          resolve(resultString)
      } catch let error {
          reject("ERR_FULA", "leavePoolWithChain: \(error.localizedDescription)", error)
      }
  }


  @objc(eraseBlData:withRejecter:)
  func eraseBlData(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      do {
          let result = try self.fula!.eraseBlData()
          let resultString = String(data: result, encoding: .utf8)
          resolve(resultString)
      } catch let error {
          reject("ERR_FULA", "eraseBlData: \(error.localizedDescription)", error)
      }
  }

  @objc(reboot:withRejecter:)
  func reboot(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
      do {
          let result = try self.fula!.reboot()
          let resultString = result.toUTF8String()!
          resolve(resultString)
      } catch let error {
          print("reboot", error.localizedDescription)
          reject("ERR_FULA", "reboot", error)
      }
  }

  @objc(partition:withRejecter:)
  func partition(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
      do {
          let result = try self.fula!.partition()
          let resultString = result.toUTF8String()!
          resolve(resultString)
      } catch let error {
          print("partition", error.localizedDescription)
          reject("ERR_FULA", "partition", error)
      }
  }

  @objc(wifiRemoveall:withRejecter:)
  func wifiRemoveall(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
      do {
          let result = try self.fula!.wifiRemoveall()
          let resultString = result.toUTF8String()!
          resolve(resultString)
      } catch let error {
          print("wifiRemoveall", error.localizedDescription)
          reject("ERR_FULA", "wifiRemoveall", error)
      }
  }

    @objc(fetchContainerLogs:withTailCount:withResolver:withRejecter:)
    func fetchContainerLogs(containerName: String, tailCount: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            // Since fetchContainerLogs expects a String for tailCount, pass it directly
            let result = try self.fula!.fetchContainerLogs(containerName, tailCount: tailCount)
            guard let resultString = result.toUTF8String() else {
                // Handle the case where result.toUTF8String() returns nil
                let error = NSError(domain: "FULAErrorDomain",
                                    code: 1007, // Choose a suitable error code
                                    userInfo: [NSLocalizedDescriptionKey: "Failed to convert log data to string."])
                reject("ERR_FULA", "Log Conversion Error", error)
                return
            }
            resolve(resultString)
        } catch let error as NSError {
            print("fetchContainerLogs", error.localizedDescription)
            reject("ERR_FULA", "fetchContainerLogs failed", error)
        }
    }
    @objc(findBestAndTargetInLogs:withTailCount:withResolver:withRejecter:)
    func findBestAndTargetInLogs(containerName: String, tailCount: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            // Since fetchContainerLogs expects a String for tailCount, pass it directly
            let result = try self.fula!.findBestAndTarget(inLogs: containerName, tailCount: tailCount)
            guard let resultString = result.toUTF8String() else {
                // Handle the case where result.toUTF8String() returns nil
                let error = NSError(domain: "FULAErrorDomain",
                                    code: 1007, // Choose a suitable error code
                                    userInfo: [NSLocalizedDescriptionKey: "Failed to convert log data to string."])
                reject("ERR_FULA", "Log Conversion Error", error)
                return
            }
            resolve(resultString)
        } catch let error as NSError {
            print("fetchContainerLogs", error.localizedDescription)
            reject("ERR_FULA", "fetchContainerLogs failed", error)
        }
    }



  @objc(getFolderSize:withResolver:withRejecter:)
  func getFolderSize(folderPath: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
      // Validate the folder path
      guard !folderPath.isEmpty else {
          reject("ERR_INVALID_PATH", "The folder path is empty.", nil)
          return
      }

      do {
          // Ensure fula is not nil before calling getFolderSize
          guard let fula = self.fula else {
              reject("ERR_FULA", "Fula instance is not initialized.", nil)
              return
          }

          // Attempt to get the folder size
          let result = try fula.getFolderSize(folderPath)

          // Convert the result to a UTF-8 string safely
          if let resultString = result.toUTF8String() {
              resolve(resultString)
          } else {
              reject("ERR_CONVERSION", "Failed to convert result to UTF-8 string.", nil)
          }
      } catch let error {
          // Log and reject with detailed error information
          print("getFolderSize error:", error.localizedDescription)
          reject("ERR_FULA", "Failed to get folder size: \(error.localizedDescription)", error)
      }
  }

    @objc
    func getDatastoreSize(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .background).async {
            // Safely unwrap `self.fula` using `guard let`
            guard let fulaClient = self.fula else {
                let error = NSError(domain: "FulaModuleError", code: 0, userInfo: [NSLocalizedDescriptionKey: "Fula client is not initialized"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_NOT_INITIALIZED", "Fula client is not initialized", error)
                }
                return
            }

            do {
                let result = try fulaClient.getDatastoreSize()
                let resultString = String(decoding: result, as: UTF8.self)
                DispatchQueue.main.async {
                    resolve(resultString)
                }
            } catch let error {
                DispatchQueue.main.async {
                    reject("ERR_FULA", "Failed to get datastore size: \(error.localizedDescription)", error)
                }
            }
        }
    }

@objc(listPlugins:withRejecter:)
func listPlugins(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .background).async {
        do {
            guard let fula = self.fula else {
                let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula instance is not initialized"])
                DispatchQueue.main.async {
                    reject("ERR_FULA", "Fula not initialized", error)
                }
                return
            }

            let result = try fula.listPlugins()
            guard let resultString = result.toUTF8String() else {
                let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Failed to convert plugin list to string"])
                DispatchQueue.main.async {
                    reject("ERR_FULA", "Plugin List Conversion Error", error)
                }
                return
            }

            DispatchQueue.main.async {
                resolve(resultString)
            }
        } catch let error {
            print("listPlugins", error.localizedDescription)
            DispatchQueue.main.async {
                reject("ERR_FULA", "listPlugins failed", error)
            }
        }
    }
}

@objc(listActivePlugins:withRejecter:)
func listActivePlugins(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .background).async {
        do {
            guard let fula = self.fula else {
                let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula instance is not initialized"])
                DispatchQueue.main.async {
                    reject("ERR_FULA", "Fula not initialized", error)
                }
                return
            }

            let result: Data
            do {
                result = try fula.listActivePlugins()
            } catch {
                print("Error listing active plugins: \(error)")
                DispatchQueue.main.async {
                    reject("ERR_FULA", "Failed to list active plugins", error)
                }
                return
            }

            guard !result.isEmpty else {
                let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Active plugin list is empty"])
                DispatchQueue.main.async {
                    reject("ERR_FULA", "Empty Active Plugin List", error)
                }
                return
            }

            guard let resultString = String(data: result, encoding: .utf8) else {
                let error = NSError(domain: "FULAErrorDomain", code: 1003, userInfo: [NSLocalizedDescriptionKey: "Failed to convert active plugin list to string"])
                DispatchQueue.main.async {
                    reject("ERR_FULA", "Active Plugin List Conversion Error", error)
                }
                return
            }

            DispatchQueue.main.async {
                resolve(resultString)
            }
        } catch let error {
            print("listActivePlugins unexpected error:", error.localizedDescription)
            DispatchQueue.main.async {
                reject("ERR_FULA", "listActivePlugins failed unexpectedly", error)
            }
        }
    }
}

@objc(installPlugin:withParams:withResolver:withRejecter:)
func installPlugin(pluginName: String, params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .background).async {
        do {
            guard let fula = self.fula else {
                let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula instance is not initialized"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_NOT_INITIALIZED", "Fula not initialized", error)
                }
                return
            }

            let result = try fula.installPlugin(pluginName, params: params)
            guard let resultString = result.toUTF8String() else {
                let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Failed to convert install result to string"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_RESULT_CONVERSION", "Install Result Conversion Error", error)
                }
                return
            }

            DispatchQueue.main.async {
                resolve(resultString)
            }
        } catch let error {
            print("installPlugin error:", error.localizedDescription)
            DispatchQueue.main.async {
                reject("ERR_FULA_INSTALL_PLUGIN", "Failed to install plugin: \(pluginName)", error)
            }
        }
    }
}

@objc(uninstallPlugin:withResolver:withRejecter:)
func uninstallPlugin(pluginName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .background).async {
        do {
            guard let fula = self.fula else {
                let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula instance is not initialized"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_NOT_INITIALIZED", "Fula not initialized", error)
                }
                return
            }

            let result = try fula.uninstallPlugin(pluginName)
            guard let resultString = result.toUTF8String() else {
                let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Failed to convert uninstall result to string"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_RESULT_CONVERSION", "Uninstall Result Conversion Error", error)
                }
                return
            }

            DispatchQueue.main.async {
                resolve(resultString)
            }
        } catch let error {
            print("uninstallPlugin error:", error.localizedDescription)
            DispatchQueue.main.async {
                reject("ERR_FULA_UNINSTALL_PLUGIN", "Failed to uninstall plugin: \(pluginName)", error)
            }
        }
    }
}

@objc(showPluginStatus:withLines:withResolver:withRejecter:)
func showPluginStatus(pluginName: String, lines: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .background).async {
        do {
            guard let fula = self.fula else {
                let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula instance is not initialized"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_NOT_INITIALIZED", "Fula not initialized", error)
                }
                return
            }

            let result: Data
            do {
                result = try fula.showPluginStatus(pluginName, lines: lines)
            } catch {
                print("Error showing plugin status: \(error)")
                DispatchQueue.main.async {
                    reject("ERR_FULA_SHOW_PLUGIN_STATUS", "Failed to show plugin status", error)
                }
                return
            }

            guard !result.isEmpty else {
                let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Plugin status result is empty"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_EMPTY_RESULT", "Empty Plugin Status Result", error)
                }
                return
            }

            guard let resultString = String(data: result, encoding: .utf8) else {
                let error = NSError(domain: "FULAErrorDomain", code: 1003, userInfo: [NSLocalizedDescriptionKey: "Failed to convert plugin status to string"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_RESULT_CONVERSION", "Plugin Status Conversion Error", error)
                }
                return
            }

            DispatchQueue.main.async {
                resolve(resultString)
            }
        } catch {
            print("showPluginStatus unexpected error:", error.localizedDescription)
            DispatchQueue.main.async {
                reject("ERR_FULA_SHOW_PLUGIN_STATUS", "showPluginStatus failed unexpectedly", error)
            }
        }
    }
}

@objc(getInstallOutput:withParams:withResolver:withRejecter:)
func getInstallOutput(pluginName: String, params: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .background).async {
        do {
            guard let fula = self.fula else {
                let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula instance is not initialized"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_NOT_INITIALIZED", "Fula not initialized", error)
                }
                return
            }

            let result: Data
            do {
                result = try fula.getInstallOutput(pluginName, params: params)
            } catch {
                print("Error getting install output: \(error)")
                DispatchQueue.main.async {
                    reject("ERR_FULA_GET_INSTALL_OUTPUT", "Failed to get install output", error)
                }
                return
            }

            guard !result.isEmpty else {
                let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Install output is empty"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_EMPTY_RESULT", "Empty Install Output", error)
                }
                return
            }

            guard let resultString = String(data: result, encoding: .utf8) else {
                let error = NSError(domain: "FULAErrorDomain", code: 1003, userInfo: [NSLocalizedDescriptionKey: "Failed to convert install output to string"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_RESULT_CONVERSION", "Install Output Conversion Error", error)
                }
                return
            }

            DispatchQueue.main.async {
                resolve(resultString)
            }
        } catch {
            print("getInstallOutput unexpected error:", error.localizedDescription)
            DispatchQueue.main.async {
                reject("ERR_FULA_GET_INSTALL_OUTPUT", "getInstallOutput failed unexpectedly", error)
            }
        }
    }
}

@objc(getInstallStatus:withResolver:withRejecter:)
func getInstallStatus(pluginName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .background).async {
        do {
            guard let fula = self.fula else {
                let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula instance is not initialized"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_NOT_INITIALIZED", "Fula not initialized", error)
                }
                return
            }

            let result: Data
            do {
                result = try fula.getInstallStatus(pluginName)
            } catch {
                print("Error getting install status: \(error)")
                DispatchQueue.main.async {
                    reject("ERR_FULA_GET_INSTALL_STATUS", "Failed to get install status", error)
                }
                return
            }

            guard !result.isEmpty else {
                let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Install status result is empty"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_EMPTY_RESULT", "Empty Install Status Result", error)
                }
                return
            }

            guard let resultString = String(data: result, encoding: .utf8) else {
                let error = NSError(domain: "FULAErrorDomain", code: 1003, userInfo: [NSLocalizedDescriptionKey: "Failed to convert install status to string"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_RESULT_CONVERSION", "Install Status Conversion Error", error)
                }
                return
            }

            DispatchQueue.main.async {
                resolve(resultString)
            }
        } catch {
            print("getInstallStatus unexpected error:", error.localizedDescription)
            DispatchQueue.main.async {
                reject("ERR_FULA_GET_INSTALL_STATUS", "getInstallStatus failed unexpectedly", error)
            }
        }
    }
}

@objc(updatePlugin:withResolver:withRejecter:)
func updatePlugin(pluginName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .background).async {
        do {
            guard let fula = self.fula else {
                let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula instance is not initialized"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_NOT_INITIALIZED", "Fula not initialized", error)
                }
                return
            }

            let result: Data
            do {
                result = try fula.updatePlugin(pluginName)
            } catch {
                print("Error updating plugin: \(error)")
                DispatchQueue.main.async {
                    reject("ERR_FULA_UPDATE_PLUGIN", "Failed to update plugin: \(pluginName)", error)
                }
                return
            }

            guard !result.isEmpty else {
                let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Update plugin result is empty"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_EMPTY_RESULT", "Empty Update Plugin Result", error)
                }
                return
            }

            guard let resultString = String(data: result, encoding: .utf8) else {
                let error = NSError(domain: "FULAErrorDomain", code: 1003, userInfo: [NSLocalizedDescriptionKey: "Failed to convert update plugin result to string"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_RESULT_CONVERSION", "Update Plugin Result Conversion Error", error)
                }
                return
            }

            DispatchQueue.main.async {
                resolve(resultString)
            }
        } catch {
            print("updatePlugin unexpected error:", error.localizedDescription)
            DispatchQueue.main.async {
                reject("ERR_FULA_UPDATE_PLUGIN", "updatePlugin failed unexpectedly", error)
            }
        }
    }
}

@objc(replicateInPool:withAccount:withPoolID:withResolver:withRejecter:)
func replicateInPool(cidArray: [String], account: String, poolID: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .background).async {
        do {
            guard let fula = self.fula else {
                let error = NSError(domain: "FULAErrorDomain", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Fula instance is not initialized"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_NOT_INITIALIZED", "Fula not initialized", error)
                }
                return
            }

            guard let poolIDLong = Int64(poolID) else {
                let error = NSError(domain: "FULAErrorDomain", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Invalid poolID"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_INVALID_POOL_ID", "Invalid poolID", error)
                }
                return
            }

            guard let poolIDInt = Int(exactly: poolIDLong) else {
                let error = NSError(domain: "FULAErrorDomain", code: 1003, userInfo: [NSLocalizedDescriptionKey: "PoolID is too large for Int"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_POOL_ID_OVERFLOW", "PoolID is too large", error)
                }
                return
            }

            let cidString = cidArray.joined(separator: "|")
            guard let cidsBytes = cidString.data(using: .utf8) else {
                let error = NSError(domain: "FULAErrorDomain", code: 1004, userInfo: [NSLocalizedDescriptionKey: "Failed to encode CIDs as data"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_CID_ENCODING", "Failed to encode CIDs", error)
                }
                return
            }

            let result: Data
            do {
                if let replicationResult = fula.replicate(inPool: cidsBytes, account: account, poolID: poolIDInt) {
                    result = replicationResult
                } else {
                    throw NSError(domain: "FULAErrorDomain", code: 1007, userInfo: [NSLocalizedDescriptionKey: "Replication result is nil"])
                }
            } catch {
                print("Error replicating in pool: \(error)")
                DispatchQueue.main.async {
                    reject("ERR_FULA_REPLICATION", "Failed to replicate in pool", error)
                }
                return
            }

            guard !result.isEmpty else {
                let error = NSError(domain: "FULAErrorDomain", code: 1005, userInfo: [NSLocalizedDescriptionKey: "Replication result is empty"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_EMPTY_RESULT", "Empty replication result", error)
                }
                return
            }

            guard let resultString = String(data: result, encoding: .utf8) else {
                let error = NSError(domain: "FULAErrorDomain", code: 1006, userInfo: [NSLocalizedDescriptionKey: "Failed to decode result data to string"])
                DispatchQueue.main.async {
                    reject("ERR_FULA_RESULT_DECODING", "Failed to decode result", error)
                }
                return
            }

            DispatchQueue.main.async {
                resolve(resultString)
            }
        } catch {
            print("replicateInPool unexpected error:", error.localizedDescription)
            DispatchQueue.main.async {
                reject("ERR_FULA_REPLICATE_IN_POOL", "replicateInPool failed unexpectedly", error)
            }
        }
    }
}

// AI Chat methods

@objc(chatWithAI:withUserMessage:withResolver:withRejecter:)
func chatWithAI(aiModel: String, userMessage: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    NSLog("ReactNative chatWithAI: aiModel = \(aiModel), userMessage = \(userMessage)")
    DispatchQueue.global(qos: .default).async {
        do {
            guard let fula = self.fula else {
                throw MyError.runtimeError("ReactNative Fula client is not initialized")
            }

            // Call the Go Mobile method, which returns Data
            let streamIDData = try fula.chat(withAI: aiModel, userMessage: userMessage)

            // Convert Data to String (assuming UTF-8 encoding)
            guard let streamID = String(data: streamIDData, encoding: .utf8) else {
                throw MyError.runtimeError("Failed to convert stream ID to string")
            }

            // Resolve the promise with the stream ID
            DispatchQueue.main.async {
                resolve(streamID)
            }
        } catch let error {
            NSLog("ReactNative ERROR in chatWithAI: \(error.localizedDescription)")
            DispatchQueue.main.async {
                reject("ERR_CHAT_WITH_AI", "Chat with AI failed", error)
            }
        }
    }
}

@objc(getChatChunk:withResolver:withRejecter:)
func getChatChunk(streamID: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    NSLog("ReactNative getChatChunk: streamID = \(streamID)")
    DispatchQueue.global(qos: .default).async {
        do {
            guard let fula = self.fula else {
                throw MyError.runtimeError("ReactNative Fula client is not initialized")
            }

            // Call the Go Mobile method, which returns a String
            var error: NSError?
            let chunk = fula.getChatChunk(streamID, error: &error)
            
            if let error = error {
                throw error
            }

            // Handle null or empty response
            if chunk.isEmpty {
                NSLog("ReactNative getChatChunk: No data received for streamID = \(streamID)")
                DispatchQueue.main.async {
                    resolve("") // Resolve with an empty string
                }
                return
            }

            // Resolve the promise with the chunk of data
            NSLog("ReactNative getChatChunk: Successfully received chunk for streamID = \(streamID)")
            DispatchQueue.main.async {
                resolve(chunk)
            }
        } catch let error {
            // Log and reject the promise with the error
            NSLog("ReactNative ERROR in getChatChunk: \(error.localizedDescription)")
            DispatchQueue.main.async {
                reject("ERR_GET_CHAT_CHUNK", "Get chat chunk failed", error)
            }
        }
    }
}

@objc(streamChunks:withResolver:withRejecter:)
func streamChunks(streamID: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    if streamID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
        reject("INVALID_ARGUMENT", "streamID cannot be null or empty", nil)
        return
    }

    DispatchQueue.global(qos: .default).async {
        do {
            guard let fula = self.fula else {
                throw MyError.runtimeError("ReactNative Fula client is not initialized")
            }

            let iterator = try fula.getStreamIterator(streamID)
            // Iterator is now non-optional, no need for nil check

            // Start listening for chunks on the main thread
            DispatchQueue.main.async {
                self.pollIterator(iterator: iterator, resolve: resolve, reject: reject)
            }
        } catch let error {
            NSLog("ReactNative ERROR in streamChunks: \(error.localizedDescription)")
            DispatchQueue.main.async {
                reject("STREAM_ERROR", "Stream error", error)
            }
        }
    }
}

private func pollIterator(iterator: FulamobileStreamIterator, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
        var error: NSError?
        let chunk = iterator.next(&error)
        
        if let error = error {
            throw error
        }
        if !chunk.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines).isEmpty {
            self.emitEvent(eventName: "onChunkReceived", data: chunk)
        }

        if iterator.isComplete() {
            self.emitEvent(eventName: "onStreamingCompleted", data: nil)
            resolve(nil)
        } else {
            // Schedule another poll with a short delay
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) { // 50ms delay for better responsiveness
                self.pollIterator(iterator: iterator, resolve: resolve, reject: reject)
            }
        }
    } catch let error {
        let errorMessage = error.localizedDescription
        if errorMessage.contains("EOF") {
            self.emitEvent(eventName: "onStreamingCompleted", data: nil)
            resolve(nil)
        } else if errorMessage.contains("timeout") {
            // Retry on timeout
            DispatchQueue.main.async {
                self.pollIterator(iterator: iterator, resolve: resolve, reject: reject)
            }
        } else {
            self.emitEvent(eventName: "onStreamError", data: errorMessage)
            reject("STREAM_ERROR", errorMessage, error)
        }
    }
}

private func emitEvent(eventName: String, data: String?) {
    self.sendEvent(withName: eventName, body: data)
}

// Required for RCTEventEmitter
override func supportedEvents() -> [String]! {
    return ["onChunkReceived", "onStreamingCompleted", "onStreamError"]
}

// Required for RCTEventEmitter to prevent warnings
override static func requiresMainQueueSetup() -> Bool {
    return false
}

}


