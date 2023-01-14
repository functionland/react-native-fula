import { NativeModules, Platform } from 'react-native';

interface BlockchainNativeModule {

  createAccount: (seed: string) => Promise<string>;
  checkAccountExists: (account: string) => Promise<string>;
  createPool: (seed: string, poolName: string) => Promise<string>;
  listPools: () => Promise<string>;
  joinPool: (seed: string, poolID: number) => Promise<string>;
  leavePool: (seed: string, poolID: number) => Promise<string>;
  cancelPoolJoin: (seed: string, poolID: number) => Promise<string>;
  listPoolJoinRequests: (poolID: number) => Promise<string>;
  votePoolJoinRequest: (seed: string, poolID: number, account: string, accept: boolean) => Promise<string>;
  newReplicationRequest: (seed: string, poolID: number, replicationFactor: number, cid: string) => Promise<string>;
  newStoreRequest: (seed: string, poolID: number, uploader: string, cid: string) => Promise<string>;
  listAvailableReplicationRequests: (poolID: number) => Promise<string>;
  removeReplicationRequest: (seed: string, poolID: number, cid: string) => Promise<string>;
  removeStorer: (seed: string, storer: string, poolID: number, cid: string) => Promise<string>;
  removeStoredReplication: (seed: string, uploader: string, poolID: number, cid: string) => Promise<string>;

}

const LINKING_ERROR =
  `The package 'react-native-fula/BlockchainModule' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const Blockchain = NativeModules.BlockchainModule
  ? NativeModules.BlockchainModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default Blockchain as BlockchainNativeModule;
