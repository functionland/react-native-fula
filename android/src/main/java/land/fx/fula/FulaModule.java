package land.fx.fula;

import android.util.Log;

import androidx.annotation.NonNull;

import android.os.Handler;
import android.os.Looper;


import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.modules.core.DeviceEventManagerModule;


import org.jetbrains.annotations.Contract;

import java.io.File;
import java.nio.charset.StandardCharsets;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.Future;
import java.util.concurrent.TimeoutException;

import fulamobile.Config;
import fulamobile.Fulamobile;

@ReactModule(name = FulaModule.NAME)
public class FulaModule extends ReactContextBaseJavaModule {


  @Override
  public void initialize() {
    System.loadLibrary("gojni");
  }


  public static final String NAME = "FulaModule";
  private final ReactApplicationContext reactContext;
  fulamobile.Client fula;

  Config fulaConfig;

  String appName;
  String appDir;
  String fulaStorePath;

  public FulaModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    appName = reactContext.getPackageName();
    appDir = reactContext.getFilesDir().toString();
    fulaStorePath = appDir + "/fula";
    File storeDir = new File(fulaStorePath);
    boolean success = true;
    if (!storeDir.exists()) {
      success = storeDir.mkdirs();
    }
    if (success) {
      Log.d("ReactNative", "Fula store folder created for " + appName + " at " + fulaStorePath);
    } else {
      Log.d("ReactNative", "Unable to create fula store folder for " + appName + " at " + fulaStorePath);
    }
  }

  @Override
  @NonNull
  public java.lang.String getName() {
    return NAME;
  }


  private byte[] toByte(@NonNull String input) {
    return input.getBytes(StandardCharsets.UTF_8);
  }

  private byte[] decToByte(@NonNull String input) {
    String[] parts = input.split(",");
    byte[] output = new byte[parts.length];
    for (int i = 0; i < parts.length; i++) {
      output[i] = Byte.parseByte(parts[i]);
    }
    return output;
  }

  @NonNull
  @Contract("_ -> new")
  public String toString(byte[] input) {
    return new String(input, StandardCharsets.UTF_8);
  }

  @NonNull
  private static int[] stringArrToIntArr(@NonNull String[] s) {
    int[] result = new int[s.length];
    for (int i = 0; i < s.length; i++) {
      result[i] = Integer.parseInt(s[i]);
    }
    return result;
  }

  @NonNull
  @Contract(pure = true)
  private static byte[] convertIntToByte(@NonNull int[] input) {
    byte[] result = new byte[input.length];
    for (int i = 0; i < input.length; i++) {
      byte b = (byte) input[i];
      result[i] = b;
    }
    return result;
  }

  @NonNull
  private byte[] convertStringToByte(@NonNull String data) {
    String[] keyInt_S = data.split(",");
    int[] keyInt = stringArrToIntArr(keyInt_S);

    return convertIntToByte(keyInt);
  }

  @ReactMethod
  public void registerLifecycleListener(Promise promise) {
      getReactApplicationContext().addLifecycleEventListener(new LifecycleEventListener() {
          @Override
          public void onHostResume() {
              // App is in the foreground
          }

          @Override
          public void onHostPause() {
              // App is in the background
          }

          @Override
          public void onHostDestroy() {
              // Attempt to shut down Fula cleanly
              try {
                  Log.e("ReactNative", "shutting down Fula onHostDestroy");
                  shutdownInternal();
              } catch (Exception e) {
                  Log.e("ReactNative", "Error shutting down Fula", e);
              }
          }
      });
      promise.resolve(true);
  }

  @ReactMethod
  public void checkConnection(int timeout, Promise promise) {
    Log.d("ReactNative", "checkConnection started");
    ThreadUtils.runOnExecutor(() -> {
      if (this.fula != null) {
        try {
          boolean connectionStatus = this.checkConnectionInternal(timeout);
          Log.d("ReactNative", "checkConnection ended " + connectionStatus);
          promise.resolve(connectionStatus);
        }
        catch (Exception e) {
          Log.d("ReactNative", "checkConnection failed with Error: " + e.getMessage());
          promise.resolve(false);
        }
      } else {
        Log.d("ReactNative", "checkConnection failed with Error: " + "fula is null");
        promise.resolve(false);
      }
    });
  }

  @ReactMethod
  public void ping(int timeout, Promise promise) {
    Log.d("ReactNative", "ping started");
    ThreadUtils.runOnExecutor(() -> {
      if (this.fula != null) {
        try {
          byte[] result = this.fula.ping();
          String resultString = new String(result, java.nio.charset.StandardCharsets.UTF_8);
          Log.d("ReactNative", "ping result: " + resultString);
          promise.resolve(resultString);
        } catch (Exception e) {
          Log.d("ReactNative", "ping failed with Error: " + e.getMessage());
          promise.reject("ERR_PING", e.getMessage(), e);
        }
      } else {
        Log.d("ReactNative", "ping failed: fula is null");
        promise.reject("ERR_FULA", "Fula is not initialized");
      }
    });
  }

  @ReactMethod
  public void newClient(String identityString, String storePath, String bloxAddr, String exchange, boolean autoFlush, boolean useRelay, boolean refresh, Promise promise) {
    Log.d("ReactNative", "newClient started");
    ThreadUtils.runOnExecutor(() -> {
      try {
        Log.d("ReactNative", "newClient storePath= " + storePath + " bloxAddr= " + bloxAddr + " exchange= " + exchange + " autoFlush= " + autoFlush + " useRelay= " + useRelay + " refresh= " + refresh);
        byte[] identity = toByte(identityString);
        Log.d("ReactNative", "newClient identity= " + identityString);
        this.newClientInternal(identity, storePath, bloxAddr, exchange, autoFlush, useRelay, refresh);
        //String objString = Arrays.toString(obj);
        String peerId = this.fula.id();
        Log.d("ReactNative", "newClient peerId= " + peerId);
        promise.resolve(peerId);
      } catch (Exception e) {
        Log.d("ReactNative", "newClient failed with Error: " + e.getMessage());
        promise.reject("Error", e.getMessage());
      }
    });
  }

  @ReactMethod
  public void isReady(boolean filesystemCheck, Promise promise) {
    Log.d("ReactNative", "isReady started");
    ThreadUtils.runOnExecutor(() -> {
      try {
        boolean initialized = this.fula != null && this.fula.id() != null;
        promise.resolve(initialized);
      } catch (Exception e) {
        Log.d("ReactNative", "isReady failed with Error: " + e.getMessage());
        promise.reject("Error", e.getMessage());
      }
    });
  }

  @ReactMethod
  public void initFula(String identityString, String storePath, String bloxAddr, String exchange, boolean autoFlush, String rootConfig, boolean useRelay, boolean refresh, Promise promise) {
    Log.d("ReactNative", "init started");
    ThreadUtils.runOnExecutor(() -> {
      try {
        WritableMap resultData = new WritableNativeMap();
        Log.d("ReactNative", "init storePath= " + storePath);
        byte[] identity = toByte(identityString);
        Log.d("ReactNative", "init identity= " + identityString);
        String[] obj = this.initInternal(identity, storePath, bloxAddr, exchange, autoFlush, rootConfig, useRelay, refresh);
        Log.d("ReactNative", "init object created: [ " + obj[0] + ", " + obj[1] + " ]");
        resultData.putString("peerId", obj[0]);
        resultData.putString("rootCid", obj[1]);
        promise.resolve(resultData);
      } catch (Exception e) {
        Log.d("ReactNative", "init failed with Error: " + e.getMessage());
        promise.reject("Error", e.getMessage());
      }
    });
  }

  @ReactMethod
  public void logout(String identityString, String storePath, Promise promise) {
    Log.d("ReactNative", "logout started");
    ThreadUtils.runOnExecutor(() -> {
      try {
        byte[] identity = toByte(identityString);
        boolean obj = this.logoutInternal(identity, storePath);
        Log.d("ReactNative", "logout completed");
        promise.resolve(obj);
      } catch (Exception e) {
        Log.d("ReactNative", "logout failed with Error: " + e.getMessage());
        promise.reject("Error", e.getMessage());
      }
    });
  }

  private boolean checkConnectionInternal(int timeout) throws Exception {
    try {
      Log.d("ReactNative", "checkConnectionInternal started");
      if (this.fula != null) {
        try {
          Log.d("ReactNative", "connectToBlox started");

          AtomicBoolean connectionStatus = new AtomicBoolean(false);
          ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
          Future<?> future = executor.submit(() -> {
            try {
              this.fula.connectToBlox();
              connectionStatus.set(true);
              Log.d("ReactNative", "checkConnectionInternal succeeded ");
            } catch (Exception e) {
              Log.d("ReactNative", "checkConnectionInternal failed with Error: " + e.getMessage());
            }
          });

          try {
            future.get(timeout, TimeUnit.SECONDS);
          } catch (TimeoutException te) {
            // If the timeout occurs, shut down the executor and return false
            executor.shutdownNow();
            return false;
          } finally {
            // If the future task is done, we can shut down the executor
            if (future.isDone()) {
              executor.shutdown();
            }
          }

          return connectionStatus.get();
        } catch (Exception e) {
          Log.d("ReactNative", "checkConnectionInternal failed with Error: " + e.getMessage());
          return false;
        }
      } else {
        Log.d("ReactNative", "checkConnectionInternal failed because fula is not initialized ");
        return false;
      }
    } catch (Exception e) {
      Log.d("ReactNative", "checkConnectionInternal failed with Error: " + e.getMessage());
      throw (e);
    }
  }

  @NonNull
  private byte[] createPeerIdentity(byte[] identity) throws Exception {
    return Fulamobile.generateEd25519KeyFromString(toString(identity));
  }

  private boolean logoutInternal(byte[] identity, String storePath) throws Exception {
    try {
      shutdownInternal();
      return true;
    } catch (Exception e) {
      Log.d("ReactNative", "logout internal failed with Error: " + e.getMessage());
      throw (e);
    }
  }

  public fulamobile.Client getFulaClient() {
    return this.fula;
  }

  @NonNull
  private byte[] newClientInternal(byte[] identity, String storePath, String bloxAddr, String exchange, boolean autoFlush, boolean useRelay, boolean refresh) throws Exception {
    byte[] peerIdentity = null;
    try {
      fulaConfig = new Config();
      if (storePath == null || storePath.trim().isEmpty()) {
        fulaConfig.setStorePath(this.fulaStorePath);
      } else {
        fulaConfig.setStorePath(storePath);
      }
      Log.d("ReactNative", "newClientInternal storePath is set: " + fulaConfig.getStorePath());

      peerIdentity = this.createPeerIdentity(identity);
      fulaConfig.setIdentity(peerIdentity);
      Log.d("ReactNative", "peerIdentity is set: " + toString(fulaConfig.getIdentity()));
      fulaConfig.setBloxAddr(bloxAddr);
      Log.d("ReactNative", "bloxAddr is set: " + fulaConfig.getBloxAddr());
      fulaConfig.setExchange(exchange);
      fulaConfig.setSyncWrites(autoFlush);
      if (useRelay) {
        fulaConfig.setAllowTransientConnection(true);
        fulaConfig.setForceReachabilityPrivate(true);
      }
      if (this.fula == null || refresh) {
        Log.d("ReactNative", "Creating a new Fula instance");
        try {
          shutdownInternal();
          Log.d("ReactNative", "Creating a new Fula instance with config");
          this.fula = Fulamobile.newClient(fulaConfig);
          if (this.fula != null) {
            this.fula.flush();
          }
        } catch (Exception e) {
          Log.d("ReactNative", "Failed to create new Fula instance: " + e.getMessage());
          throw new Exception("Failed to create new Fula instance", e);
        }
      }
    } catch (Exception e) {
      Log.d("ReactNative", "newclientInternal failed with Error: " + e.getMessage());
      throw (e);
    }
    return peerIdentity;
  }


  @NonNull
  private String[] initInternal(byte[] identity, String storePath, String bloxAddr, String exchange, boolean autoFlush, String rootCid, boolean useRelay, boolean refresh) throws Exception {
    try {
      if (this.fula == null || refresh) {
        this.newClientInternal(identity, storePath, bloxAddr, exchange, autoFlush, useRelay, refresh);
      }
      String peerId = this.fula.id();
      Log.d("ReactNative", "fula initialized: " + peerId);
      String[] obj = new String[2];
      obj[0] = peerId;
      obj[1] = "";
      Log.d("ReactNative", "initInternal is completed successfully");
      if (this.fula != null) {
        this.fula.flush();
      }
      return obj;
    } catch (Exception e) {
      Log.d("ReactNative", "init internal failed with Error: " + e.getMessage());
      throw (e);
    }
  }

  private void shutdownInternal() throws Exception {
    try {
      if(this.fula != null) {
        this.fula.shutdown();
        this.fula = null;
        Log.d("ReactNative", "shutdownInternal done");
      }
    } catch (Exception e) {
      Log.d("ReactNative", "shutdownInternal error: "+ e.getMessage());
    }
  }

  @ReactMethod
  public void shutdown(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      try {
        shutdownInternal();
        promise.resolve(true);
      } catch (Exception e) {
        promise.reject(e);
        Log.d("ReactNative", "shutdown"+ e.getMessage());
      }
    });
  }

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //////////////////////ANYTHING BELOW IS FOR BLOCKCHAIN/////
  ///////////////////////////////////////////////////////////
  @ReactMethod
  public void getAccount(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "getAccount called ");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.getAccount();
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void accountFund(String accountString, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "accountFund: accountString = " + accountString);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.accountFund(accountString);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void assetsBalance(String account, String assetId, String classId, Promise promise) {
    long assetIdLong = Long.parseLong(assetId);
    long classIdLong = Long.parseLong(classId);
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "assetsBalance called ");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.assetsBalance(account, assetIdLong, classIdLong);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void transferToFula(String amount, String wallet, String chain, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "transferToFula called ");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.transferToFula(amount, wallet, chain);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void checkAccountExists(String accountString, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "checkAccountExists: accountString = " + accountString);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.accountExists(accountString);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void listPools(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "listPools");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.poolList();
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void joinPool(String poolID, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      long poolIdLong = Long.parseLong(poolID);
      Log.d("ReactNative", "joinPool: poolID = " + poolIdLong);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.poolJoin(poolIdLong);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void cancelPoolJoin(String poolID, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      long poolIdLong = Long.parseLong(poolID);
      Log.d("ReactNative", "cancelPoolJoin: poolID = " + poolIdLong);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.poolCancelJoin(poolIdLong);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void listPoolJoinRequests(String poolIDStr, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "listPoolJoinRequests: poolID = " + poolIDStr);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        long poolID = Long.parseLong(poolIDStr);
        byte[] result = this.fula.poolRequests(poolID);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void leavePool(String poolID, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      long poolIdLong = Long.parseLong(poolID);
      Log.d("ReactNative", "leavePool: poolID = " + poolIdLong);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.poolLeave(poolIdLong);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void joinPoolWithChain(String poolID, String chainName, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "joinPoolWithChain: poolID = " + poolID + ", chainName = " + chainName);
      try {
        // Validate inputs
        if (poolID == null || poolID.trim().isEmpty()) {
          promise.reject("INVALID_POOL_ID", "Pool ID cannot be null or empty");
          return;
        }
        if (chainName == null || chainName.trim().isEmpty()) {
          promise.reject("INVALID_CHAIN_NAME", "Chain name cannot be null or empty");
          return;
        }
        if (this.fula == null) {
          promise.reject("FULA_NOT_INITIALIZED", "Fula client is not initialized");
          return;
        }

        long poolIdLong = Long.parseLong(poolID);
        byte[] result = this.fula.poolJoinWithChain(poolIdLong, chainName);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (NumberFormatException e) {
        Log.d("ReactNative", "ERROR: Invalid poolID format: " + e.getMessage());
        promise.reject("INVALID_POOL_ID_FORMAT", "Pool ID must be a valid number: " + poolID, e);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject("JOIN_POOL_WITH_CHAIN_ERROR", "Failed to join pool with chain: " + e.getMessage(), e);
      }
    });
  }

  @ReactMethod
  public void leavePoolWithChain(String poolID, String chainName, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "leavePoolWithChain: poolID = " + poolID + ", chainName = " + chainName);
      try {
        // Validate inputs
        if (poolID == null || poolID.trim().isEmpty()) {
          promise.reject("INVALID_POOL_ID", "Pool ID cannot be null or empty");
          return;
        }
        if (chainName == null || chainName.trim().isEmpty()) {
          promise.reject("INVALID_CHAIN_NAME", "Chain name cannot be null or empty");
          return;
        }
        if (this.fula == null) {
          promise.reject("FULA_NOT_INITIALIZED", "Fula client is not initialized");
          return;
        }

        long poolIdLong = Long.parseLong(poolID);
        byte[] result = this.fula.poolLeaveWithChain(poolIdLong, chainName);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (NumberFormatException e) {
        Log.d("ReactNative", "ERROR: Invalid poolID format: " + e.getMessage());
        promise.reject("INVALID_POOL_ID_FORMAT", "Pool ID must be a valid number: " + poolID, e);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject("LEAVE_POOL_WITH_CHAIN_ERROR", "Failed to leave pool with chain: " + e.getMessage(), e);
      }
    });
  }

  @ReactMethod
  public void listAvailableReplicationRequests(String poolIDStr, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "listAvailableReplicationRequests: poolID = " + poolIDStr);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        long poolID = Long.parseLong(poolIDStr);
        byte[] result = this.fula.manifestAvailable(poolID);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void batchUploadManifest(ReadableArray cidArray, String poolIDStr, String replicationFactorStr, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      try {
        long poolID = Long.parseLong(poolIDStr);
        long replicationFactor = Long.parseLong(replicationFactorStr);
        if (this.fula != null) {
          StringBuilder cidStrBuilder = new StringBuilder();
          for (int i = 0; i < cidArray.size(); i++) {
            if (i > 0) {
              cidStrBuilder.append("|");
            }
            cidStrBuilder.append(cidArray.getString(i));
          }

          byte[] cidsBytes = cidStrBuilder.toString().getBytes(StandardCharsets.UTF_8);
          this.fula.batchUploadManifest(cidsBytes, poolID, replicationFactor);
          promise.resolve(true); // Indicate success
        } else {
          throw new Exception("BatchUploadManifest: Fula is not initialized");
        }
      } catch (Exception e) {
        Log.d("ReactNative", "BatchUploadManifest failed with Error: " + e.getMessage());
        promise.reject("Error", e.getMessage());
      }
    });
  }

  @ReactMethod
  public void replicateInPool(ReadableArray cidArray, String account, String poolIDStr, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      try {
        long poolID = Long.parseLong(poolIDStr);
        if (this.fula != null) {
          StringBuilder cidStrBuilder = new StringBuilder();
          for (int i = 0; i < cidArray.size(); i++) {
            if (i > 0) {
              cidStrBuilder.append("|");
            }
            cidStrBuilder.append(cidArray.getString(i));
          }

          byte[] cidsBytes = cidStrBuilder.toString().getBytes(StandardCharsets.UTF_8);
          byte[] res = this.fula.replicateInPool(cidsBytes, account, poolID);
          String receivedJsonString = new String(res, StandardCharsets.UTF_8);
          promise.resolve(receivedJsonString); // Indicate success
        } else {
          throw new Exception("replicateInPool: Fula is not initialized");
        }
      } catch (Exception e) {
        Log.d("ReactNative", "replicateInPool failed with Error: " + e.getMessage());
        promise.reject("Error", e.getMessage());
      }
    });
  }

  ////////////////////////////////////////////////////////////////
  ///////////////// Blox Hardware Methods ////////////////////////
  ////////////////////////////////////////////////////////////////

  @ReactMethod
  public void bloxFreeSpace(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "bloxFreeSpace");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.bloxFreeSpace();
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void wifiRemoveall(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "wifiRemoveall");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.wifiRemoveall();
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void fetchContainerLogs(String containerName, String tailCount, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "fetchContainerLogs");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.fetchContainerLogs(containerName, tailCount);
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "an error happened="+e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void findBestAndTargetInLogs(String containerName, String tailCount, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "findBestAndTargetInLogs");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.findBestAndTargetInLogs(containerName, tailCount);
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "an error happened="+e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void getFolderSize(String folderPath, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "getFolderSize");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.getFolderSize(folderPath);
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "an error happened="+e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void getDatastoreSize(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "getDatastoreSize");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.getDatastoreSize();
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "an error happened="+e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void getDockerImageBuildDates(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "getDockerImageBuildDates");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.getDockerImageBuildDates();
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "an error happened="+e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void getClusterInfo(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "getClusterInfo");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.getClusterInfo();
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "an error happened="+e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void reboot(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "reboot");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.reboot();
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void partition(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "partition");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.partition();
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void eraseBlData(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "eraseBlData");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.eraseBlData();
        String resultString = toString(result);
        Log.d("ReactNative", "result string="+resultString);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  // Plugin Methods
  @ReactMethod
  public void listPlugins(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "listPlugins");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.listPlugins();
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void listActivePlugins(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "listActivePlugins");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.listActivePlugins();
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void installPlugin(String pluginName, String params, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "installPlugin: pluginName = " + pluginName + ", params = " + params);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.installPlugin(pluginName, params);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void uninstallPlugin(String pluginName, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "uninstallPlugin: pluginName = " + pluginName);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.uninstallPlugin(pluginName);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void showPluginStatus(String pluginName, int lines, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "showPluginStatus: pluginName = " + pluginName + ", lines = " + lines);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.showPluginStatus(pluginName, lines);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void getInstallOutput(String pluginName, String params, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "getInstallOutput: pluginName = " + pluginName + ", params = " + params);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.getInstallOutput(pluginName, params);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void getInstallStatus(String pluginName, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "getInstallStatus: pluginName = " + pluginName);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.getInstallStatus(pluginName);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void updatePlugin(String pluginName, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "updatePlugin: pluginName = " + pluginName);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.updatePlugin(pluginName);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  // AI
  @ReactMethod
  public void chatWithAI(String aiModel, String userMessage, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
          Log.d("ReactNative", "chatWithAI: aiModel = " + aiModel + ", userMessage = " + userMessage);
          try {
              if (this.fula == null) {
                  promise.reject("ERR_FULA", "Fula is not initialized");
                  return;
              }
              // Call the Go Mobile method, which returns a byte[]
              byte[] streamIDBytes = this.fula.chatWithAI(aiModel, userMessage);

              // Convert byte[] to String (assuming UTF-8 encoding)
              String streamID = new String(streamIDBytes, "UTF-8");

              // Resolve the promise with the stream ID
              promise.resolve(streamID);
          } catch (Exception e) {
              Log.d("ReactNative", "ERROR in chatWithAI: " + e.getMessage());
              promise.reject(e); // Reject the promise with the error
          }
      });
  }

  @ReactMethod
  public void getChatChunk(String streamID, Promise promise) {
      ThreadUtils.runOnExecutor(() -> {
          Log.d("ReactNative", "getChatChunk: streamID = " + streamID);
          try {
              if (this.fula == null) {
                  promise.reject("ERR_FULA", "Fula is not initialized");
                  return;
              }
              // Call the Go Mobile method, which returns a String
              String chunk = this.fula.getChatChunk(streamID);

              // Handle null or empty response
              if (chunk == null || chunk.isEmpty()) {
                  Log.d("ReactNative", "getChatChunk: No data received for streamID = " + streamID);
                  promise.resolve(""); // Resolve with an empty string
                  return;
              }

              // Resolve the promise with the chunk of data
              Log.d("ReactNative", "getChatChunk: Successfully received chunk for streamID = " + streamID);
              promise.resolve(chunk);
          } catch (Exception e) {
              // Log and reject the promise with the error
              Log.d("ReactNative", "ERROR in getChatChunk: " + e.getMessage());
              promise.reject(e);
          }
      });
  }

  @ReactMethod
public void streamChunks(String streamID, Promise promise) {
    if (streamID == null || streamID.trim().isEmpty()) {
        promise.reject("INVALID_ARGUMENT", "streamID cannot be null or empty");
        return;
    }

    ThreadUtils.runOnExecutor(() -> {
        try {
            if (this.fula == null) {
                promise.reject("ERR_FULA", "Fula is not initialized");
                return;
            }
            fulamobile.StreamIterator iterator = this.fula.getStreamIterator(streamID);

            if (iterator == null) {
                promise.reject("STREAM_ITERATOR_ERROR", "Failed to create StreamIterator");
                return;
            }

            // Start listening for chunks
            new Handler(Looper.getMainLooper()).post(() ->
                pollIterator(iterator, promise)
            );
        } catch (Exception e) {
            promise.reject("STREAM_ERROR", e.getMessage(), e);
        }
    });
}

private void pollIterator(fulamobile.StreamIterator iterator, Promise promise) {
  try {
      String chunk = iterator.next();
      if (chunk != null && !chunk.trim().isEmpty()) {
          emitEvent("onChunkReceived", chunk);
      }

      if (iterator.isComplete()) {
          emitEvent("onStreamingCompleted", null);
          promise.resolve(null);
      } else {
          new Handler(Looper.getMainLooper()).postDelayed(() ->
              pollIterator(iterator, promise)
          , 50); // Reduced delay for better responsiveness
      }
  } catch (Exception e) {
      if (e.getMessage() != null && e.getMessage().contains("EOF")) {
          emitEvent("onStreamingCompleted", null);
          promise.resolve(null);
      } else if (e.getMessage() != null && e.getMessage().contains("timeout")) {
          // Retry on timeout
          new Handler(Looper.getMainLooper()).post(() ->
              pollIterator(iterator, promise)
          );
      } else {
          emitEvent("onStreamError", e.getMessage());
          promise.reject("STREAM_ERROR", e.getMessage(), e);
      }
  }
}

  // Auto-pin
  @ReactMethod
  public void autoPinPair(String token, String endpoint, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "autoPinPair: token = " + token + ", endpoint = " + endpoint);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.autoPinPair(token, endpoint);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void autoPinRefresh(String token, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "autoPinRefresh: token = " + token);
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.autoPinRefresh(token);
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void autoPinUnpair(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "autoPinUnpair");
      try {
        if (this.fula == null) {
          promise.reject("ERR_FULA", "Fula is not initialized");
          return;
        }
        byte[] result = this.fula.autoPinUnpair();
        String resultString = toString(result);
        promise.resolve(resultString);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  private void emitEvent(String eventName, String data) {
      try {
          getReactApplicationContext()
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit(eventName, data);
      } catch (Exception e) {
          Log.e("ReactNative", "Error emitting event: " + eventName, e);
      }
  }


}
