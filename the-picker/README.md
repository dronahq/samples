# Image Picker

This sample app demonstrates how to use corodva's camera plugin to capture image from Camera or Gallery. This app also uses file-transfer plugin to upload the chosen image to Cloudinary. Check our [documentation](http://docs.dronahq.com (http://docs.dronahq.com/)) to know more about camera & file-transfer plugins.

## Gettng Started

You need a cloudinary account for this sample app. 

1. Sign up for an account at cloudinary.com
2. Enable unsigned uploading for your Cloudinary account from the Upload Settings page. Enabling unsigned uploading also creates an upload preset with a unique name, which explicitly allows uploading of images without authentication.
3. Edit the config.js
    1. Update the API_URL with your cloud name.
    2. Set UPLOAD_PRESET value to the preset generated in previous step.

## Support

dev[at]dronahq[dot]com