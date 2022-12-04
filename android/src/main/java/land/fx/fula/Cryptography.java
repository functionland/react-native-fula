package land.fx.fula;

import android.util.Base64;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.InvalidParameterSpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

public class Cryptography {
  public static String encryptMsg(String message, SecretKey secret)
    throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidParameterSpecException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException {
    Cipher cipher = null;
    cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
    cipher.init(Cipher.ENCRYPT_MODE, secret);
    byte[] cipherText = cipher.doFinal(message.getBytes("UTF-8"));
    return Base64.encodeToString(cipherText, Base64.NO_WRAP);
  }

  public static String decryptMsg(String cipherText, SecretKey secret)
    throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidParameterSpecException, InvalidAlgorithmParameterException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException, UnsupportedEncodingException {
    Cipher cipher = null;
    cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
    cipher.init(Cipher.DECRYPT_MODE, secret);
    byte[] decode = Base64.decode(cipherText, Base64.NO_WRAP);
    String decryptString = new String(cipher.doFinal(decode), "UTF-8");
    return decryptString;
  }

  public static SecretKey generateKey(byte[] key)
    throws NoSuchAlgorithmException, InvalidKeySpecException {
      String salt = key.toString();
    PBEKeySpec pbeKeySpec = new PBEKeySpec(key.toString().toCharArray(), salt.getBytes(), 1000,128);
    SecretKey pbeKey = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(pbeKeySpec);
    return new SecretKeySpec(pbeKey.getEncoded(), "AES");
  }
}
