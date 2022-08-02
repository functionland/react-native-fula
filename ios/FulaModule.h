#import <React/RCTBridgeModule.h>
#import <Mobile/Mobile.h>

@interface FulaModule : NSObject <RCTBridgeModule> {
    MobileFula *fula;
}

- (MobileFula *) fula;

@end
