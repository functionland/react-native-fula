package land.fx.fula;

import java.util.Arrays;

public class FileRef {
    public byte[] iv;
    public byte[] key;
    public String id;

    // public FileRef(msg byte[]){
    //     int lenIv = unsigned(msg[msg.length-3]);
    //     int lenKey = unsigned(msg[msg.length-2]);
    //     int lenId = unsigned(msg[msg.length-1]);

    //     iv = Arrays.copyOfRange(msg, 0, lenIv);
    //     key = Arrays.copyOfRange(msg, lenIv, lenIv+lenKey);
    //     id = new String(Arrays.copyOfRange(msg, lenIv+lenKey, lenId));
    // }

    // public static int unsigned(byte x) {
    //     return int(x & "0xFF");
    // }
}