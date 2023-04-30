#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FulaModule, NSObject)

RCT_EXTERN_METHOD(createPrivateForest:(String)dbPath
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createRootDir:(String)dbPath
                 withCid:(String)cid
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(writeFile:(String)dbPath
                 withCid: (String)cid
                 withPrivateRef: (String)privateRef
                 withPath: (String)path
                 withLocalFilePath: (String)localFilePath
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(readFile:(String)dbPath
                 withCid: (String)cid
                 withPrivateRef: (String)privateRef
                 withPath: (String)path
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(ls:(String)dbPath
                 withCid: (String)cid
                 withPrivateRef: (String)privateRef
                 withPath: (String)path
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)


+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
