import Foundation
import CommonCrypto
import WnfsSwift
import Mobile


@objc(FulaModule)
class FulaModule: NSObject {
    public static let NAME: String = "FulaModule"
    var fula: Mobile.Fula

    var client: Client
    var fulaConfig: Mobile.Config
    var appDir: URL
    var fulaStorePath: String
    var privateForest: String
    var rootConfig: WnfsConfig
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
         return try internalClient.get(cid);
        } catch let error {
            print (error.localizedDescription)
        }
        print("ReactNative Error get");
        return nil
      }

      func put(data: Data?, codec: Int) -> Data? {
        do {
            print(String(format: "ReactNative put data: %s , codec: %d", data! as NSData, codec))
            return try internalClient.put(data, codec);
        } catch let error {
                print("ReactNative put Error");
                print (error.localizedDescription)
            }
        print("ReactNative Error put");
        return nil
      }
    }
    var wnfsWrapper: WnfsWrapper
    override init() {
        
        if let appDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
            fulaStoreURL = appDir.appendingPathComponent("/fula")
            
            let storePath = fulaStoreURL.path
            let fileManager = FileManager.default
            var success = true
            if !fileManager.fileExists(atPath: storePath) {
                do{
                    try fileManager.createDirectory(atPath: storePath, withIntermediateDirectories: true)
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
