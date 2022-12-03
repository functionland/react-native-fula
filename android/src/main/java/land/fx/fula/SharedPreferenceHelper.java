package land.fx.fula;

import static android.content.Context.MODE_PRIVATE;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

public class SharedPreferenceHelper {
  private static SharedPreferenceHelper me;
  private static String sharedPrefName;
  private static Context context;

  private SharedPreferenceHelper() {
  }

  public static SharedPreferenceHelper getInstance(Context cntx) {
    if (me == null) {
      me = new SharedPreferenceHelper();
    }
    context = cntx;
    sharedPrefName = "APP_KEY_PAIR_VALUE";
    return me;
  }

  public String getValue(String key) {
    SharedPreferences prefs = context.getSharedPreferences(sharedPrefName, MODE_PRIVATE);
    return prefs.getString(key, null);
  }

  public boolean getBooleanValue(String key) {
    SharedPreferences prefs = context.getSharedPreferences(sharedPrefName, MODE_PRIVATE);
    return prefs.getBoolean(key, false);
  }

  public SharedPreferenceHelper add(String key, String value) {
    try {
      context.getSharedPreferences(sharedPrefName, MODE_PRIVATE).edit().putString(key, value).apply();
      return me;
    } catch (Exception ex) {
      Log.e("React-Native-Fula", "SharedPrefHandler: AddSharedPref: Exception: " + ex.getMessage(), ex);
      throw ex;
    }
  }

  public SharedPreferenceHelper add(String key, boolean value) {
    try {
      context.getSharedPreferences(sharedPrefName, MODE_PRIVATE).edit().putBoolean(key, value).apply();
      return me;
    } catch (Exception e) {
      Log.e("React-Native-Fula", "SharedPrefHandler: AddSharedPref: Exception: " + e.getMessage(), e);
      throw e;
    }
  }

  public SharedPreferenceHelper remove(String key) {
    try {
      context.getSharedPreferences(sharedPrefName, MODE_PRIVATE).edit().remove(key).apply();
      return me;
    } catch (Exception ex) {
      Log.e("React-Native-Fula", "SharedPrefHandler: AddSharedPref: Exception: " + ex.getMessage(), ex);
      throw ex;
    }
  }
}
