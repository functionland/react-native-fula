// IListener.aidl
package land.fx.fula;

// Declare any non-default types here with import statements
import land.fx.fula.IEvent;


oneway interface IListener {
    /**
    * A call back for notifying message change
    */
     void emit(in IEvent event);
}
