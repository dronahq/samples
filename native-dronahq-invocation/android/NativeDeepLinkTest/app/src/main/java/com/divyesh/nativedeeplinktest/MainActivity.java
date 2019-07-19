package com.divyesh.nativedeeplinktest;

import android.content.Intent;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if(Intent.ACTION_VIEW.equals(getIntent().getAction()))
        {
            Uri uri = getIntent().getData();
            String dhqNonce = uri.getQueryParameter("nonce");
            String dhqUid = uri.getQueryParameter("uid");
            //Use uid & nonce to make HTTP call to DronaHQ users API

            TextView tv_uid = findViewById(R.id.tv_uid);
            TextView tv_nonce = findViewById(R.id.tv_nonce);

            tv_uid.setText(dhqUid);
            tv_nonce.setText(dhqNonce);
        }

        findViewById(R.id.btn_dronahq).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openDronaHQApp();
            }
        });
    }

    void openDronaHQApp() {
        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_VIEW);
        intent.addCategory(Intent.CATEGORY_DEFAULT);
        intent.addCategory(Intent.CATEGORY_BROWSABLE);
        //Pass your custom scheme, so that it can be invoked
        //by DronaHQ post user authentication
        intent.setData(Uri.parse("dhq://?scheme=nativetest"));
        startActivity(intent);
    }
}
