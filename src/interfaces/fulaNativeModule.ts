import { NativeModules, Platform } from 'react-native';
import type { Config } from '../interfaces';

interface FulaNativeModule {
  init: (config: Config) => Promise<boolean>;
  get: (key: Uint8Array[]) => Promise<Uint8Array[]>;
  has: (key: Uint8Array[]) => Promise<boolean>;
  pull: (addr: string, key: Uint8Array[]) => Promise<string>;
  push: (addr: string, key: Uint8Array[]) => Promise<string>;
  put: (key: Uint8Array[], value: Uint8Array[]) => Promise<string>;
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
