import { NativeModules, Platform } from 'react-native';
import type { Config } from '../interfaces';

interface FulaNativeModule {
  init: (config: Config) => Promise<boolean>;
  get: (key: string) => Promise<string>;
  has: (key: string) => Promise<boolean>;
  pull: (addr: string, key: string) => Promise<string>;
  push: (addr: string, key: string) => Promise<string>;
  put: (key: string, value: string) => Promise<string>;
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
