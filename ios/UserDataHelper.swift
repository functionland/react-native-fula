import Foundation

public class UserDataHelper: NSObject {
    var defaults: UserDefaults
    
    init() {
        defaults = UserDefaults.standard
    }
    
    public func getValue(key: String) -> String {
        return defaults.string(forKey: key)
    }
    
    public func getBooleanValue(key: String) -> Bool {
        return defaults.bool(forKey: key)
    }
    
    public func  add(key: String, value: String) {
        defaults.set(value, forKey: key)
    }
    
    public func add( key: String, boolean value: Bool) {
        defaults.set(value, forKey: key)
    }
    
    public func remove(String key) {
        defaults.removeObject(forKey: key)
    }
}

// TODO: move these to an utils file.
extension String {   
    func trim() -> String {
        return self.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())
    }
}
extension Data {
    /// Fast convert to hex by reserving memory (instead of mapping and join).
    public func toHex(uppercase: Bool = false) -> String {
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
    public func toString() -> String {
        //TODO: make utf8

    }
}
