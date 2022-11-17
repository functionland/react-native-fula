package land.fx.fula;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.io.File;

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

  @ReactMethod
  public void init(ConfigRef config, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      try{
        Config config_ext = new Config();
        String storePath = config.storePath;
        if(storePath != null && !storePath.trim().isEmpty()) {
          config_ext.setStorePath(fulaStorePath);
        }

        byte[] identity = config.identity;
        if (identity != null) {
          config_ext.setIdentity(identity);
        }
        this.fula = Fulamobile.newClient(config_ext);
        promise.resolve(true);
      }
      catch(Exception e){
        promise.reject(e);
        Log.d("init",e.getMessage());
      }
    });
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
    public void put(byte[] key, byte[] value, Promise promise) {
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

}
