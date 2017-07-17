package com.example.kunal.demoapp;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Toast;

public class IntentActivity extends AppCompatActivity {

    @Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_intent);
    Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
    setSupportActionBar(toolbar);

    Intent intent = getIntent();
    if(Intent.ACTION_VIEW.equals(intent.getAction()))
    {
        Uri uri = intent.getData();
        if (data != null) {
        String dhqNonce = uri.getQueryParameter("nonce");
        String dhqUid = uri.getQueryParameter("uid");
        //Use uid & nonce to make HTTP call to DronaHQ users API
        } else {
            Toast.makeText(this, "No data received", Toast.LENGTH_SHORT).show();
        }
    }
}

}
