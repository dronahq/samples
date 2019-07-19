//
//  AppDelegate.m
//  NativeAppTest
//
//  Created by Deltecs on 05/06/19.
//  Copyright © 2019 Deltecs. All rights reserved.
//

#import "AppDelegate.h"
#import "ViewController.h"

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    
    
    return YES;
}


- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
}


- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}


- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}


- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    [self fnHandleUrlReceived:url];
    
    return YES;
    
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    
    [self fnHandleUrlReceived:url];
    
    return YES;
    
}

-(BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler {
//    DLog(@"User Activity - %@", userActivity);
    if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb])
    {
        NSURL *url = userActivity.webpageURL;
        [self fnHandleUrlReceived:url];
        
    }
    return YES;
    
}

-(void) fnHandleUrlReceived:(NSURL *) url {
    
    NSString *strQuery = [url query];
    NSDictionary *dictQuery = [self parseQueryString:strQuery];
    NSString *strNonce = [dictQuery objectForKey:@"nonce"];
    NSString *strUid = [dictQuery objectForKey:@"uid"];
    //Use nonce & uid to make a http call to DronaHQ users API
    
    NSLog(@"Data received: uid=%@, nonce=%@", strUid, strNonce);
    
}

//Helper method for parsing query strings.
-(NSDictionary *)parseQueryString:(NSString *)query {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc]
                                 initWithCapacity:6];
    NSArray *pairs = [query componentsSeparatedByString:@"&"];
    for (NSString *pair in pairs) {
        NSArray *elements = [pair componentsSeparatedByString:@"="];
        NSString *key = [[elements objectAtIndex:0] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        
        NSString *val = [[elements objectAtIndex:1] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        [dict setObject:val forKey:key];
    }
    return dict;
}


@end
