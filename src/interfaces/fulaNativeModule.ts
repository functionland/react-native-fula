import { NativeModules, Platform } from 'react-native';

interface FulaNativeModule {
  init: (
    identity: string | null, //Private key of did identity
    storePath: string | null, //You can leave empty
    bloxAddr: string, //Blox multiadddr needs to be manually entered now
    exchange: string //set to 'noope' for testing
  ) => Promise<[string, string, string]>;
  get: (key: string) => Promise<string>;
  has: (key: Uint8Array) => Promise<boolean>;
  push: () => Promise<string>;
  put: (content: string, codec: string) => Promise<string>;
  mkdir: (path: string) => Promise<string>;
  writeFileContent: (path: string, content: string) => Promise<string>;
  writeFile: (fulaTargetFilename: string, localFilename: string) => Promise<string>;
  ls: (path: string) => Promise<string>;
  rm: (path: string) => Promise<string>;
  readFile: (fulaTargetFilename: string, localFilename: string) => Promise<string>;
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
