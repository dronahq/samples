# Offline Form Submission with DronaHQ Sync APIs

This sample app demonstrates how to use DronaHQ Sync methods to submit data while user is offline.
Check our [documentation](http://docs.dronahq.com) to know more about DronaHQ Sync.

## About the app

This app is single form application, which accepts user input & submits the data using `DronaHQ.sync.upload()` method.
The captured form data is submitted to server whenever the network connectivity is available. The backend of this app 
is a <a href="https://github.com/typicode/json-server">mock API server</a> hosted on heroku.  

Submitted data can be viewed at: <a href="http://mock-api.smurfpandey.me/contacts">http://mock-api.smurfpandey.me/contacts</a>.

## Note

Data submitted to mock API is publicly visible, so you should not submit actual data to this API. The submitted data is purged
everyday automatically.  

## Support

dev[at]dronahq[dot]com