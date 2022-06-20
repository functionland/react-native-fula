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
import mobile.FileRef;

@ReactModule(name = FulaModule.NAME)
public class FulaModule extends ReactContextBaseJavaModule {
    public static final String NAME = "FulaModule";
    Fula fula;
    String appDir;
    String storeDirPath;

    public FulaModule(ReactApplicationContext reactContext) throws Exception{
        super(reactContext);
        appDir = reactContext.getFilesDir().toString();
        storeDirPath = appDir + "/fula/received/";
        File storeDir = new File(storeDirPath);
        boolean success = true;
        if (!storeDir.exists()) {
            success = storeDir.mkdirs();
        }
        if(success){
            Log.d(NAME,"Store folder created");
        }else{
            Log.d(NAME,"Can not create folder");
        }
        this.fula = Mobile.newFula();
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void send(String path, Promise promise) {
        try{
            String cid = fula.send(path);
            promise.resolve(cid);
        }
        catch(Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void encryptSend(String path, Promise promise) {
        try{
            String res = fula.encryptSend(path);
            Log.d(NAME,res);
            promise.resolve(res);
        }
        catch(Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void addBox(String boxId, Promise promise) {
        Log.d("fulaModule", appDir);
        try{
            fula.addBox(boxId);
            promise.resolve(true);
        }
        catch(Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void receiveFileInfo(String fileId, Promise promise){
        try{
            byte[] res = fula.receiveFileInfo(fileId);
            WritableNativeArray arr = new WritableNativeArray();
            for(byte b : res){
                arr.pushInt(b);
            }
            promise.resolve(arr);
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void receiveFile(String fileId, String fileName, boolean includeBS64,Promise promise) {
        try{
            String filePath = storeDirPath + fileName;
            fula.receiveFile(fileId, filePath);
            Uri uri = Uri.fromFile(new File(filePath));
            Log.d(NAME,"File Downloaded");
            WritableMap map;
            if(includeBS64){
                String bs64 = getBase64StringFromFile(filePath);
                Log.d(NAME,"File Transform to bs64");
                map = makeResponseMap(uri.toString(), bs64);
            }else{
                map = makeResponseMap(uri.toString(), "");
            }
            promise.resolve(map);
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void receiveDecryptFile(String fileRef, String fileName, boolean includeBS64,Promise promise) {
        try{
            String filePath = storeDirPath + fileName;
            fula.receiveDecryptFile(fileRef, filePath);
            Uri uri = Uri.fromFile(new File(filePath));
            Log.d(NAME,"File Downloaded");
            WritableMap map;
            if(includeBS64){
                String bs64 = getBase64StringFromFile(filePath);
                Log.d(NAME,"File Transform to bs64");
                map = makeResponseMap(uri.toString(), bs64);
            }else{
                map = makeResponseMap(uri.toString(), "");
            }
            promise.resolve(map);
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void graphQL(String query, String variableValues, Promise promise) {
        try{
            byte[] res = fula.graphQL(query, variableValues);
            WritableNativeArray arr = new WritableNativeArray();
            for(byte b : res){
                arr.pushInt(b);
            }
            promise.resolve(arr);
        }catch (Exception e){
            promise.reject(e);
        }
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
