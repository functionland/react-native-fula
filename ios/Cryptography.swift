import Foundation
import CryptoSwift
import os.log

public class Cryptography {
    // AES/GCM Encryption with IV handling
    public static func encryptMsg(_ message: [UInt8], _ secretKey: [UInt8], _ providedIv: [UInt8]? = nil) throws -> String {
        var iv = providedIv ?? [UInt8](repeating: 0, count: 12) // Default IV value
        if iv.isEmpty {
            iv = AES.randomIV(12) // Generate a random IV if not provided or if empty
        }
        
        let gcm = GCM(iv: iv, mode: .combined)
        let aes = try AES(key: secretKey, blockMode: gcm, padding: .noPadding)
        
        let encrypted = try aes.encrypt(message)
        let encryptedDataWithIv = Data(iv + encrypted) // Prepend IV to the encrypted data
        return encryptedDataWithIv.base64EncodedString()
    }
    
    // AES/GCM Decryption with IV extracted from the beginning of the cipherText
    public static func decryptMsg(_ cipherText: String, _ secretKey: [UInt8]) throws -> [UInt8] {
        guard let encryptedDataWithIv = Data(base64Encoded: cipherText) else {
            throw NSError(domain: "DecryptionError", code: -1, userInfo: nil)
        }
        let iv = Array(encryptedDataWithIv.prefix(12)) // Extract IV (first 12 bytes)
        let encryptedData = Array(encryptedDataWithIv.dropFirst(12)) // The rest is the encrypted data
        
        let gcm = GCM(iv: iv, mode: .combined)
        let aes = try AES(key: secretKey, blockMode: gcm, padding: .noPadding)
        
        let decrypted = try aes.decrypt(encryptedData)
        return decrypted
    }
    
    // Key Generation matching Java's logic
    public static func generateKey(_ identity: Data) throws -> Data {
        // Transform identity to base64 string to mimic Java's behavior
        let passwordString = identity.base64EncodedString()
        let passwordData = Array(passwordString.utf8) // Convert to byte array
        
        // Use identity itself as salt for simplicity to mimic Java behavior
        let salt = Array(identity)
        
        do {
            let key = try PKCS5.PBKDF2(
                password: passwordData,
                salt: salt,
                iterations: 1000, // Adjust the iteration count as needed
                keyLength: 16, // AES-128
                variant: .sha256
            ).calculate()
            
            return Data(key)
        } catch {
            throw error // Propagate error
        }
    }
}
