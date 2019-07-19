# Overview
NativeAppTest is a sample App showcasing DronaHQ Native App SSO integration with any other cordova/ionic App.

# Changes
Please find below the list of changes done in this sample app

- Add plugin to your cordova application

```
    cordova plugin add dhq-native-plugin 
```

- Under Capabilities, Enable Associated Domains and add below 3 domains. (Required to launch Native App from DronaHQ App without user confirmation using Universal Links)

```
    applinks:s0.deeplink.dronahq.com
    applinks:s1.deeplink.dronahq.com
    applinks:s2.deeplink.dronahq.com
```

- Under Info.plist, Under URL Types add new URL scheme. (Add same URL scheme of your choice, make sure it is same as Android App. In this example 'nativetest' is added as URL scheme). This step is optional but this should match the scheme name you add it in DronaHQ console under Custom URL
- Open dhqNativePlugin.m file and replace SCHEME_NAME with your app's scheme name

# Console Configuraation
Below are the list of values to be added in DronaHQ console https://build.dronahq.com depending on the above configuration
- Custom URL = 'nativetest' (This is the Custom URL set by native App in info.plist file)
- Bundle ID = 'com.deltecs.NativeAppTest' (This is the Bundle ID of native App)
- App prefix = 'W44UVUWZ59' (This is the Team ID of your Apple developer Account)
- App store URL = '<Appstore URL>' (Your Application Appstore URL or OTA download link of your App)

# Open Items
- If mPin is enabled in DronaHQ App then MPin screen will be bypassed when Launched from Native App