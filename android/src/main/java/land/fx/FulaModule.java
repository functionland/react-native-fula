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
    String fulaRepo;

    public FulaModule(ReactApplicationContext reactContext) throws Exception{
        super(reactContext);
        appDir = reactContext.getFilesDir().toString();
        storeDirPath = appDir + "/fula/received/";
        fulaRepo = appDir + "/fula";
        File storeDir = new File(storeDirPath);
        boolean success = true;
        if (!storeDir.exists()) {
            success = storeDir.mkdirs();
        }
        if(success){
            Log.d(NAME,"Fula store folder created");
        }else{
            Log.d(NAME,"Unable to create fula store folder!");
        }
        this.fula = Mobile.newFula(fulaRepo);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void send(String path, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
            try{
              String cid = fula.send(path);
              promise.resolve(cid);
            }
            catch(Exception e){
              promise.reject(e);
              Log.d("send",e.getMessage());
            }
        });
    }

    @ReactMethod
    public void encryptSend(String path, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
          try{
            String res = fula.encryptSend(path);
            promise.resolve(res);
          }
          catch(Exception e){
            promise.reject(e);
            Log.d("encryptSend",e.getMessage());
          }
       });
    }

    @ReactMethod
    public void addBox(String boxId, Promise promise) {
        ThreadUtils.runOnExecutor(() -> {
          try{
            fula.addBox(boxId);
            promise.resolve(true);
          }
          catch(Exception e){
            promise.reject(e);
            Log.d("addBox",e.getMessage());
          }
      });
    }

    @ReactMethod
    public void receiveFileInfo(String fileId, Promise promise){
        ThreadUtils.runOnExecutor(() -> {
          try{
            String result = fula.receiveFileInfo(fileId);
            promise.resolve(result);
          }catch (Exception e){
            promise.reject(e);
            Log.d("receiveFileInfo",e.getMessage());
          }
        });
    }

    @ReactMethod
    public void receiveFile(String fileId, String fileName, Promise promise) {
       ThreadUtils.runOnExecutor(() -> {
          try{
            String filePath = storeDirPath + fileName;
            fula.receiveFile(fileId, filePath);
            promise.resolve(filePath);
          }catch (Exception e){
            promise.reject(e);
            Log.d("receiveFile",e.getMessage());
          }
       });
    }

    @ReactMethod
    public void receiveDecryptFile(String fileRef, String fileName,Promise promise) {
        ThreadUtils.runOnExecutor(() -> {
          try{
            String filePath = storeDirPath + fileName;
            fula.receiveDecryptFile(fileRef, filePath);
            promise.resolve(filePath);
          }catch (Exception e){
            promise.reject(e);
            Log.d("receiveDecryptFile",e.getMessage());
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
