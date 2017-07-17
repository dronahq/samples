//
//  ViewController.m
//  NativeAppSample
//
//  Created by Aradhana on 7/14/17.
//  Copyright © 2017 DeltecsDeltecs. All rights reserved.
//

#import "ViewController.h"
#import "AppDelegate.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    AppDelegate *appDelegate = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    NSString *strQuery =  appDelegate.strQuery;
    NSDictionary *dictQuery = [self parseQueryString:strQuery];
    self.lblUIDValue.text = [dictQuery objectForKey:@"nonce"];
    self.lblNonceValue.text = [dictQuery objectForKey:@"uid"];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)OpenDronaHQButtonClicked:(id)sender {
    NSURL *url = [[NSURL alloc] initWithString:@"dhq://?scheme=nativeApp"];
    BOOL canOpenApp = [[UIApplication sharedApplication] canOpenURL:url];
    if (canOpenApp) {
        [[UIApplication sharedApplication] openURL:url];
    } else {
        //DronaHQ app not installed
        //show user message
        [[[UIAlertView alloc] initWithTitle:@"" message:@"DronaHQ app not available" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show ];
    }
}

-(NSDictionary *)parseQueryString:(NSString *)query {
    //Helper method for parsing query strings. -(NSDictionary *)parseQueryString:(NSString *)query {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] initWithCapacity:6]; NSArray *pairs = [query componentsSeparatedByString:@"&"];
    for (NSString *pair in pairs) {
        NSArray *elements = [pair componentsSeparatedByString:@"="];
        NSString *key = [[elements objectAtIndex:0] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        NSString *val = [[elements objectAtIndex:1] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        [dict setObject:val forKey:key];
    }
    return dict;
}

@end




