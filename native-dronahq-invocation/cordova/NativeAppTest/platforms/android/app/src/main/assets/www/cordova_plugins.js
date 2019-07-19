cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "dhq-native-plugin.dhqNativePlugin",
    "file": "plugins/dhq-native-plugin/www/dhqNativePlugin.js",
    "pluginId": "dhq-native-plugin",
    "clobbers": [
      "cordova.plugins.dhqNativePlugin"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "dhq-native-plugin": "0.0.1"
};
// BOTTOM OF METADATA
});