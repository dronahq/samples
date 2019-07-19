//
//  AppDelegate+DHQNativePlugin.m
//
//  Created by Fenil Jain on 6.06.19.
//

#import "AppDelegate+DHQNativePlugin.h"
#import "dhqNativePlugin.h"

/**
 *  Plugin name in config.xml
 */
static NSString *const PLUGIN_NAME = @"dhqNativePlugin";


@implementation AppDelegate (DHQNativePlugin)

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *))restorationHandler {
    // ignore activities that are not for Universal Links
    if (![userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb] || userActivity.webpageURL == nil) {
        return NO;
    }
    
    // get instance of the plugin and let it handle the userActivity object
    dhqNativePlugin *plugin = [self.viewController getCommandInstance:PLUGIN_NAME];
    if (plugin == nil) {
        return NO;
    }
    
    NSURL *url = userActivity.webpageURL;
    return [plugin fnHandleUrlReceived:url];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    
    // get instance of the plugin and let it handle the userActivity object
    dhqNativePlugin *plugin = [self.viewController getCommandInstance:PLUGIN_NAME];
    if (plugin == nil) {
        return NO;
    }
    
    return [plugin fnHandleUrlReceived:url];
}

@end
