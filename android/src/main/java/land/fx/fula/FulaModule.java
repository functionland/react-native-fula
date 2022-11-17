package land.fx.fula;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.io.File;
import java.nio.charset.StandardCharsets;

import fulamobile.Client;
import fulamobile.Fulamobile;
import fulamobile.Config;


@ReactModule(name = FulaModule.NAME)
public class FulaModule extends ReactContextBaseJavaModule {
    public static final String NAME = "FulaModule";
    Client fula;
    String appDir;
    String fulaStorePath;

    public FulaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        appDir = reactContext.getFilesDir().toString();
        fulaStorePath = appDir + "/fula";
        File storeDir = new File(fulaStorePath);
        boolean success = true;
        if (!storeDir.exists()) {
            success = storeDir.mkdirs();
        }
        if(success){
            Log.d(NAME,"Fula store folder created");
        }else{
            Log.d(NAME,"Unable to create fula store folder!");
        }
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    private byte[] toByte(String input) {
      return input.getBytes(StandardCharsets.UTF_8);
    }

  @ReactMethod
  public void initJNI(String identityString, String storePath, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      try{
        Log.d("initJNI",storePath);
        byte[] identity = toByte(identityString);
        init(identity, storePath);
        promise.resolve(true);
      }
      catch(Exception e){
        promise.reject(e);
        Log.d("init",e.getMessage());
      }
    });
  }

  public Client init(byte[] identity, String storePath) {
      try{
        Config config_ext = new Config();
        if(storePath != null && !storePath.trim().isEmpty()) {
          config_ext.setStorePath(fulaStorePath);
        }

        if (identity != null) {
          config_ext.setIdentity(identity);
        }
        this.fula = Fulamobile.newClient(config_ext);
        return this.fula;
      }
      catch(Exception e){
        Log.d("init",e.getMessage());
      }
      return null;
  }

    @ReactMethod
    public void getJNI(String keyString, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        try{
          byte[] key = toByte(keyString);
          byte[] value = get(key);
          promise.resolve(value);
        }
        catch(Exception e){
          promise.reject(e);
          Log.d("get",e.getMessage());
        }
      });
    }

    public byte[] get(byte[] key) {
            try{
              byte[] value = fula.get(key);
              return value;
            }
            catch(Exception e){
              Log.d("get",e.getMessage());
            }
      return null;
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
    public void putJNI(String keyString, String valueString, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        try{
          byte[] key = toByte(keyString);
          byte[] value = toByte(valueString);
          put(key, value);
          promise.resolve(true);
        }catch (Exception e){
          promise.reject(e);
          Log.d("put",e.getMessage());
        }
      });
    }

    public byte[] put(byte[] key, byte[] value) {
          try{
            fula.put(key, value);
            return key;
          }catch (Exception e){
            Log.d("put",e.getMessage());
          }
          return null;
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

}
