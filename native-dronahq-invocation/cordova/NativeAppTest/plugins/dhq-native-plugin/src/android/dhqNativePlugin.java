package cordova.plugin.nativeconnectplugin;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import android.content.Context;
import android.content.Intent;

import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.net.Uri;

/**
 * This class echoes a string called from JavaScript.
 */
public class dhqNativePlugin extends CordovaPlugin {
  
  private Context context;
  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    this.context = cordova.getContext();
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    if (action.equals("openDHQApp")) {
      String schemeOfCurrentApp = args.getString(0);
      this.openNativeApp(schemeOfCurrentApp, callbackContext);
      return true;
    }
    return false;
  }

  private void openNativeApp(String schemeOfCurrentApp, CallbackContext callbackContext) {
    if (schemeOfCurrentApp == null
      || schemeOfCurrentApp.length()==0 ) {
      callbackContext.error("Expected non-empty string argument.");
    }  else {
      Intent intent = new Intent();
      intent.setAction(Intent.ACTION_VIEW);
      intent.addCategory(Intent.CATEGORY_DEFAULT);
      intent.addCategory(Intent.CATEGORY_BROWSABLE);
      //Pass your custom scheme, so that it can be invoked
      //by DronaHQ post user authentication
      String uri = "dhq://?scheme=" + schemeOfCurrentApp;
      intent.setData(Uri.parse(uri));
      context.startActivity(intent);
    }
  }
}