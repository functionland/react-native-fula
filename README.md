# react-native-fula

This package is a bridge to use the [Fula protocols](https://github.com/functionland/go-fula) in the react-native. It uses [WNFS](https://github.com/wnfs-wg/rs-wnfs) to create the Merkle dag from files and folders and transfer the DAG using Graphsync to the nodes. 

## Installation

```sh
npm install react-native-fula
```

## Usage

```js
import { fula } from 'react-native-fula'; // Until the library becomes stable, we suggest importing from github directly
```

```js
// Creates a new client without creating a filesystem. It is better to call this instead of directly calling init
const peerId //returns peerId as string
=  newClient(
  identity: string, //privateKey of did identity
  storePath: string, // leave empty to use the default temp one
  bloxAddr: string, //leave empty for testing without a backend node
  exchange: 'noop'|'', //add noop for testing without a backend
  autoFlush: boolean, //Default to false. Always set to false unless you know what you are doing. explicitly write data to disk after each operation if set to true
  useRelay: boolean, //default to true. If true it forces the connection through relay
  refresh: boolean? //forces the fula object to be recreated. default is false
)
```

```js
//Initialize the fula client, which creates the libp2p connection if newClient is not called before, and creates filesystem. Note that input is not an object e.g. init('','','','noop', false)
[
    peerId, //returns peerId of the created libp2p instance in form of a string of bytes
    cid, //return the root cid of the WNFS merkle DAG in form of a string
    private_ref //return the keys needed to decode hte encrypted WNFS tree in form of a string of object
] 
= 
await fula.init( 
    identity: string, //bytes of the privateKey of did identity in string format
    storePath: string, // leave empty to use the default temp one
    bloxAddr: string, //leave empty for testing without a backend node
    exchange: 'noop'|'', //add noop for testing without a backend
    autoFlush: boolean, //Default to false. Always set to false unless you know what you are doing. explicitly write data to disk after each operation if set to true
    useRelay: boolean, //default to true. If true it forces the connection through relay
    refresh: boolean? //forces the fula object to be recreated. default is false
);
```

```js
//Creates a Folder
const cid //returns the cid of the new root. Note that on every write action the root cid changes.
= 
await fula.mkdir(
    path: string // This is the Fula path to create a folder and always starts with "root/" and should not start or end with a slash e.g "root/pictures"
);
```

```js
//Write a local file on the device to the Fula tree (upload). It keeps the original file modification date.
const cid //returns the cid of the new root. Note that on every write action the root cid changes.
= 
await fula.writeFile(
    fulaTargetFilename: string, //path to the file on the tree. It should include the filename and extension and start from the "root/". e.g. "root/pictures/cat.jpg"
    localFilename: string //path to the local file. e.g the file that needs to be uploaded
);
//// TODO: This needs to be improved by using stream to not overload the memory for large files
```

```js
//reads a file on fula tree to a local file on the device (download). It is stream so does not affect memory for large files.
const localFilePath //returns the path to the local file and includes the filename
= 
await fula.readFile(
    fulaTargetFilename: string, //path to the file on the tree. It should include the filename and extension and start from the "root/". e.g. "root/pictures/cat.jpg"
    localFilename: string //path to the local file. It should include the filename and extension. e.g. "/temp/cat.jpg"
);
```

```js
//shows all files and folders under the specified path on Fula
const fileList //returns all the files and folders in a string separated by \n
= 
await fula.ls(
    path: string, //path to the folder on the tree. It always starts from the "root". e.g. "root" or "root/pictures"
);
//// TODO: This needs to be improved by returning an array of files and folders and in chunks to not overload hte memory for large folders
```

```js
//removes all files and folders at the specified path on Fula
const cid //returns the cid of the new root. Note that on every write action the root cid changes.
= 
await fula.rm(
    path: string, //path to the file or folder on the tree. It always starts from the "root". e.g. "root/pictures" or "root/pictures/cat.jpg"
);

```

```js
//copies the specified file or folder at sourcePath to the filename at targetPath. the path itself(apart from filename) must exist
const cid //returns the cid of the new root. Note that on every write action the root cid changes.
= 
await fula.cp(
    sourcePath: string, //path to the file or folder on the tree. It always starts from the "root". e.g. "root/pictures" or "root/pictures/cat.jpg"
    targetPath: string, //path to the file or folder on the tree. It always starts from the "root". e.g. "root/pictures2" or "root/pictures2/cat.jpg"
);

```

```js
//moves the specified file or folder at sourcePath to the filename at targetPath. the path itself(apart from filename) must exist
const cid //returns the cid of the new root. Note that on every write action the root cid changes.
= 
await fula.mv(
    sourcePath: string, //path to the file or folder on the tree. It always starts from the "root". e.g. "root/pictures" or "root/pictures/cat.jpg"
    targetPath: string, //path to the file or folder on the tree. It always starts from the "root". e.g. "root/pictures2" or "root/pictures2/cat.jpg"
);

```

```js
//checks if fula is ready (initialized through newClient or init)
const result //returns true if succesful and false if fails
= 
await fula.isReady(
    filesystemCheck: boolean //Default is true. If true it checks if both WNFS and Fula are ready. If false it only checks fula
);

```

```js
//checks if client can reach server
const result //returns true if it can, and false if it cannot
= 
await fula.checkConnection(
    timeout: number? //default to 20. Maximum time in seconds that checkConnection waits before throwing an error
);

```

```js
//checks if there are any un-synced actions on the client
const result //returns true if there are, and false if everything is synced with server
= 
await fula.checkFailedActions(
    retry: boolean //if true, it tries to sync device with server, if not, it only checks
    timeout: number? //default to 20. Maximum time in seconds that checkConnection waits before throwing an error
);
```

```js
//shuts down the fula libp2p and datastore
await fula.shutdown();
```

```js
//removes all Fula related data and information (Except the encrypted filesystem) at the specified storage local path
const result //returns true if succesful and false if fails
= 
await fula.logout(
    identity: string, //bytes of the privateKey of did identity in string format
    storePath: string, // leave empty to use the default temp one
);

```

## Roadmap

Please note the following might not be done in order:

- [x] Initial version with all functions included
- [x] Add WNFS tree encryption key generation from an input (deterministically)
- [x] Improve ead function to use a stream. ( :100: v1 Release here )
- [x] Connect to backend
- [ ] Connect to Blockchain codes using APIs

## Other related libraries

| Name | Description |
| --- | --- |
| [WNFS for Android](https://github.com/functionland/wnfs-android) | Android build for WNFS rust version |
| [WNFS for iOS](https://github.com/functionland/wnfs-ios) | iOS build for WNFS rust version |
| [WNFS Build](https://github.com/functionland/wnfs-build-aar) | Android .aar for WNFS |
| [Fula Build](https://github.com/functionland/fula-build-aar) | android .aar file for Fula |
| [Fx Fotos](https://github.com/functionland/fx-fotos) | Fx Fotos dApp using react-native-fula |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
