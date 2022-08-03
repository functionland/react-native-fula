#import <React/RCTLog.h>
#import "FulaModule.h"
#import <Mobile/Mobile.h>

@implementation FulaModule

RCT_EXPORT_MODULE()

- (id) init {
    self = [super init];
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    
     //Get the docs directory
    NSString *documentsDirectoryPath = [paths objectAtIndex:0];
    NSString *folderPath = [documentsDirectoryPath  stringByAppendingPathComponent:@"fula"];
    
    if (![[NSFileManager defaultManager] fileExistsAtPath:folderPath])
        [[NSFileManager defaultManager] createDirectoryAtPath:folderPath withIntermediateDirectories:true attributes:nil error:nil];
    
    fula = [[MobileFula alloc] init:folderPath];
    return self;
}

RCT_REMAP_METHOD(addBox,
                 addBox:(nonnull NSString*)boxAddr
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSError *error = nil;
    BOOL result= [fula addBox:boxAddr error:&error];
    if(error) {
      NSLog(@"addBox error: %@",error);
        reject(@"addBox_failure", @"error", error);
        return;
    }
    NSNumber *output = [NSNumber numberWithBool:result];
    resolve(output);
}

RCT_REMAP_METHOD(send,
                 send:(nonnull NSString*)filePath
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSError *error = nil;
    NSString *result= [fula send:filePath error:&error];
    
    if(error) {
      NSLog(@"send error: %@",error);
        reject(@"send_failure", @"error", error);
      return;
    }
    resolve(result);
}

RCT_REMAP_METHOD(encryptSend,
                 encryptSend:(nonnull NSString*)filePath
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSError *error = nil;
    NSString *result= [fula encryptSend:filePath error:&error];

    if(error) {
      NSLog(@"encryptSend error: %@",error);
        reject(@"encryptSend_failure", @"error", error);
      return;
    }
    resolve(result);
}
RCT_REMAP_METHOD(receiveFile,
                  receiveFile:(nonnull NSString*)fileId
                  withFileName:(nonnull NSString*)fileName
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSError *error = nil;
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    
     //Get the docs directory
    NSString *documentsDirectoryPath = [paths objectAtIndex:0];
    NSString *folderPath = [documentsDirectoryPath  stringByAppendingPathComponent:@"fula/received"];
    NSString *filePath= [folderPath  stringByAppendingPathComponent:fileName];
    
    if (![[NSFileManager defaultManager] fileExistsAtPath:folderPath])
        [[NSFileManager defaultManager] createDirectoryAtPath:folderPath withIntermediateDirectories:true attributes:nil error:nil];
    
    BOOL result= [fula receiveFile:fileId filePath:filePath  error:&error];

    if(error) {
      NSLog(@"receiveFile error: %@",error);
        reject(@"receiveFile_failure", @"error", error);
      return;
    }
    if(!result){
        resolve(nil);
    }
   
    resolve(filePath);
}

RCT_REMAP_METHOD(receiveFileInfo,
                 receiveFileInfo:(nonnull NSString*)fileId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSError *error = nil;
    NSString* result= [fula receiveFileInfo:fileId error:&error];

    if(error) {
      NSLog(@"receiveFileInfo error: %@",error);
        reject(@"receiveFileInfo_failure", @"error", error);
      return;
    }
    
    resolve(result);
}

RCT_REMAP_METHOD(receiveDecryptFile,
                 receiveDecryptFile:(nonnull NSString*)ref
                 withFileName:(nonnull NSString*)fileName
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSError *error = nil;
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    
     //Get the docs directory
    NSString *documentsDirectoryPath = [paths objectAtIndex:0];
    NSString *folderPath = [documentsDirectoryPath  stringByAppendingPathComponent:@"fula/received"];
    NSString *filePath= [folderPath  stringByAppendingPathComponent:fileName];
    
    if (![[NSFileManager defaultManager] fileExistsAtPath:folderPath])
        [[NSFileManager defaultManager] createDirectoryAtPath:folderPath withIntermediateDirectories:true attributes:nil error:nil];

    BOOL result= [fula receiveDecryptFile:ref filePath:filePath  error:&error];
    
    if(error) {
      NSLog(@"receiveDecryptFile error: %@",error);
        reject(@"receiveDecryptFile_failure", @"error", error);
      return;
    }
    if(!result){
        resolve(nil);
    }
    resolve(filePath);
}

@end
