package land.fx.fula;

import android.content.Context;
import android.net.wifi.WifiManager;
import android.net.wifi.WifiManager.MulticastLock;

public class MDNSLockerDriver implements NativeMDNSLockerDriver {
  private final Context context;
  private MulticastLock multicastLock = null;

  public MDNSLockerDriver(Context context) {
    this.context = context;
  }

  @Override
  public void lock() {
    WifiManager wifi = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
    multicastLock = wifi.createMulticastLock("BertyMDNSLock");
    multicastLock.setReferenceCounted(true);
    multicastLock.acquire();
  }

  @Override
  public void unlock() {
    if (multicastLock != null) {
      multicastLock.release();
      multicastLock = null;
    }
  }
}
