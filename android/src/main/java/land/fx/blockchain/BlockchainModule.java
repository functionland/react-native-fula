package land.fx.blockchain;

import fulamobile.Fulamobile;
import land.fx.fula.FulaModule;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;

import org.jetbrains.annotations.Contract;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;

@ReactModule(name = BlockchainModule.NAME)
public class BlockchainModule extends ReactContextBaseJavaModule {

    @Override
    public void initialize() {
      System.loadLibrary("gojni");
    }

    public static final String NAME = "BlockchainModule";
    fulamobile.Client fula;

    public BlockchainModule(ReactApplicationContext reactContext) {
      super(reactContext);
      FulaModule fulaModule = new FulaModule(getReactApplicationContext());
      fula = fulaModule.getFulaClient();
    }

    @Override
    @NonNull
    public java.lang.String getName() {
      return NAME;
    }

    private byte[] toByte(@NonNull String input) {
      return input.getBytes(StandardCharsets.UTF_8);
    }

    @NonNull
    @Contract("_ -> new")
    private String toString(byte[] input) {
      return new String(input, StandardCharsets.UTF_8);
    }

    @ReactMethod
    public void createAccount(String seedString, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "createAccount: seedString = " + seedString);
        try {
          if (this.fula == null || this.fula.id() == null || this.fula.id().isEmpty()) {
            promise.reject(new Error("Fula client is not initialized"));
          } else {

            if (!seedString.startsWith("/")) {
              promise.reject(new Error("seed should start with /"));
            }
            byte[] result = this.fula.seeded(seedString);
            String resultString = toString(result);
            promise.resolve(resultString);
          }
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void checkAccountExists(String accountString, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "checkAccountExists: accountString = " + accountString);
        try {
          byte[] result = this.fula.accountExists(accountString);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void createPool(String seedString, String poolName, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "createPool: seedString = " + seedString + "; poolName = " + poolName);
        try {
          byte[] result = this.fula.poolCreate(seedString, poolName);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void listPools(Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "listPools");
        try {
          byte[] result = this.fula.poolList();
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void joinPool(String seedString, long poolID, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "joinPool: seedString = " + seedString + "; poolID = " + poolID);
        try {
          byte[] result = this.fula.poolJoin(seedString, poolID);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void cancelPoolJoin(String seedString, long poolID, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "cancelPoolJoin: seedString = " + seedString + "; poolID = " + poolID);
        try {
          byte[] result = this.fula.poolCancelJoin(seedString, poolID);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void listPoolJoinRequests(long poolID, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "listPoolJoinRequests: poolID = " + poolID);
        try {
          byte[] result = this.fula.poolRequests(poolID);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void votePoolJoinRequest(String seedString, long poolID, String accountString, boolean accept, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "votePoolJoinRequest: seedString = " + seedString + "; poolID = " + poolID + "; accountString = " + accountString + "; accept = " + accept);
        try {
          byte[] result = this.fula.poolVote(seedString, poolID, accountString, accept);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void leavePool(String seedString, long poolID, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "leavePool: seedString = " + seedString + "; poolID = " + poolID);
        try {
          byte[] result = this.fula.poolLeave(seedString, poolID);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void newReplicationRequest(String seedString, long poolID, long replicationFactor, String cid, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "newReplicationRequest: seedString = " + seedString + "; poolID = " + poolID + "; replicationFactor = " + replicationFactor + "; cid = " + cid);
        try {
          byte[] result = this.fula.manifestUpload(seedString, poolID, replicationFactor, cid);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void newStoreRequest(String seedString, long poolID, String uploader, String cid, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "newStoreRequest: seedString = " + seedString + "; poolID = " + poolID + "; uploader = " + uploader + "; cid = " + cid);
        try {
          byte[] result = this.fula.manifestStore(seedString, poolID, uploader, cid);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void listAvailableReplicationRequests(long poolID, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "listAvailableReplicationRequests: poolID = " + poolID);
        try {
          byte[] result = this.fula.manifestAvailable(poolID);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void removeReplicationRequest(String seedString, long poolID, String cid, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "newReplicationRequest: seedString = " + seedString + "; poolID = " + poolID + "; cid = " + cid);
        try {
          byte[] result = this.fula.manifestRemove(seedString, poolID,  cid);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void removeStorer(String seedString, String storage, long poolID, String cid, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "removeStorer: seedString = " + seedString + "; storage = " + storage + "; poolID = " + poolID + "; cid = " + cid);
        try {
          byte[] result = this.fula.manifestRemoveStorer(seedString, storage, poolID, cid);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

    @ReactMethod
    public void removeStoredReplication(String seedString, String uploader, long poolID, String cid, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
        Log.d("ReactNative", "removeStoredReplication: seedString = " + seedString + "; uploader = " + uploader + "; poolID = " + poolID + "; cid = " + cid);
        try {
          byte[] result = this.fula.manifestRemoveStored(seedString, uploader, poolID, cid);
          String resultString = toString(result);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("get", e.getMessage());
          promise.reject(e);
        }
      });
    }

}
