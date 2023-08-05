import Foundation

public class UserDataHelper: NSObject {
    var defaults: UserDefaults
    
    override init() {
        defaults = UserDefaults.standard
    }
    
    public func getValue(_ key: String) -> String? {
        return defaults.string(forKey: key)
    }
    
    public func getBooleanValue(_ key: String) -> Bool? {
        return defaults.bool(forKey: key)
    }
    
    public func  add(_ key: String, _ value: String) {
        defaults.set(value, forKey: key)
    }
    
    public func add(_ key: String, _ value: Bool) {
        defaults.set(value, forKey: key)
    }
    
    public func remove(_ key: String) {
        defaults.removeObject(forKey: key)
    }
}

public extension String {
    func trim() -> String {
        return self.trimmingCharacters(in: NSCharacterSet.whitespaces)
    }
    func fromBase64() -> Data? {
        return Data(base64Encoded: self)
    }

    func toUint8Array() -> Array<UInt8> {
        return Array(self.utf8)
    }
}

public extension Array<UInt8> {
    func toString() -> String {
        return Data(self).toString()
    }
    func toData() -> Data {
        return Data(self)
    }
}

public func toData(ptr: UnsafePointer<UInt8>?, size: Int) -> Data? {
    // This will clone input c bytes to a swift Data class.
    let buffer = UnsafeBufferPointer(start: ptr, count: size)
    return Data(buffer: buffer)
}

public extension Data {
    /// Fast convert to hex by reserving memory (instead of mapping and join).
    func toHex(uppercase: Bool = false) -> String {
        // Constants (Hex has 2 characters for each Byte).
        let size = self.count * 2;
        let degitToCharMap = Array((
            uppercase ? "0123456789ABCDEF" : "0123456789abcdef"
        ).utf16);
        // Reserve dynamic memory (plus one for null termination).
        let buffer = UnsafeMutablePointer<unichar>.allocate(capacity: size + 1);
        // Convert each byte.
        var index = 0
        for byte in self {
            buffer[index] = degitToCharMap[Int(byte / 16)];
            index += 1;
            buffer[index] = degitToCharMap[Int(byte % 16)];
            index += 1;
        }
        // Set Null termination.
        buffer[index] = 0;
        // Casts to string (without any copying).
        return String(utf16CodeUnitsNoCopy: buffer,
                      count: size, freeWhenDone: true)
    }
    func toString() -> String {
        return String(data: self, encoding: .utf8)
    }

    func toUint8Array() -> Array<UInt8> {
        return Array(self)
    }

    func fromBase64() -> Data? {
        // Finally, decode.
        return Data(base64Encoded: self)
    }
}
