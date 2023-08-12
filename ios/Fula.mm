#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FulaModule, NSObject)

RCT_EXTERN_METHOD(checkConnection: (NSNumber *) timeout
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(newClient:(NSString *)IdentityString
                  withStorePath: (NSString *)storePath
                  withBloxAddr: (NSString *)bloxAddr
                  withExchange: (NSString *)exchange
                  withAutoFlush: (BOOL)autoFlash
                  withUseRelay: (BOOL)useRelay
                  withUseRefresh: (BOOL)refresh
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isReady:(BOOL)filesystemCheck
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(initFula:(NSString *)IdentityString
                  withStorePath: (NSString *)storePath
                  withBloxAddr: (NSString *)bloxAddr
                  withExchange: (NSString *)exchange
                  withAutoFlush: (BOOL)autoFlash
                  withRootConfig: (NSString *)rootConfig
                  withUseRelay: (BOOL)useRelay
                  withRefresh: (BOOL)refresh
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(logout:(NSString *)IdentityString
                  withStorePath: (NSString *)storePath
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(checkFailedActions:(BOOL)retry
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(mkdir:(NSString *)path
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(writeFile:(NSString *)fulaTargetFilename
                  withLocalFilename: (NSString *) localFilename
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(writeFileContent:(NSString *)path
                  withContentString:(NSString *) contentString
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(ls:(NSString *)path
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(rm:(NSString *)path
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(cp:(NSString *)sourcePath
                  withTargetPath:(NSString *) targetPath
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(mv:(NSString *)sourcePath
                  withTargetPath:(NSString *) targetPath
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(readFile:(NSString *)fulaTargetFilename
                  withLocalFilename:(NSString *) localFilename
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(readFileContent:(NSString *)path
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(get:(NSString *)keyString
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(has:(NSString *)keyString
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(push:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(put:(NSString *)valueString
                  withCodecString:(NSString *) codecString
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setAuth:(NSString *)peerIdString
                  withAllow:(BOOL) allow
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(shutdown:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createAccount:(NSString *)seedString
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(checkAccountExists:(NSString *)accountString
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createPool:(NSString *)seedString
                  withPoolName: (NSString *)poolName
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(listPools:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(joinPool:(NSString *)seedString
                  withPoolID: (NSNumber *)poolID
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(cancelPoolJoin:(NSString *)seedString
                  withPoolID: (NSNumber *)poolID
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(listPoolJoinRequests:(NSNumber *)poolID
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(votePoolJoinRequest:(NSString *)seedString
                  withPoolID: (NSNumber *)poolID
                  withAccountString: (NSString *) accountString
                  withAccept: (BOOL) accept
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(leavePool:(NSString *)seedString
                  withPoolID: (NSNumber *)poolID
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(newReplicationRequest:(NSString *)seedString
                  withPoolID: (NSNumber *)poolID
                  withReplicationFactor: (NSNumber *) replicationFactor
                  withCid: (NSNumber *) cid
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(newStoreRequest:(NSString *)seedString
                  withPoolID: (NSNumber *)poolID
                  withUploader: (NSString *) uploader
                  withCid: (NSNumber *) cid
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(listAvailableReplicationRequests:(NSNumber *)poolID
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeReplicationRequest:(NSString *)seedString
                  withPoolID: (NSNumber *)poolID
                  withCid: (NSString *) cid
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeStorer:(NSString *)seedString
                  withPoolID: (NSNumber *)poolID
                  withCid: (NSString *) cid
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeStoredReplication:(NSString *)seedString
                  withUploader: (NSString *) uploader
                  withPoolID: (NSNumber *)poolID
                  withCid: (NSString *) cid
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(bloxFreeSpace:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

@end
