import Foundation

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

    func toData() -> Data {
        return self.data(using: .utf8)!
    }
}

public extension Array<UInt8> {
    func toHex() -> String {
        return Data(self).toHex()
    }
    func toData() -> Data {
        return Data(self)
    }
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

    func toUTF8String() -> String? {
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
