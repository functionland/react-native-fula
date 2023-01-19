package land.fx.fula.service;

import static android.app.PendingIntent.FLAG_IMMUTABLE;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.icu.text.UnicodeSetIterator;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.SystemClock;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.io.File;

import land.fx.fula.ICoreService;
import land.fx.fula.IListener;
import land.fx.fula.R;


public class CoreService extends Service {
    private static final String TAG = "CoreService";
  private final String NAME = "CoreService";
    private final String CHANNEL_ID = "111";
    private final String VERSION = "0.0.3";
    private boolean inited = false;
    private boolean initing = false;
    int notificationId = 12;
    String appDir;
    String storeDirPath;
    String path;


    private final ILocalListener mlistener = event -> {
        try {
            Log.i(TAG, ": notification called");
            switch (event.action) {
                // Todo: anything you need on subsystem events
                // like showing notification
            }

        } catch (Exception e) {
            Log.e(TAG, ": notification failed", e);
            e.printStackTrace();
        }
    };

    public PendingIntent makeIntent() {
        return null;
    }


    private void init() {
        initing = true;
        // init any thing you need
        initing = false;
        inited = true;
    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = getString(R.string.channel_name);
            String description = getString(R.string.channel_description);
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }


    private synchronized void startFula() throws Exception {
        Context context = getApplicationContext();
        appDir = context.getFilesDir().toString();
        storeDirPath = appDir + "/bee/received/";
        path = appDir + "/bee";
        File storeDir = new File(storeDirPath);
        boolean success = false;
        if (!storeDir.exists()) {
            success = storeDir.mkdirs();
        }
        if (success) {
            Log.d(NAME, "store folder created");
        } else {
            Log.d(NAME, "store exist");
        }

        Log.i(NAME, "core service stared");

    }
//    sample of how to show notification
//    public void showMessageNotification(String msgID) throws Exception {
//        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
//        Log.i(TAG, "showMessageNotification: " + n.getText() + " " + n.getTitle());
//        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
//                .setSmallIcon(R.drawable.ic_stat_onesignal_default)
//                .setContentTitle(n.getTitle())
//                .setContentText(n.getText())
//                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
//        PendingIntent p = makeIntent();
//        if (p != null) {
//            builder.setContentIntent(p);
//        }
//        notificationManager.notify(notificationId, builder.build());
//        notificationId += 1;
//    }

    public void showServiceNotification() {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_onesignal_default)
                .setContentTitle("HoodChat")
                .setContentText("background service")
                .setSilent(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        PendingIntent p = makeIntent();
        if (p != null) {
            builder.setContentIntent(p);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForeground(1, builder.build());
        }
    }

    @Override
    public void onCreate() {
        createNotificationChannel();
        showServiceNotification();
        super.onCreate();
        if (!inited && !initing) {
            init();
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    public void resist() {
        Intent intent = new Intent(getApplicationContext(), getClass());
        intent.setPackage(getPackageName());
        PowerManager.WakeLock wakeLock = ((PowerManager) this.getSystemService(Context.POWER_SERVICE)).newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, ":remote");
        wakeLock.acquire(60 * 1L); //It will keep the device awake & register the service within 1 minute time duration.
        this.getPackageManager().setComponentEnabledSetting(new ComponentName(this, this.getClass()), PackageManager.COMPONENT_ENABLED_STATE_DEFAULT, PackageManager.DONT_KILL_APP);
        PendingIntent restartServicePendingIntent = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            restartServicePendingIntent = PendingIntent.getForegroundService(getApplicationContext(), 1, intent, FLAG_IMMUTABLE);
        }


        AlarmManager alarmService = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        alarmService.set(
                AlarmManager.ELAPSED_REALTIME,
                SystemClock.elapsedRealtime() + 5000,
                restartServicePendingIntent);
        wakeLock.release();
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.i(NAME, "Task removed in " + this + ": " + rootIntent);
        resist();
        super.onTaskRemoved(rootIntent);
    }


    @Override
    public void onDestroy() {
        Log.i(NAME, "core service destroyed");
        //Todo start go services
        resist();
        Toast.makeText(this, R.string.service_stopped, Toast.LENGTH_SHORT).show();
    }

    @Override
    public IBinder onBind(Intent intent) {
        Log.i(NAME, "client requested for bind");
        return binder;
    }


    // Core API service for isolated service
    private final ICoreService.Stub binder = new ICoreService.Stub() {

        public void registerListener(IListener cb) {
            if (cb != null) ;// add event listener
        }

        public void unregisterListener(IListener cb) {
            if (cb != null) ;// remove event listener
        }

    };

}
