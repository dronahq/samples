package com.nativedeeplinktest;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;



public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "NativeDeeplinkTest";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if(Intent.ACTION_VIEW.equals(getIntent().getAction()))
        {
            Uri uri = getIntent().getData();
            String dhqNonce = uri.getQueryParameter("nonce");
            String dhqUid = uri.getQueryParameter("uid");
            //Use uid & nonce to make HTTP call to DronaHQ users API

            //TextView tv_uid = findViewById(R.id.tv_uid);
            //TextView tv_nonce = findViewById(R.id.tv_nonce);

            //tv_nonce.setText(dhqNonce);
            //tv_uid.setText(dhqUid);

           // Toast.makeText(this, dhqNonce+"", Toast.LENGTH_SHORT).show();
        }
    }
}
