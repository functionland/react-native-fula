package land.fx.fula;

import java.util.Base64;

public class StaticHelper {
  public static String bytesToBase64(byte[] bytes) {
    return Base64.getEncoder().encodeToString(bytes);
  }

  public static byte[] base64ToBytes(String base64) {
    return Base64.getDecoder().decode(base64);
  }
}
