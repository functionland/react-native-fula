import { NativeModules, Platform } from 'react-native';
import type { FileMeta } from '.';

interface FulaNativeModule {
  addBox: (boxAddr: string) => Promise<boolean>;
  send: (filePath: string) => Promise<string>;
  receiveFileInfo: (fileId: string) => Promise<FileMeta>;
  receiveFile: (fileId: string, fileName: string) => Promise<string>;
  receiveDecryptFile: (fileRef: string, fileName: string) => Promise<string>;
  encryptSend: (filePath: string) => Promise<string>;
  graphQL: (query: string, variableValues: string) => Promise<any>;
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
