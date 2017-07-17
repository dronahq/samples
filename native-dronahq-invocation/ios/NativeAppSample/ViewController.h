//
//  ViewController.h
//  NativeAppSample
//
//  Created by Aradhana on 7/14/17.
//  Copyright © 2017 DeltecsDeltecs. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController

@property (strong, nonatomic) IBOutlet UIButton *button;
@property (strong, nonatomic) IBOutlet UILabel *lblUID;
@property (strong, nonatomic) IBOutlet UILabel *lblUIDValue;
@property (strong, nonatomic) IBOutlet UILabel *lblNonce;
@property (strong, nonatomic) IBOutlet UILabel *lblNonceValue;

- (IBAction)OpenDronaHQButtonClicked:(id)sender;
@end

