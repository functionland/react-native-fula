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
