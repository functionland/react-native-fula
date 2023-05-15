//
//  Cryptography.swift
//  FulaModule
//
//  Created by Homayoun on 5/15/23.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import CommonCrypto

public class Cryptography {
    public static func encryptMsg(message: String, SecretKey secret)
    throws -> String {
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
    PBEKeySpec pbeKeySpec = new PBEKeySpec(StaticHelper.bytesToBase64(key).toCharArray(), key, 1000, 128);
    SecretKey pbeKey = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(pbeKeySpec);
    return new SecretKeySpec(pbeKey.getEncoded(), "AES");
  }
}
