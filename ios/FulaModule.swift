import Foundation
import CommonCrypto
import WnfsSwift
import Mobile


@objc(FulaModule)
class FulaModule: NSObject {
    
    var wnfsWrapper: WnfsWrapper
    override init() {
        wnfsWrapper = WnfsWrapper(putFn: mockFulaPut, getFn: mockFulaGet);
    }
    func convertConfigToJson(config: WnfsConfig) -> String {
        return String(format: "{\"cid\": \"%@\", \"private_ref\": \"%@\"}", config.getCid(), config.getPrivateRef())
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
