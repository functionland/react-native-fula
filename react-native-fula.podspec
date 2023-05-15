require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-fula"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/functionland/react-native-fula.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"
  s.dependency "React-Core"
  s.dependency 'Mobile','~> 0.0.3'
  s.dependency "WnfsSwift",  "0.1.6"
  s.dependency 'CryptoSwift', '~> 1.7.1'
end
