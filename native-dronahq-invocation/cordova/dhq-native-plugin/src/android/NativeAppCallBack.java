package org.apache.cordova.dhqnativeplugin;
import android.content.Intent;
import android.net.Uri;

public class NativeAppCallBack {

  private String dhqNonce="";
  private String dhqUid="";

  public void authenticateCallBack(Intent intent) {
    if(intent!=null) {
      if(Intent.ACTION_VIEW.equals(intent.getAction()))
      {
        Uri uri = intent.getData();
        dhqNonce = uri.getQueryParameter("nonce");
        dhqUid = uri.getQueryParameter("uid");
        //Use uid & nonce to make HTTP call to DronaHQ users API
      }
    }
  }

  public String getDhqNounce() {
    return dhqNonce;
  }

  public String getDhqUid() {
    return dhqUid;
  }

}