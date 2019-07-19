var exec = require('cordova/exec');

exports.openDHQApp = function (arg0, success, error) {
    exec(success, error, 'dhqNativePlugin', 'openDHQApp', [arg0]);
};