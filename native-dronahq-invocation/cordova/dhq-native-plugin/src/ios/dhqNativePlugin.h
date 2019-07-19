/********* dhqNativePlugin.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>

@interface dhqNativePlugin : CDVPlugin
  // Member variables go here.

- (void)openDHQApp:(CDVInvokedUrlCommand*)command;

-(BOOL) fnHandleUrlReceived:(NSURL *) url;

@end
