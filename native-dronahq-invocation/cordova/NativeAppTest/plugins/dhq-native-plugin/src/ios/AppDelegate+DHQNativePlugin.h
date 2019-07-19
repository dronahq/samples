//
//  AppDelegate+DHQNativePlugin.h
//
//  Created by Fenil Jain on 6.06.19.
//

#import "AppDelegate.h"

/**
 *  Category for the AppDelegate that overrides application:continueUserActivity:restorationHandler method, 
 *  so we could handle application launch when user clicks on the link in the browser.
 */
@interface AppDelegate (DHQNativePlugin)

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *))restorationHandler;

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options;

@end
