import Foundation
import Foundation.NSDate // for TimeInterval
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

    var fulaConfig: FulamobileConfig?
    var appDir: URL
    var fulaStorePath: String

    enum MyError: Error {
        case runtimeError(String)
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


    @objc(ping:withResolver:withRejecter:)
    func ping(timeout: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        NSLog("ReactNative ping started")
        if self.fula != nil {
            DispatchQueue.global(qos: .default).async {
                do {
                    let result = try self.fula!.ping()
                    let resultString = String(data: result, encoding: .utf8) ?? "{\"success\":false,\"errors\":[\"failed to decode result\"]}"
                    NSLog("ReactNative ping result: \(resultString)")
                    resolve(resultString)
                } catch let error {
                    NSLog("ReactNative ping failed with Error: \(error.localizedDescription)")
                    reject("ERR_PING", error.localizedDescription, error)
                }
            }
        } else {
            NSLog("ReactNative ping failed: fula is null")
            reject("ERR_FULA", "Fula is not initialized", nil)
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
        do {
            let initialized = self.fula != nil && !self.fula!.id_().isEmpty
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
            NSLog("ReactNative init object created: [  \(obj[0]), \(obj[1]) ]")
            resultData["peerId"] = obj[0]
            resultData["rootCid"] = obj[1]
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

    func createPeerIdentity(privateKey: Data) throws -> Data {
        let privateKeyString = String(data: privateKey, encoding: .utf8) ?? ""
        guard !privateKeyString.isEmpty else {
            throw NSError(domain: "KeyGenerationError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Private key string conversion failed"])
        }
        var error: NSError?
        guard let generatedIdentity = FulamobileGenerateEd25519KeyFromString(privateKeyString, &error) else {
            throw error ?? NSError(domain: "KeyGenerationError", code: -1, userInfo: nil)
        }
        return generatedIdentity
    }

    func logoutInternal(identity: Data, _storePath: String?) throws {
        do {
            try shutdownInternal()
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
            if (self.fula == nil || refresh) {
                try newClientInternal(identity: identity, storePath: storePath, bloxAddr: bloxAddr, exchange: exchange, autoFlush: autoFlush, useRelay: useRelay, refresh: refresh)
            }
            guard let peerId = self.fula?.id_() else {
                throw MyError.runtimeError("ReactNative: fula client not ready")
            }
            NSLog("ReactNative fula initialized: \(peerId)")
            var obj = [String]()
            obj.append(peerId)
            obj.append("")
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
        guard let fula = self.fula else {
            reject("ERR_FULA", "Fula is not initialized", nil)
            return
        }
        do {
            let result = try fula.accountExists(accountString)
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
        guard let fula = self.fula else {
            reject("ERR_FULA", "Fula is not initialized", nil)
            return
        }
        do {
            let result = try fula.accountFund(accountString)
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
        guard let fula = self.fula else {
            reject("ERR_FULA", "Fula is not initialized", nil)
            return
        }
        do {
            let result = try fula.poolList()
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
        guard let fula = self.fula else {
            reject("ERR_FULA", "Fula is not initialized", nil)
            return
        }
        do {
            if let poolID = Int64(poolIDStr), let intPoolID = Int(exactly: poolID) {
                // Conversion to Int successful - use intPoolID
                let result = try fula.poolRequests(intPoolID)
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
        guard let fula = self.fula else {
            reject("ERR_FULA", "Fula is not initialized", nil)
            return
        }
        do {
            guard let poolID = Int64(poolIDStr), let intPoolID = Int(exactly: poolID) else {
                let error = NSError(domain: "FULAErrorDomain",
                                    code: 1004, // Use appropriate error code
                                    userInfo: [NSLocalizedDescriptionKey: "Invalid poolID - not a valid number: \(poolIDStr)"])
                reject("ERR_FULA", "Invalid poolID - not a valid number: \(poolIDStr)", error)
                return
            }
            let result = try fula.manifestAvailable(intPoolID)
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
            guard let fula = self.fula else {
                reject("ERR_FULA", "Fula is not initialized", nil)
                return
            }
            do {
                print("ReactNative", "transferToFula called")
                let result = try fula.transfer(toFula: amount, walletAccount: wallet, chain: chain)
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

        guard let fula = self.fula else {
            reject("ERR_FULA", "Fula is not initialized", nil)
            return
        }
        do {
            let balance = try fula.assetsBalance(account, assetId: assetIdInt, classId: classIdInt)
            let balanceString = String(data: balance, encoding: .utf8)
            resolve(balanceString)
        } catch let error {
            reject("ERR_FULA", "assetsBalance: \(error.localizedDescription)", error)
        }
    }

  @objc(joinPool:withResolver:withRejecter:)
  func joinPool(poolID: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      print("ReactNative", "joinPool: poolID = ", poolID)
      guard let fula = self.fula else {
          reject("ERR_FULA", "Fula is not initialized", nil)
          return
      }
      do {
          guard let poolIdInt = Int(poolID) else {
              throw NSError(domain: "Invalid poolID", code: 0, userInfo: nil)
          }
          let result = try fula.poolJoin(poolIdInt)
          let resultString = String(data: result, encoding: .utf8)
          resolve(resultString)
      } catch let error {
          reject("ERR_FULA", "joinPool: \(error.localizedDescription)", error)
      }
  }

  @objc(cancelPoolJoin:withResolver:withRejecter:)
  func cancelPoolJoin(poolID: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      guard let fula = self.fula else {
          reject("ERR_FULA", "Fula is not initialized", nil)
          return
      }
      do {
          guard let poolIdInt = Int(poolID) else {
              throw NSError(domain: "Invalid poolID", code: 0, userInfo: nil)
          }
          let result = try fula.poolCancelJoin(poolIdInt)
          let resultString = String(data: result, encoding: .utf8)
          resolve(resultString)
      } catch let error {
          reject("ERR_FULA", "cancelPoolJoin: \(error.localizedDescription)", error)
      }
  }

  @objc(leavePool:withResolver:withRejecter:)
  func leavePool(poolID: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      print("ReactNative", "leavePool: poolID = ", poolID)
      guard let fula = self.fula else {
          reject("ERR_FULA", "Fula is not initialized", nil)
          return
      }
      do {
          guard let poolIdInt = Int(poolID) else {
              throw NSError(domain: "Invalid poolID", code: 0, userInfo: nil)
          }
          let result = try fula.poolLeave(poolIdInt)
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
      guard let fula = self.fula else {
          reject("ERR_FULA", "Fula is not initialized", nil)
          return
      }
      do {
          let result = try fula.eraseBlData()
          let resultString = String(data: result, encoding: .utf8)
          resolve(resultString)
      } catch let error {
          reject("ERR_FULA", "eraseBlData: \(error.localizedDescription)", error)
      }
  }

  @objc(reboot:withRejecter:)
  func reboot(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
      guard let fula = self.fula else {
          reject("ERR_FULA", "Fula is not initialized", nil)
          return
      }
      do {
          let result = try fula.reboot()
          let resultString = result.toUTF8String()!
          resolve(resultString)
      } catch let error {
          print("reboot", error.localizedDescription)
          reject("ERR_FULA", "reboot", error)
      }
  }

  @objc(partition:withRejecter:)
  func partition(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
      guard let fula = self.fula else {
          reject("ERR_FULA", "Fula is not initialized", nil)
          return
      }
      do {
          let result = try fula.partition()
          let resultString = result.toUTF8String()!
          resolve(resultString)
      } catch let error {
          print("partition", error.localizedDescription)
          reject("ERR_FULA", "partition", error)
      }
  }

  @objc(wifiRemoveall:withRejecter:)
  func wifiRemoveall(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
      guard let fula = self.fula else {
          reject("ERR_FULA", "Fula is not initialized", nil)
          return
      }
      do {
          let result = try fula.wifiRemoveall()
          let resultString = result.toUTF8String()!
          resolve(resultString)
      } catch let error {
          print("wifiRemoveall", error.localizedDescription)
          reject("ERR_FULA", "wifiRemoveall", error)
      }
  }

    @objc(fetchContainerLogs:withTailCount:withResolver:withRejecter:)
    func fetchContainerLogs(containerName: String, tailCount: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let fula = self.fula else {
            reject("ERR_FULA", "Fula is not initialized", nil)
            return
        }
        do {
            // Since fetchContainerLogs expects a String for tailCount, pass it directly
            let result = try fula.fetchContainerLogs(containerName, tailCount: tailCount)
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
        guard let fula = self.fula else {
            reject("ERR_FULA", "Fula is not initialized", nil)
            return
        }
        do {
            // Since fetchContainerLogs expects a String for tailCount, pass it directly
            let result = try fula.findBestAndTarget(inLogs: containerName, tailCount: tailCount)
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

@objc(getDockerImageBuildDates:withRejecter:)
func getDockerImageBuildDates(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let fula = self.fula else {
        reject("ERR_FULA", "Fula is not initialized", nil)
        return
    }
    do {
        let result = try fula.getDockerImageBuildDates()
        let resultString = String(decoding: result, as: UTF8.self)
        resolve(resultString)
    } catch let error {
        reject("ERR_FULA", "getDockerImageBuildDates: \(error.localizedDescription)", error)
    }
}

@objc(getClusterInfo:withRejecter:)
func getClusterInfo(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let fula = self.fula else {
        reject("ERR_FULA", "Fula is not initialized", nil)
        return
    }
    do {
        let result = try fula.getClusterInfo()
        let resultString = String(decoding: result, as: UTF8.self)
        resolve(resultString)
    } catch let error {
        reject("ERR_FULA", "getClusterInfo: \(error.localizedDescription)", error)
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
