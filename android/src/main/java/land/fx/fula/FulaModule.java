package land.fx.fula;

import android.util.Log;

import androidx.annotation.NonNull;

import android.os.Handler;
import android.os.Looper;


import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;
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


import org.apache.commons.io.FileUtils;
import org.jetbrains.annotations.Contract;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.ArrayList;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.Future;
import java.util.concurrent.TimeoutException;

import fulamobile.Config;
import fulamobile.Fulamobile;

import land.fx.wnfslib.Fs;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@ReactModule(name = FulaModule.NAME)
public class FulaModule extends ReactContextBaseJavaModule {


  @Override
  public void initialize() {
    System.loadLibrary("wnfslib");
    System.loadLibrary("gojni");
  }


  public static final String NAME = "FulaModule";
  private final ReactApplicationContext reactContext;
  fulamobile.Client fula;

  Client client;
  Config fulaConfig;

  String appName;
  String appDir;
  String fulaStorePath;
  land.fx.wnfslib.Config rootConfig;
  SharedPreferenceHelper sharedPref;
  SecretKey secretKeyGlobal;
  String identityEncryptedGlobal;
  static String PRIVATE_KEY_STORE_PEERID = "PRIVATE_KEY";

  public static class Client implements land.fx.wnfslib.Datastore {

    private final fulamobile.Client internalClient;

    Client(fulamobile.Client clientInput) {
      this.internalClient = clientInput;
    }

    @NonNull
    @Override
    public byte[] get(@NonNull byte[] cid) {
      try {
        Log.d("ReactNative", Arrays.toString(cid));
        return this.internalClient.get(cid);
      } catch (Exception e) {
        e.printStackTrace();
      }
      Log.d("ReactNative","Error get");
      return cid;
    }

    @NonNull
    @Override
    public byte[] put(@NonNull byte[] cid, byte[] data) {
      try {
        long codec = (long)cid[1] & 0xFF;
        byte[] put_cid = this.internalClient.put(data, codec);
        //Log.d("ReactNative", "data="+ Arrays.toString(data) +" ;codec="+codec);
        return put_cid;
      } catch (Exception e) {
        Log.d("ReactNative", "put Error="+e.getMessage());
        e.printStackTrace();
      }
      Log.d("ReactNative","Error put");
      return data;
    }
  }

  public FulaModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    appName = reactContext.getPackageName();
    appDir = reactContext.getFilesDir().toString();
    fulaStorePath = appDir + "/fula";
    File storeDir = new File(fulaStorePath);
    sharedPref = SharedPreferenceHelper.getInstance(reactContext.getApplicationContext());
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
  public void deleteDsLock() {
    String lockFilePath = fulaConfig.getStorePath() + "/LOCK";
    Path lockFile = Paths.get(lockFilePath);
    try {
        if (Files.exists(lockFile)) {
            Files.delete(lockFile);
            Log.d("ReactNative", "Lock file deleted successfully.");
        } else {
            Log.d("ReactNative", "Lock file does not exist.");
        }
    } catch (Exception e) {
        Log.d("ReactNative", "Failed to delete lock file: " + e.getMessage());
    }
  }

  @ReactMethod
  public void isReady(boolean filesystemCheck, Promise promise) {
    Log.d("ReactNative", "isReady started");
    ThreadUtils.runOnExecutor(() -> {
      boolean initialized = false;
      try {
        if (this.fula != null && this.fula.id() != null) {
          if (filesystemCheck) {
            if (this.client != null && this.rootConfig != null && !this.rootConfig.getCid().isEmpty()) {
              initialized = true;
              Log.d("ReactNative", "isReady is true with filesystem check");
            }
          } else {
            Log.d("ReactNative", "isReady is true without filesystem check");
            initialized = true;
          }
        }
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

  @ReactMethod
  public void checkFailedActions(boolean retry, int timeout, Promise promise) throws Exception {
    try {
      if (this.fula != null) {
        if (!retry) {
          Log.d("ReactNative", "checkFailedActions without retry");
          fulamobile.LinkIterator failedLinks = this.fula.listFailedPushes();
          if (failedLinks.hasNext()) {
            Log.d("ReactNative", "checkFailedActions found: "+Arrays.toString(failedLinks.next()));
            promise.resolve(true);
          } else {
            promise.resolve(false);
          }
        } else {
          Log.d("ReactNative", "checkFailedActions with retry");
          boolean retryResults = this.retryFailedActionsInternal(timeout);
          promise.resolve(!retryResults);
        }
      } else {
        throw new Exception("Fula is not initialized");
      }
    } catch (Exception e) {
      Log.d("ReactNative", "checkFailedActions failed with Error: " + e.getMessage());
      throw (e);
    }
  }

  @ReactMethod
  private void listFailedActions(ReadableArray cids, Promise promise) throws Exception {
    try {
      if (this.fula != null) {
        Log.d("ReactNative", "listFailedActions");
        fulamobile.StringIterator failedLinks = this.fula.listFailedPushesAsString();
        ArrayList<String> failedLinksList = new ArrayList<>();
        while (failedLinks.hasNext()) {
          failedLinksList.add(failedLinks.next());
        }
        if (cids.size() > 0) {
          // If cids array is provided, filter the failedLinksList
          ArrayList<String> cidsList = new ArrayList<>();
          for (int i = 0; i < cids.size(); i++) {
            cidsList.add(cids.getString(i));
          }
          cidsList.retainAll(failedLinksList); // Keep only the elements in both cidsList and failedLinksList
          if (!cidsList.isEmpty()) {
            // If there are any matching cids, return them
            WritableArray cidsArray = Arguments.createArray();
            for (String cid : cidsList) {
              cidsArray.pushString(cid);
            }
            promise.resolve(cidsArray);
          } else {
            // If there are no matching cids, return false
            promise.resolve(false);
          }
        } else if (!failedLinksList.isEmpty()) {
          // If cids array is not provided, return the whole list
          Log.d("ReactNative", "listFailedActions found: "+ failedLinksList);
          WritableArray failedLinksArray = Arguments.createArray();
          for (String link : failedLinksList) {
            failedLinksArray.pushString(link);
          }
          promise.resolve(failedLinksArray);
        } else {
          promise.resolve(false);
        }
      } else {
        throw new Exception("listFailedActions: Fula is not initialized");
      }
    } catch (Exception e) {
      Log.d("ReactNative", "listFailedActions failed with Error: " + e.getMessage());
      throw (e);
    }
  }




  private boolean retryFailedActionsInternal(int timeout) throws Exception {
    try {
      Log.d("ReactNative", "retryFailedActionsInternal started");
      if (this.fula != null) {
        //Fula is initialized
        try {
          boolean connectionCheck = this.checkConnectionInternal(timeout);
          if(connectionCheck) {
            try {
              Log.d("ReactNative", "retryFailedPushes started");
              this.fula.retryFailedPushes();
              Log.d("ReactNative", "flush started");
              this.fula.flush();
              return true;
            }
            catch (Exception e) {
              this.fula.flush();
              Log.d("ReactNative", "retryFailedActionsInternal failed with Error: " + e.getMessage());
              return false;
            }
            //Blox online
            /*fulamobile.LinkIterator failedLinks = this.fula.listFailedPushes();
            if (failedLinks.hasNext()) {
              Log.d("ReactNative", "Failed links");
              //Failed list is not empty. iterate in the list
              while (failedLinks.hasNext()) {
                //Get the missing key
                byte[] failedNode = failedLinks.next();
                try {
                  //Push to Blox
                  Log.d("ReactNative", "Pushing Failed links "+Arrays.toString(failedNode));
                  this.pushInternal(failedNode);
                  Log.d("ReactNative", "Failed links pushed");
                }
                catch (Exception e) {
                  Log.d("ReactNative", "retryFailedActionsInternal failed with Error: " + e.getMessage());
                }
              }
              //check if list is empty now and all are pushed
              Log.d("ReactNative", "Pushing finished");
              fulamobile.LinkIterator failedLinks_after = this.fula.listFailedPushes();
              if(failedLinks_after.hasNext()) {
                //Some pushes failed
                byte[] first_failed = failedLinks_after.next();
                Log.d("ReactNative", "Failed links are not empty "+Arrays.toString(first_failed));
                return false;
              } else {
                //All pushes successful
                return true;
              }
            } else {
              Log.d("ReactNative", "No Failed links");
              //Failed list is empty
              return true;
            }*/
          } else {
            Log.d("ReactNative", "retryFailedActionsInternal failed because blox is offline");
            //Blox Offline
            return false;
          }
        }
        catch (Exception e) {
          Log.d("ReactNative", "retryFailedActionsInternal failed with Error: " + e.getMessage());
          return false;
        }
      } else {
        Log.d("ReactNative", "retryFailedActionsInternal failed because fula is not initialized");
        //Fula is not initialized
        return false;
      }
    } catch (Exception e) {
      Log.d("ReactNative", "retryFailedActionsInternal failed with Error: " + e.getMessage());
      throw (e);
    }
  }

  @NonNull
  private byte[] createPeerIdentity(byte[] identity) throws GeneralSecurityException, IOException {
    try {
      // 1: First: create public key from provided private key
      // 2: Should read the local keychain store (if it is key-value, key is public key above,
      // 3: if found, decrypt using the private key
      // 4: If not found or decryption not successful, generate an identity
      // 5: then encrypt and store in keychain
      byte[] libp2pId;
      String encryptedLibp2pId = sharedPref.getValue(PRIVATE_KEY_STORE_PEERID);
      byte[] encryptionPair;
      SecretKey encryptionSecretKey;
      try {
        encryptionSecretKey = Cryptography.generateKey(identity);
        Log.d("ReactNative", "encryptionSecretKey generated from privateKey");
      } catch (Exception e) {
        Log.d("ReactNative", "Failed to generate key for encryption: " + e.getMessage());
        throw new GeneralSecurityException("Failed to generate key encryption", e);
      }

      if (encryptedLibp2pId == null || !encryptedLibp2pId.startsWith("FULA_" +
        "ENC_V4:")) {
        Log.d("ReactNative", "encryptedLibp2pId is not correct or empty. creating new one " + encryptedLibp2pId);
        encryptedLibp2pId = createEncryptedLibp2pId(identity, encryptionSecretKey);
      } else {
        Log.d("ReactNative", "encryptedLibp2pId is correct. decrypting " + encryptedLibp2pId);
      }

      try {
        String decryptedLibp2pId = decryptLibp2pIdentity(encryptedLibp2pId, encryptionSecretKey);
        return StaticHelper.base64ToBytes(decryptedLibp2pId);
      } catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException | BadPaddingException | InvalidAlgorithmParameterException e) {
        Log.d("ReactNative", "createPeerIdentity decryptMsg failed with Error: " + e.getMessage());
        Log.d("ReactNative", "creating new encrpyted identity");
        try {
          encryptedLibp2pId = createEncryptedLibp2pId(identity, encryptionSecretKey);
          String decryptedLibp2pId = decryptLibp2pIdentity(encryptedLibp2pId, encryptionSecretKey);
          return StaticHelper.base64ToBytes(decryptedLibp2pId);
        } catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException | BadPaddingException | InvalidAlgorithmParameterException e2) {
          Log.d("ReactNative", "createPeerIdentity decryptMsg failed with Error: " + e2.getMessage());
          Log.d("ReactNative", "creating new encrpyted identity");
          throw(e2);
        }
      }

    } catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException | BadPaddingException | InvalidAlgorithmParameterException e) {
      Log.d("ReactNative", "createPeerIdentity failed with Error: " + e.getMessage());
      throw (e);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  private String decryptLibp2pIdentity(String encryptedLibp2pId, SecretKey encryptionSecretKey) throws Exception {
    try {
        String decryptedLibp2pId = Cryptography.decryptMsg(encryptedLibp2pId.replace("FULA_ENC_V4:", ""), encryptionSecretKey);

        return decryptedLibp2pId;
      } catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException | BadPaddingException | InvalidAlgorithmParameterException e) {
        Log.d("ReactNative", "createPeerIdentity decryptMsg failed with Error: " + e.getMessage());
        Log.d("ReactNative", "creating new encrpyted identity");
        throw new GeneralSecurityException("decryptLibp2pIdentity Failed to decrypt libp2pId", e);
      }
  }

  private String createEncryptedLibp2pId(byte[] identity, SecretKey encryptionSecretKey) throws Exception {
    byte[] libp2pId;
    String encryptedLibp2pId;
    try {
      Log.d("ReactNative", "createEncryptedLibp2pId started");

        try {
          libp2pId = Fulamobile.generateEd25519KeyFromString(toString(identity));
        } catch (Exception e) {
          Log.d("ReactNative", " createEncryptedLibp2pId Failed to generate libp2pId: " + e.getMessage());
          throw new GeneralSecurityException("createEncryptedLibp2pId Failed to generate libp2pId", e);
        }
        encryptedLibp2pId = "FULA_ENC_V4:" + Cryptography.encryptMsg(StaticHelper.bytesToBase64(libp2pId), encryptionSecretKey, null);
        sharedPref.add(PRIVATE_KEY_STORE_PEERID, encryptedLibp2pId);
        return encryptedLibp2pId;
    }
    catch (Exception e) {
      Log.d("ReactNative", "createEncryptedLibp2pId failed with Error: " + e.getMessage());
      throw new GeneralSecurityException("createEncryptedLibp2pId Failed to generate libp2pId at hte first level", e);
    }
  }

  private void createNewRootConfig(FulaModule.Client iClient, byte[] identity) throws Exception {
    byte[] hash32 = getSHA256Hash(identity);
    this.rootConfig = Fs.init(iClient, hash32);
    Log.d("ReactNative", "rootConfig is created " + this.rootConfig.getCid());
    if (this.fula != null) {
      this.fula.flush();
    }
    this.encrypt_and_store_config();
  }

  public static byte[] getSHA256Hash(byte[] input) throws NoSuchAlgorithmException {
    MessageDigest md = MessageDigest.getInstance("SHA-256");
    return md.digest(input);
  }

  private static String bytesToHex(byte[] bytes) {
      StringBuilder result = new StringBuilder();
      for (byte b : bytes) {
          result.append(String.format("%02x", b));
      }
      return result.toString();
  }

  private void reloadFS(FulaModule.Client iClient, byte[] wnfsKey, String rootCid) throws Exception {
    Log.d("ReactNative", "reloadFS called: rootCid=" + rootCid);
    byte[] hash32 = getSHA256Hash(wnfsKey);
    Log.d("ReactNative", "wnfsKey=" + bytesToHex(wnfsKey) + "; hash32 = " + bytesToHex(hash32));
    Fs.loadWithWNFSKey(iClient, hash32, rootCid);
    Log.d("ReactNative", "reloadFS completed");
  }

  private boolean encrypt_and_store_config() throws Exception {
    try {
      if(this.identityEncryptedGlobal != null && !this.identityEncryptedGlobal.isEmpty()) {
        Log.d("ReactNative", "encrypt_and_store_config started");

        String cid_encrypted = Cryptography.encryptMsg(this.rootConfig.getCid(), this.secretKeyGlobal, null);

        sharedPref.add("FULA_ENC_V4:cid_encrypted_" + this.identityEncryptedGlobal, cid_encrypted);
        return true;
      } else {
        Log.d("ReactNative", "encrypt_and_store_config failed because identityEncryptedGlobal is empty");
        return false;
      }
    } catch (Exception e) {
      Log.d("ReactNative", "encrypt_and_store_config failed with Error: " + e.getMessage());
      throw (e);
    }
  }

  private boolean logoutInternal(byte[] identity, String storePath) throws Exception {
    try {
      if (this.fula != null) {
        this.fula.flush();
      }
      SecretKey secretKey = Cryptography.generateKey(identity);
      byte[] iv = new byte[] { 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B };
      String identity_encrypted = Cryptography.encryptMsg(Arrays.toString(identity), secretKey, iv);
      sharedPref.remove("FULA_ENC_V4:cid_encrypted_"+ identity_encrypted);

      //TODO: Should also remove peerid @Mahdi

      sharedPref.remove("FULA_ENC_V4:cid_encrypted_"+ identity_encrypted);

      this.rootConfig = null;
      this.secretKeyGlobal = null;
      this.identityEncryptedGlobal = null;

      if (storePath == null || storePath.trim().isEmpty()) {
        storePath = this.fulaStorePath;
      }

      File file = new File(storePath);
      FileUtils.deleteDirectory(file);
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
  private byte[] newClientInternal(byte[] identity, String storePath, String bloxAddr, String exchange, boolean autoFlush, boolean useRelay, boolean refresh) throws GeneralSecurityException, IOException {
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
          throw new IOException("Failed to create new Fula instance", e);
        }
      }
    } catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException | BadPaddingException | InvalidAlgorithmParameterException e) {
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
      if(this.client == null || refresh) {
        this.client = new Client(this.fula);
        Log.d("ReactNative", "fula initialized: " + this.fula.id());
      }

      SecretKey secretKey = Cryptography.generateKey(identity);
      Log.d("ReactNative", "secretKey generated: " + secretKey.toString());
      byte[] iv = new byte[] { 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B };
      String identity_encrypted =Cryptography.encryptMsg(Arrays.toString(identity), secretKey, iv);
      Log.d("ReactNative", "identity_encrypted generated: " + identity_encrypted + " for identity: " + Arrays.toString(identity));
      this.identityEncryptedGlobal = identity_encrypted;
      this.secretKeyGlobal = secretKey;

      if ( this.rootConfig == null || this.rootConfig.getCid().isEmpty() ) {
        Log.d("ReactNative", "this.rootCid is empty.");
        //Load from keystore

        String cid_encrypted_fetched = sharedPref.getValue("FULA_ENC_V4:cid_encrypted_"+ identity_encrypted);
        Log.d("ReactNative", "Here1");
        String cid = "";
        if(cid_encrypted_fetched != null && !cid_encrypted_fetched.isEmpty()) {
          Log.d("ReactNative", "decrypting cid="+cid_encrypted_fetched+" with secret="+secretKey.toString());
          cid = Cryptography.decryptMsg(cid_encrypted_fetched, secretKey);
        }

        Log.d("ReactNative", "Here2");
        //Log.d("ReactNative", "Attempted to fetch cid from keystore; cid="+cid);
        if(cid == null || cid.isEmpty()) {
          Log.d("ReactNative", "cid was not found");
          if(rootCid != null && !rootCid.isEmpty()){
            Log.d("ReactNative", "Re-setting cid from input: "+rootCid);
            cid = rootCid;
            this.rootConfig = new land.fx.wnfslib.Config(cid);
            this.reloadFS(this.client, identity, cid);
            this.encrypt_and_store_config();
          }
          if(cid == null || cid.isEmpty()) {
            Log.d("ReactNative", "Tried to recover cid but was not successful. Creating new ones");
            this.createNewRootConfig(this.client, identity);
          } else {
            this.rootConfig = new land.fx.wnfslib.Config(cid);
            this.reloadFS(this.client, identity, cid);
            this.encrypt_and_store_config();
          }
        } else {
          Log.d("ReactNative", "Recovered cid and private ref from keychain store. cid="+cid +" and cid from input was: "+rootCid);
          this.rootConfig = new land.fx.wnfslib.Config(cid);
          this.reloadFS(this.client, identity, cid);
          this.encrypt_and_store_config();
        }

        Log.d("ReactNative", "creating rootConfig completed");

        Log.d("ReactNative", "rootConfig is created: cid=" + this.rootConfig.getCid());
      } else {
        Log.d("ReactNative", "rootConfig existed: cid=" + this.rootConfig.getCid());
      }
      String peerId = this.fula.id();
      String[] obj = new String[2];
      obj[0] = peerId;
      obj[1] = this.rootConfig.getCid();
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

  @ReactMethod
  public void mkdir(String path, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "mkdir started with: path = " + path + " rootConfig.getCid() = " + this.rootConfig.getCid());
      try {
        land.fx.wnfslib.Config config = Fs.mkdir(this.client, this.rootConfig.getCid(), path);
        if(config != null) {
          this.rootConfig = config;
          this.encrypt_and_store_config();
          if (this.fula != null) {
            this.fula.flush();
          }
          String rootCid = this.rootConfig.getCid();
          Log.d("ReactNative", "mkdir completed successfully with rootCid = " + rootCid);
          promise.resolve(rootCid);
        } else {
          Log.d("ReactNative", "mkdir Error: config is null");
          promise.reject(new Exception("mkdir Error: config is null"));
        }
      } catch (Exception e) {
        Log.d("get", e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void writeFile(String fulaTargetFilename, String localFilename, Promise promise) {
    /*
    // reads content of the file form localFilename (should include full absolute path to local file with read permission
    // writes content to the specified location by fulaTargetFilename in Fula filesystem
    // fulaTargetFilename: a string including full path and filename of target file on Fula (e.g. root/pictures/cat.jpg)
    // localFilename: a string containing full path and filename of local file on hte device (e.g /usr/bin/cat.jpg)
    // Returns: new cid of the root after this file is placed in the tree
     */
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "writeFile to : path = " + fulaTargetFilename + ", from: " + localFilename);
      try {
        if (this.client != null) {
          Log.d("ReactNative", "writeFileFromPath started: this.rootConfig.getCid=" + this.rootConfig.getCid()+ ", fulaTargetFilename="+fulaTargetFilename + ", localFilename="+localFilename);
          land.fx.wnfslib.Config config = Fs.writeFileStreamFromPath(this.client, this.rootConfig.getCid(), fulaTargetFilename, localFilename);
          if(config != null) {
            this.rootConfig = config;
            this.encrypt_and_store_config();
            if (this.fula != null) {
              this.fula.flush();
              String rootCid = this.rootConfig.getCid();
              Log.d("ReactNative", "writeFileFromPath completed: this.rootConfig.getCid=" + rootCid);
              promise.resolve(rootCid);
            } else {
              Log.d("ReactNative", "writeFile Error: fula is null");
              promise.reject(new Exception("writeFile Error: fula is null"));
            }
          } else {
            Log.d("ReactNative", "writeFile Error: config is null");
            promise.reject(new Exception("writeFile Error: config is null"));
          }
        } else {
          Log.d("ReactNative", "writeFile Error: client is null");
          promise.reject(new Exception("writeFile Error: client is null"));
        }
      } catch (Exception e) {
        Log.d("get", e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void writeFileContent(String path, String contentString, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "writeFile: contentString = " + contentString);
      Log.d("ReactNative", "writeFile: path = " + path);
      try {
        byte[] content = this.convertStringToByte(contentString);
        land.fx.wnfslib.Config config = Fs.writeFile(this.client, this.rootConfig.getCid(), path, content);
        this.rootConfig = config;
        this.encrypt_and_store_config();
        if (this.fula != null) {
          this.fula.flush();
        }
        promise.resolve(config.getCid());
      } catch (Exception e) {
        Log.d("get", e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void ls(String path, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "ls: path = " + path + "rootCid= " + this.rootConfig.getCid());
      try {
        byte[] res = Fs.ls(this.client, this.rootConfig.getCid(), path);

        String s = new String(res, StandardCharsets.UTF_8);
        Log.d("ReactNative", "ls: res = " + s);
        promise.resolve(s);
      } catch (Exception e) {
        Log.d("ReactNative", e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void rm(String path, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "rm: path = " + path + ", beginning rootCid=" + this.rootConfig.getCid());
      try {
        land.fx.wnfslib.Config config = Fs.rm(this.client, this.rootConfig.getCid(), path);
        if(config != null) {
          this.rootConfig = config;
          this.encrypt_and_store_config();
          if (this.fula != null) {
            this.fula.flush();
          }
          String rootCid = config.getCid();
          Log.d("ReactNative", "rm: returned rootCid = " + rootCid);
          promise.resolve(rootCid);
        } else {
            Log.d("ReactNative", "rm Error: config is null");
            promise.reject(new Exception("rm Error: config is null"));
        }
      } catch (Exception e) {
        Log.d("ReactNative", e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void cp(String sourcePath, String targetPath, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "rm: sourcePath = " + sourcePath);
      try {
        land.fx.wnfslib.Config config = Fs.cp(this.client, this.rootConfig.getCid(), sourcePath, targetPath);
        if(config != null) {
          this.rootConfig = config;
          this.encrypt_and_store_config();
          if (this.fula != null) {
            this.fula.flush();
          }
          promise.resolve(config.getCid());
        } else {
          Log.d("ReactNative", "cp Error: config is null");
          promise.reject(new Exception("cp Error: config is null"));
        }
      } catch (Exception e) {
        Log.d("ReactNative", e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void mv(String sourcePath, String targetPath, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "rm: sourcePath = " + sourcePath);
      try {
        land.fx.wnfslib.Config config = Fs.mv(this.client, this.rootConfig.getCid(), sourcePath, targetPath);
        if(config != null) {
          this.rootConfig = config;
          this.encrypt_and_store_config();
          if (this.fula != null) {
            this.fula.flush();
          }
          promise.resolve(config.getCid());
        } else {
          Log.d("ReactNative", "mv Error: config is null");
          promise.reject(new Exception("mv Error: config is null"));
        }
      } catch (Exception e) {
        Log.d("ReactNative", e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void readFile(String fulaTargetFilename, String localFilename, Promise promise) {
    /*
    // reads content of the file form localFilename (should include full absolute path to local file with read permission
    // writes content to the specified location by fulaTargetFilename in Fula filesystem
    // fulaTargetFilename: a string including full path and filename of target file on Fula (e.g. root/pictures/cat.jpg)
    // localFilename: a string containing full path and filename of local file on hte device (e.g /usr/bin/cat.jpg)
    // Returns: new cid of the root after this file is placed in the tree
     */
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "readFile: fulaTargetFilename = " + fulaTargetFilename);
      try {
        Log.d("ReactNative", "readFile: localFilename = " + localFilename + " fulaTargetFilename = " + fulaTargetFilename + " beginning rootCid = " + this.rootConfig.getCid());
        String path = Fs.readFilestreamToPath(this.client, this.rootConfig.getCid(), fulaTargetFilename, localFilename);
        promise.resolve(path);
      } catch (Exception e) {
        Log.d("ReactNative", e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void readFileContent(String path, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "readFileContent: path = " + path);
      try {
        byte[] res = Fs.readFile(this.client, this.rootConfig.getCid(), path);
        String resString = toString(res);
        promise.resolve(resString);
      } catch (Exception e) {
        Log.d("ReactNative", e.getMessage());
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void get(String keyString, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "get: keyString = " + keyString);
      try {
        byte[] key = this.convertStringToByte(keyString);
        byte[] value = this.getInternal(key);
        String valueString = toString(value);
        promise.resolve(valueString);
      } catch (Exception e) {
        Log.d("ReactNative", e.getMessage());
        promise.reject(e);
      }
    });
  }

  @NonNull
  private byte[] getInternal(byte[] key) throws Exception {
    try {
      Log.d("ReactNative", "getInternal: key.toString() = " + toString(key));
      Log.d("ReactNative", "getInternal: key.toString().bytes = " + Arrays.toString(key));
      byte[] value = this.fula.get(key);
      Log.d("ReactNative", "getInternal: value.toString() = " + toString(value));
      return value;
    } catch (Exception e) {
      Log.d("ReactNative", "getInternal: error = " + e.getMessage());
      Log.d("getInternal", e.getMessage());
      throw (e);
    }
  }

  @ReactMethod
  public void has(String keyString, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "has: keyString = " + keyString);
      try {
        byte[] key = this.convertStringToByte(keyString);
        boolean result = this.hasInternal(key);
        promise.resolve(result);
      } catch (Exception e) {
        Log.d("ReactNative", e.getMessage());
        promise.reject(e);
      }
    });
  }

  private boolean hasInternal(byte[] key) throws Exception {
    try {
      boolean res = this.fula.has(key);
      return res;
    } catch (Exception e) {
      Log.d("ReactNative", e.getMessage());
      throw (e);
    }
  }

  private void pullInternal(byte[] key) throws Exception {
    try {
      this.fula.pull(key);
    } catch (Exception e) {
      Log.d("ReactNative", e.getMessage());
      throw (e);
    }
  }

  @ReactMethod
  public void push(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "push started");
      try {
        this.pushInternal(this.convertStringToByte(this.rootConfig.getCid()));
        promise.resolve(this.rootConfig.getCid());
      } catch (Exception e) {
        Log.d("ReactNative", e.getMessage());
        promise.reject(e);
      }
    });
  }

  private void pushInternal(byte[] key) throws Exception {
    try {
      if (this.fula != null && this.fula.has(key)) {
        this.fula.push(key);
        this.fula.flush();
      } else {
        Log.d("ReactNative", "pushInternal error: key wasn't found or fula is not initialized");
        throw new Exception("key wasn't found in local storage");
      }
    } catch (Exception e) {
      Log.d("ReactNative", "pushInternal"+ e.getMessage());
      throw (e);
    }
  }

  @ReactMethod
  public void put(String valueString, String codecString, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "put: codecString = " + codecString);
      Log.d("ReactNative", "put: valueString = " + valueString);
      try {
        //byte[] codec = this.convertStringToByte(CodecString);
        long codec = Long.parseLong(codecString);


        Log.d("ReactNative", "put: codec = " + codec);
        byte[] value = toByte(valueString);

        Log.d("ReactNative", "put: value.toString() = " + toString(value));
        byte[] key = this.putInternal(value, codec);
        Log.d("ReactNative", "put: key.toString() = " + toString(key));
        promise.resolve(toString(key));
      } catch (Exception e) {
        Log.d("ReactNative", "put: error = " + e.getMessage());
        promise.reject(e);
      }
    });
  }

  @NonNull
  private byte[] putInternal(byte[] value, long codec) throws Exception {
    try {
      if(this.fula != null) {
        byte[] key = this.fula.put(value, codec);
        this.fula.flush();
        return key;
      } else {
        Log.d("ReactNative", "putInternal Error: fula is not initialized");
        throw (new Exception("putInternal Error: fula is not initialized"));
      }
    } catch (Exception e) {
      Log.d("ReactNative", "putInternal"+ e.getMessage());
      throw (e);
    }
  }

  @ReactMethod
  public void setAuth(String peerIdString, boolean allow, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "setAuth: peerIdString = " + peerIdString);
      try {
        if (this.fula != null && this.fula.id() != null && this.fulaConfig != null && this.fulaConfig.getBloxAddr() != null) {
          String bloxAddr = this.fulaConfig.getBloxAddr();
          Log.d("ReactNative", "setAuth: bloxAddr = '" + bloxAddr+"'"+ " peerIdString = '" + peerIdString+"'");
          int index = bloxAddr.lastIndexOf("/");
          String bloxPeerId = bloxAddr.substring(index + 1);
          this.fula.setAuth(bloxPeerId, peerIdString, allow);
          promise.resolve(true);
        } else {
          Log.d("ReactNative", "setAuth error: fula is not initialized");
          throw new Exception("fula is not initialized");
        }
        promise.resolve(false);
      } catch (Exception e) {
        Log.d("ReactNative", "ERROR:" + e.getMessage());
        promise.reject(e);
      }
    });
  }

  private void shutdownInternal() throws Exception {
    try {
      if(this.fula != null) {
        this.fula.shutdown();
        this.fula = null;
        this.client = null;
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
  public void listAvailableReplicationRequests(String poolIDStr, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "listAvailableReplicationRequests: poolID = " + poolIDStr);
      try {
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
  private void listRecentCidsAsString(Promise promise) throws Exception {
    ThreadUtils.runOnExecutor(() -> {
    try {
      if (this.fula != null) {
        Log.d("ReactNative", "ListRecentCidsAsString");
        fulamobile.StringIterator recentLinks = this.fula.listRecentCidsAsString();
        ArrayList<String> recentLinksList = new ArrayList<>();
        while (recentLinks.hasNext()) {
          recentLinksList.add(recentLinks.next());
        }
        if (!recentLinksList.isEmpty()) {
          // return the whole list
          Log.d("ReactNative", "ListRecentCidsAsString found: "+ recentLinksList);
          WritableArray recentLinksArray = Arguments.createArray();
          for (String link : recentLinksList) {
            recentLinksArray.pushString(link);
          }
          promise.resolve(recentLinksArray);
        } else {
          promise.resolve(false);
        }
      } else {
        throw new Exception("ListRecentCidsAsString: Fula is not initialized");
      }
    } catch (Exception e) {
      Log.d("ReactNative", "ListRecentCidsAsString failed with Error: " + e.getMessage());
      try {
        throw (e);
      } catch (Exception ex) {
        throw new RuntimeException(ex);
      }
    }
    });
  }

  @ReactMethod
  private void listRecentCidsAsStringWithChildren(Promise promise) throws Exception {
    ThreadUtils.runOnExecutor(() -> {
      try {
        if (this.fula != null) {
          Log.d("ReactNative", "listRecentCidsAsStringWithChildren");
          fulamobile.StringIterator recentLinks = this.fula.listRecentCidsAsStringWithChildren();
          ArrayList<String> recentLinksList = new ArrayList<>();
          while (recentLinks.hasNext()) {
            recentLinksList.add(recentLinks.next());
          }
          if (!recentLinksList.isEmpty()) {
            // return the whole list
            Log.d("ReactNative", "listRecentCidsAsStringWithChildren found: "+ recentLinksList);
            WritableArray recentLinksArray = Arguments.createArray();
            for (String link : recentLinksList) {
              recentLinksArray.pushString(link);
            }
            promise.resolve(recentLinksArray);
          } else {
            promise.resolve(false);
          }
        } else {
          throw new Exception("listRecentCidsAsStringWithChildren: Fula is not initialized");
        }
      } catch (Exception e) {
        Log.d("ReactNative", "listRecentCidsAsStringWithChildren failed with Error: " + e.getMessage());
        try {
          throw (e);
        } catch (Exception ex) {
          throw new RuntimeException(ex);
        }
      }
    });
  }

  @ReactMethod
  public void clearCidsFromRecent(ReadableArray cidArray, Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
    try {
      if (this.fula != null) {
        StringBuilder cidStrBuilder = new StringBuilder();
        for (int i = 0; i < cidArray.size(); i++) {
          if (i > 0) {
            cidStrBuilder.append("|");
          }
          cidStrBuilder.append(cidArray.getString(i));
        }

        byte[] cidsBytes = cidStrBuilder.toString().getBytes(StandardCharsets.UTF_8);
        this.fula.clearCidsFromRecent(cidsBytes);
        promise.resolve(true); // Indicate success
      } else {
        throw new Exception("clearCidsFromRecent: Fula is not initialized");
      }
    } catch (Exception e) {
      Log.d("ReactNative", "clearCidsFromRecent failed with Error: " + e.getMessage());
      promise.reject("Error", e.getMessage());
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
  public void reboot(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "reboot");
      try {
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

  @ReactMethod
  public void testData(String identityString, String bloxAddr, Promise promise) {
    try {
      byte[] identity = toByte(identityString);
      byte[] peerIdByte = this.newClientInternal(identity, "", bloxAddr, "", true, true, true);

      String peerIdReturned = Arrays.toString(peerIdByte);
      Log.d("ReactNative", "newClient peerIdReturned= " + peerIdReturned);
      String peerId = this.fula.id();
      Log.d("ReactNative", "newClient peerId= " + peerId);
      byte[] bytes = {1, 85, 18, 32, 11, -31, 75, -78, -109, 11, -111, 97, -47, -78, -22, 84, 39, -117, -64, -70, -91, 55, -23, -80, 116, -123, -97, -26, 126, -70, -76, 35, 54, -106, 55, -9};

      byte[] key = this.fula.put(bytes, 85);
      Log.d("ReactNative", "testData put result string="+Arrays.toString(key));

      byte[] value = this.fula.get(key);
      Log.d("ReactNative", "testData get result string="+Arrays.toString(value));

      this.fula.push(key);
      //this.fula.flush();

      byte[] fetchedVal = this.fula.get(key);
      this.fula.pull(key);

      promise.resolve(Arrays.toString(fetchedVal));
    } catch (Exception e) {
      Log.d("ReactNative", "ERROR:" + e.getMessage());
      promise.reject(e);
    }
  }

  // Plugin Methods
  @ReactMethod
  public void listPlugins(Promise promise) {
    ThreadUtils.runOnExecutor(() -> {
      Log.d("ReactNative", "listPlugins");
      try {
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
      if (e.getMessage().contains("timeout")) {
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
