// ICoreService.aidl
package land.fx.fula;

import land.fx.fula.IListener;

// Declare any non-default types here with import statements


// So everything work with base64 json strings.

interface ICoreService {
    /**
    * Often you want to allow a service to call back to its clients.
    * This shows how to do so, by registering a callback interface with
    * the service.
    */
    oneway void registerListener(IListener cb);
    /**
     * Remove a previously registered callback interface.
     */
    oneway void unregisterListener(IListener cb);

}
