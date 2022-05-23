import type { SchemaProtocol } from '@functionland/file-protocol';
import { NativeModules, Platform } from 'react-native';

interface FulaNativeModule {
  addBox: (boxAddr: string) => Promise<boolean>;
  send: (filePath: string) => Promise<any>;
  receiveFileInfo: (fileId: string) => Promise<SchemaProtocol.Meta>;
  receiveFile: (fileId: string, fileName: string,include64: boolean) => Promise<any>;
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
