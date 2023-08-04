import { NativeModules, Platform } from 'react-native';

interface FulaNativeModule {
  init: (
    identity: string, //Private key of did identity
    storePath: string, //You can leave empty
    bloxAddr: string, //Blox multiadddr needs to be manually entered now
    exchange: string, //set to 'noope' for testing
    autoFlush: boolean, //set to false always unless you know what you are doing. This is to write actions to disk explicitly after each write
    rootCid: string | null, //if you have the latest rootCid you can send it and it generates the private_ref for filesystem
    useRelay: boolean | null, // if true it forces the use of relay
    refresh: boolean // if true it forces to refresh the fula object
  ) => Promise<{ peerId: string; rootCid: string }>;
  newClient: (
    identity: string, //Private key of did identity
    storePath: string, //You can leave empty
    bloxAddr: string, //Blox multiadddr needs to be manually entered now
    exchange: string, //set to 'noope' for testing
    autoFlush: boolean, //set to false always unless you know what you are doing. This is to write actions to disk explicitly after each write
    useRelay: boolean | null, // if true it forces the use of relay
    refresh: boolean // if true it forces to refresh the fula object
  ) => Promise<string>;
  isReady: (filesystemCheck: boolean) => Promise<boolean>;
  logout: (identity: string, storePath: string) => Promise<boolean>;
  checkFailedActions: (retry: boolean, timeout: number) => Promise<boolean>;
  listFailedActions: (cids: string[]) => Promise<string[]>;
  checkConnection: (timeout: number) => Promise<boolean>;
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
  setAuth: (peerId: string, allow: boolean) => Promise<boolean>;

  shutdown: () => Promise<void>;

  testData: (identity: string, bloxAddr: string) => Promise<string>;

  //Blockchain related functions
  // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
  createAccount: (seed: string) => Promise<string>;
  checkAccountExists: (account: string) => Promise<string>;
  // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
  createPool: (seed: string, poolName: string) => Promise<string>;
  listPools: () => Promise<string>;
  // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
  joinPool: (seed: string, poolID: number) => Promise<string>;
  // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
  leavePool: (seed: string, poolID: number) => Promise<string>;
  // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
  cancelPoolJoin: (seed: string, poolID: number) => Promise<string>;
  listPoolJoinRequests: (poolID: number) => Promise<string>;
  votePoolJoinRequest: (
    // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
    seed: string,
    poolID: number,
    account: string,
    accept: boolean
  ) => Promise<string>;
  newReplicationRequest: (
    // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
    seed: string,
    poolID: number,
    replicationFactor: number,
    cid: string
  ) => Promise<string>;
  newStoreRequest: (
    // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
    seed: string,
    poolID: number,
    uploader: string,
    cid: string
  ) => Promise<string>;
  listAvailableReplicationRequests: (poolID: number) => Promise<string>;
  removeReplicationRequest: (
    // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
    seed: string,
    poolID: number,
    cid: string
  ) => Promise<string>;
  removeStorer: (
    // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
    seed: string,
    storer: string,
    poolID: number,
    cid: string
  ) => Promise<string>;
  removeStoredReplication: (
    // SBP-M1 review: create seed on device and store securely, then use PolkadotJS API to sign an extrinsic which can then be submitted to the node/api. The seed should never leave the device. Remove the seed from here.
    seed: string,
    uploader: string,
    poolID: number,
    cid: string
  ) => Promise<string>;

  //Hardware
  bloxFreeSpace: () => Promise<string>;
  wifiRemoveall: () => Promise<string>;
  reboot: () => Promise<string>;
}

const LINKING_ERROR =
  `The package 'react-native-fula/Fula' doesn't seem to be linked. Make sure: \n\n` +
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
