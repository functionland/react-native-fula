import fulamobile.Client;

public class BlockStore {
  private Client fula;

  public BlockStore(Client fula) throws Exception{
    this.fula = fula;

  }

  public void getBlock(byte[] key) {
    ThreadUtils.runOnExecutor(() -> {
          try{
            byte[] value = fula.get(key);

          }
          catch(Exception e){
            Log.d("getBlock",e.getMessage());
          }
      });
  }

  public void putBlock(byte[] key, byte[] value) {
    ThreadUtils.runOnExecutor(() -> {
       try{
         fula.put(key, value);
       }catch (Exception e){
         Log.d("putBlock",e.getMessage());
       }
    });
 }
}
