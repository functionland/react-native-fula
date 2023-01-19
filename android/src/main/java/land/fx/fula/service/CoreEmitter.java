//package land.fx.fula.service;
//import android.os.RemoteCallbackList;
//import android.os.RemoteException;
//import android.util.Log;
//
//public class CoreEmitter implements Emitter {
//    final RemoteCallbackList<IListener> listeners
//            = new RemoteCallbackList<IListener>();
//    ILocalListener localListener = null;
//
//
//    public void addListener(IListener cb) {
//        listeners.register(cb);
//    }
//    public void removeListener(IListener cb) {
//        listeners.unregister(cb);
//    }
//    public void setLocalListener(ILocalListener cb){localListener = cb; }
//
//    @Override
//    public void emit(Event event) {
//        Log.d("Broadcaster", "broadCast: "+event);
//        IEvent evt = new IEvent();
//        evt.action = event.getAction();
//        evt.group = event.getGroup();
//        evt.name = event.getName();
//        evt.payload = event.getPayload();
//        broadcastEvent(evt);
//        if(this.localListener!=null){
//            this.localListener.onEvent(evt);
//        }
//    }
//
//
//    private void broadcastEvent(IEvent evt) {
//        // Broadcast to all clients the new value.
//        final int N = listeners.beginBroadcast();
//        for (int i=0; i<N; i++) {
//            try {
//                listeners.getBroadcastItem(i).emit(evt);
//            } catch (RemoteException e) {
//                // The RemoteCallbackList will take care of removing
//                // the dead object for us.
//            }
//        }
//        listeners.finishBroadcast();
//    }
//}
