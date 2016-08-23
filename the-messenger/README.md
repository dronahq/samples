# Send notifications with DronaHQ Rest APIs

This sample app demonstrates how to use DronaHQ REST APIs to send push notifications to users.
Check our [documentation](http://docs.dronahq.com) to know more about DronaHQ.

## About the app

This app is simple application, which accepts text message which can be sent to users as push notification.
The sent message will appear in user's inbox in the container app. The app also uses 
`DronaHQ.notification.getNotification` method when user clicks on the notification in their inbox to 
retireve the JSON data which was sent along with the notification.

## Getting Started

The DronaHQ REST APIs require API Key in the request for authentication. Update the config.js and put your key in `API_KEY` property.

## Support

dev[at]dronahq[dot]com