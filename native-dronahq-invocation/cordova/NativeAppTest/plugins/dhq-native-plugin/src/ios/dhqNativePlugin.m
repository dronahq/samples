/********* dhqNativePlugin.m Cordova Plugin Implementation *******/

#import "dhqNativePlugin.h"

static NSString *const SCHEME_NAME = @"nativetest"; // Replace this with your app URL scheme

@implementation dhqNativePlugin {
    NSString* strGetUIDNonceCallbackId;
}

- (void)openDHQApp:(CDVInvokedUrlCommand*)command {
    
    BOOL canOpenApp = [self fnOpenDronaHQApp];
    
    CDVPluginResult* pluginResult = nil;
    
    if (canOpenApp) {
        strGetUIDNonceCallbackId = command.callbackId;
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

-(BOOL) fnOpenDronaHQApp {
    
    NSString* strUrl = [NSString stringWithFormat:@"dhq://?scheme=%@" , SCHEME_NAME];
    
    NSURL *url = [[NSURL alloc] initWithString:strUrl];
    BOOL canOpenApp = [[UIApplication sharedApplication] canOpenURL:url];
    if (canOpenApp) {
        [[UIApplication sharedApplication] openURL:url];
    } else {
        //DronaHQ app not installed
        //show user message
    }
    return canOpenApp;
}

-(BOOL) fnHandleUrlReceived:(NSURL *) url {
    
    BOOL isSuccess = NO;
    
    NSString *strQuery = [url query];
    NSDictionary *dictQuery = [self parseQueryString:strQuery];
    NSString *strNonce = [dictQuery objectForKey:@"nonce"];
    NSString *strUid = [dictQuery objectForKey:@"uid"];
    //Use nonce & uid to make a http call to DronaHQ users API
    
    NSLog(@"Data received: uid=%@, nonce=%@", strUid, strNonce);
    
    if(strUid != nil && strUid.length > 0 && strNonce != nil && strNonce.length > 0) {
        isSuccess = YES;
        
        if(strGetUIDNonceCallbackId != nil) {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"Data received: uid=%@, nonce=%@", strUid, strNonce]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:strGetUIDNonceCallbackId];
            strGetUIDNonceCallbackId = nil;
        }
        
    }
    
    return isSuccess;
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
