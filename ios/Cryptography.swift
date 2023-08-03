import Foundation
import CommonCrypto
import CryptoSwift

public class Cryptography: NSObject {
    public static func encryptMsg(_ message: Array<UInt8>, _ secretKey: Array<UInt8>)
    throws -> String {
        let aes = try! AES(key: secretKey, blockMode: ECB(), padding: .pkcs5)
        let encrypted = try! aes.encrypt(message)
        return Data(encrypted).base64EncodedString()
    }
    
    public static func decryptMsg(_ cipherText: String, _ secretKey: Array<UInt8>)
    throws -> Array<UInt8> {
        let aes = try! AES(key: secretKey, blockMode: ECB(), padding: .pkcs5)
        let data =  cipherText.fromBase64()!
        return try! aes.decrypt(data.bytes)

    }
    
    public static func generateKey(_ salt: Data)
    throws -> Array<UInt8> {
        let password: [UInt8] = Array("".utf8)
        let salt: [UInt8] = salt.bytes

        //TODO: Generate a key from a salt and an empty password
        let key = try PKCS5.PBKDF2(
            password: password,
            salt: salt,
            iterations: 4096,
            keyLength: 16, /* AES-128 */
            variant: .sha2(SHA2.Variant.sha256)
        ).calculate()
        return key
    }
}
