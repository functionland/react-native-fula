package land.fx.fula;

import android.util.Base64;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.SecureRandom;
import java.nio.ByteBuffer;
import java.security.spec.InvalidParameterSpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.GCMParameterSpec;

public class Cryptography {
  public static String encryptMsg(String message, SecretKey secret)
    throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException {
    Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
    byte[] iv = new byte[12]; // Ensure this is randomly generated for each encryption.
    new SecureRandom().nextBytes(iv);
    GCMParameterSpec spec = new GCMParameterSpec(128, iv);
    cipher.init(Cipher.ENCRYPT_MODE, secret, spec);
    byte[] cipherText = cipher.doFinal(message.getBytes(StandardCharsets.UTF_8));
    ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + cipherText.length);
    byteBuffer.put(iv);
    byteBuffer.put(cipherText);
    return Base64.encodeToString(byteBuffer.array(), Base64.NO_WRAP);
  }

  public static String decryptMsg(String cipherText, SecretKey secret)
    throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
    ByteBuffer byteBuffer = ByteBuffer.wrap(Base64.decode(cipherText, Base64.NO_WRAP));
    byte[] iv = new byte[12];
    byteBuffer.get(iv);
    byte[] cipherBytes = new byte[byteBuffer.remaining()];
    byteBuffer.get(cipherBytes);
    Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
    GCMParameterSpec spec = new GCMParameterSpec(128, iv);
    cipher.init(Cipher.DECRYPT_MODE, secret, spec);
    String decryptString = new String(cipher.doFinal(cipherBytes), StandardCharsets.UTF_8);
    return decryptString;
  }

  public static SecretKey generateKey(byte[] key)
    throws NoSuchAlgorithmException, InvalidKeySpecException {
    PBEKeySpec pbeKeySpec = new PBEKeySpec(StaticHelper.bytesToBase64(key).toCharArray(), key, 1000, 128);
    SecretKey pbeKey = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(pbeKeySpec);
    return new SecretKeySpec(pbeKey.getEncoded(), "AES");
  }
}
