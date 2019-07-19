cordova.define("dhq-native-plugin.dhqNativePlugin", function(require, exports, module) {
var exec = require('cordova/exec');

exports.openDHQApp = function (arg0, success, error) {
    exec(success, error, 'dhqNativePlugin', 'openDHQApp', [arg0]);
};
});
