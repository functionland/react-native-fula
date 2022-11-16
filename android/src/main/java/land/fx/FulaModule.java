package land.fx.fula;

import android.net.Uri;
import android.util.Log;
import android.util.Base64;

import androidx.annotation.NonNull;
import android.net.Uri;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;


import java.io.File;
import java.util.Map;
import java.util.HashMap;
import java.io.FileInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import mobile.Fula;
import mobile.Mobile;
import mobile.ConfigRef;

@ReactModule(name = FulaModule.NAME)
public class FulaModule extends ReactContextBaseJavaModule {
    public static final String NAME = "FulaModule";
    Fula fula;

    public FulaModule(ConfigRef configRef) throws Exception{
        super(configRef);
        this.fula = Mobile.newClient(configRef);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void get(byte[] key, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
            try{
              byte[] value = fula.get(key);
              promise.resolve(value);
            }
            catch(Exception e){
              promise.reject(e);
              Log.d("get",e.getMessage());
            }
        });
    }

    @ReactMethod
    public void has(byte[] key, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
          try{
            boolean res = fula.has(key);
            promise.resolve(res);
          }
          catch(Exception e){
            promise.reject(e);
            Log.d("has",e.getMessage());
          }
       });
    }

    @ReactMethod
    public void pull(String addr, byte[] key, Promise promise) {
        ThreadUtils.runOnExecutor(() -> {
          try{
            fula.pull(addr, key);
            promise.resolve(true);
          }
          catch(Exception e){
            promise.reject(e);
            Log.d("pull",e.getMessage());
          }
      });
    }

    @ReactMethod
    public void push(String addr, byte[] key, Promise promise){
        ThreadUtils.runOnExecutor(() -> {
          try{
            fula.push(addr, key);
            promise.resolve(true);
          }catch (Exception e){
            promise.reject(e);
            Log.d("push",e.getMessage());
          }
        });
    }

    @ReactMethod
    public void put(String key, byte[] value, Promise promise) {
       ThreadUtils.runOnExecutor(() -> {
          try{
            fula.put(key, value);
            promise.resolve(true);
          }catch (Exception e){
            promise.reject(e);
            Log.d("put",e.getMessage());
          }
       });
    }

    @ReactMethod
    public void shutdown(Promise promise) {
        ThreadUtils.runOnExecutor(() -> {
          try{
            fula.shutdown();
            promise.resolve(true);
          }catch (Exception e){
            promise.reject(e);
            Log.d("shutdown",e.getMessage());
          }
          });

    }

    private static WritableMap makeResponseMap(String uri, String base64) {
         final WritableMap map = new WritableNativeMap();
         map.putString("uri", uri);
         map.putString("base64", base64);
         return map;
    }

    private static WritableMap makeResponseMap(String uri) {
         final WritableMap map = new WritableNativeMap();
         map.putString("uri", uri);
         return map;
    }

    private String getBase64StringFromFile(String absoluteFilePath) {
        InputStream inputStream;

        try {
            inputStream = new FileInputStream(new File(absoluteFilePath));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return null;
        }

        byte[] bytes;
        byte[] buffer = new byte[8192];
        int bytesRead;
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        try {
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        bytes = output.toByteArray();
        return Base64.encodeToString(bytes, Base64.NO_WRAP);
    }

}
