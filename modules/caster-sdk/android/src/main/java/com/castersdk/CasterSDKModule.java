package com.castersdk;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import androidx.annotation.NonNull;

// Import CasterSDK Client class
// Uncomment after adding castar.jar to libs folder
import com.castar.sdk.Client;
import com.castar.sdk.StatusListener;

public class CasterSDKModule extends ReactContextBaseJavaModule {
    private static final String TAG = "CasterSDKModule";
    private final ReactApplicationContext reactContext;

    public CasterSDKModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "CasterSDKModule";
    }

    /**
     * Initialize and start CasterSDK with Client ID
     * @param clientId Your CasterSDK Client ID from https://center.castarsdk.com
     * @param promise Promise to resolve/reject
     */
    @ReactMethod
    public void startClient(String clientId, Promise promise) {
        try {
            Client.Start(reactContext, clientId);
            
            Log.d(TAG, "CasterSDK started with Client ID: " + clientId);
            promise.resolve("CasterSDK started successfully");
        } catch (Exception e) {
            Log.e(TAG, "Failed to start CasterSDK", e);
            promise.reject("CASTER_SDK_ERROR", "Failed to start CasterSDK: " + e.getMessage());
        }
    }

    /**
     * Stop CasterSDK service
     * @param promise Promise to resolve/reject
     */
    @ReactMethod
    public void stopClient(Promise promise) {
        try {
            Client.Stop();
            
            Log.d(TAG, "CasterSDK stopped");
            promise.resolve("CasterSDK stopped successfully");
        } catch (Exception e) {
            Log.e(TAG, "Failed to stop CasterSDK", e);
            promise.reject("CASTER_SDK_ERROR", "Failed to stop CasterSDK: " + e.getMessage());
        }
    }

    /**
     * Set status listener for CasterSDK connection status
     * @param promise Promise to resolve/reject
     */
    @ReactMethod
    public void setStatusListener(Promise promise) {
        try {
            Client.setListener(new StatusListener() {
                @Override
                public void onClientStatusConnectChanged(String status) {
                    // Send event to React Native
                    WritableMap params = Arguments.createMap();
                    params.putString("status", status);
                    
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("CasterSDKStatusChanged", params);
                    
                    Log.d(TAG, "CasterSDK status changed: " + status);
                }
            });
            
            Log.d(TAG, "CasterSDK status listener set");
            promise.resolve("Status listener set successfully");
        } catch (Exception e) {
            Log.e(TAG, "Failed to set status listener", e);
            promise.reject("CASTER_SDK_ERROR", "Failed to set status listener: " + e.getMessage());
        }
    }
}
