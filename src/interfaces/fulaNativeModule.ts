import { NativeModules, Platform } from 'react-native';

interface FulaNativeModule {
  init: (
    identity: string, //Private key of did identity
    storePath: string, //You can leave empty
    bloxAddr: string, //Blox multiadddr needs to be manually entered now
    exchange: string, //set to 'noope' for testing
    autoFlush: boolean, //set to false always unless you know what you are doing. This is to write actions to disk explicitly after each write
    rootCid: string | null, //if you have the latest rootCid you can send it and it generates the private_ref for filesystem
    useRelay: boolean | null // if true it forces the use of relay
  ) => Promise<{ peerId: string; rootCid: string; private_ref: string }>;
  newClient: (
    identity: string, //Private key of did identity
    storePath: string, //You can leave empty
    bloxAddr: string, //Blox multiadddr needs to be manually entered now
    exchange: string, //set to 'noope' for testing
    autoFlush: boolean, //set to false always unless you know what you are doing. This is to write actions to disk explicitly after each write
    useRelay: boolean | null // if true it forces the use of relay
    ) => Promise<string>;
  isReady: (filesystemCheck: boolean) => Promise<boolean>;
  newSeededAccount: (seed: string) => Promise<string>;
  logout: (identity: string, storePath: string) => Promise<boolean>;
  checkFailedActions: (retry: boolean) => Promise<boolean>;
  checkConnection: () => Promise<boolean>;
  get: (key: string) => Promise<string>;
  has: (key: Uint8Array) => Promise<boolean>;
  push: () => Promise<string>;
  put: (content: string, codec: string) => Promise<string>;
  mkdir: (path: string) => Promise<string>;
  writeFileContent: (path: string, content: string) => Promise<string>;
  writeFile: (
    fulaTargetFilename: string,
    localFilename: string
  ) => Promise<string>;
  ls: (path: string) => Promise<string>;
  rm: (path: string) => Promise<string>;
  cp: (sourcePath: string, targetPath: string) => Promise<string>;
  mv: (sourcePath: string, targetPath: string) => Promise<string>;
  readFile: (
    fulaTargetFilename: string,
    localFilename: string
  ) => Promise<string>;
  readFileContent: (path: string) => Promise<string>;

  shutdown: () => Promise<void>;
}

const LINKING_ERROR =
  `The package 'react-native-fula' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const Fula = NativeModules.FulaModule
  ? NativeModules.FulaModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default Fula as FulaNativeModule;
