//
//  ViewController.m
//  NativeAppTest
//
//  Created by Deltecs on 05/06/19.
//  Copyright © 2019 Deltecs. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}


- (IBAction)fnOpenDHQApp:(id)sender {
    
    NSString* strScheme = @"nativetest"; // Replace this with your app URL scheme
    
    NSString* strUrl = [NSString stringWithFormat:@"dhq://?scheme=%@" , strScheme];
    
    NSURL *url = [[NSURL alloc] initWithString:strUrl];
    BOOL canOpenApp = [[UIApplication sharedApplication] canOpenURL:url];
    if (canOpenApp) {
        [[UIApplication sharedApplication] openURL:url];
    } else {
        //DronaHQ app not installed
        //show user message
    }
}
@end
