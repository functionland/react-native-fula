import { NativeModules, Platform } from 'react-native';

interface FulaNativeModule {
  initFula: (
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
  listRecentCidsAsString: () => Promise<string[]>;
  clearCidsFromRecent: (cids: string[]) => Promise<boolean>;
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
  createAccount: (seed: string) => Promise<string>;
  checkAccountExists: (account: string) => Promise<string>;
  createPool: (seed: string, poolName: string) => Promise<string>;
  listPools: () => Promise<string>;
  joinPool: (poolID: string) => Promise<string>;
  leavePool: (poolID: number) => Promise<string>;
  cancelPoolJoin: (poolID: number) => Promise<string>;
  listPoolJoinRequests: (poolID: number) => Promise<string>;
  votePoolJoinRequest: (
    seed: string,
    poolID: number,
    account: string,
    accept: boolean
  ) => Promise<string>;
  newReplicationRequest: (
    seed: string,
    poolID: number,
    replicationFactor: number,
    cid: string
  ) => Promise<string>;
  newStoreRequest: (
    seed: string,
    poolID: number,
    uploader: string,
    cid: string
  ) => Promise<string>;
  listAvailableReplicationRequests: (poolID: number) => Promise<string>;
  removeReplicationRequest: (
    seed: string,
    poolID: number,
    cid: string
  ) => Promise<string>;
  removeStorer: (
    seed: string,
    storer: string,
    poolID: number,
    cid: string
  ) => Promise<string>;
  removeStoredReplication: (
    seed: string,
    uploader: string,
    poolID: number,
    cid: string
  ) => Promise<string>;

  //On Blox calls for chain
  //Hardware
  assetsBalance: (
    account: string,
    assetId: string,
    classId: string
  ) => Promise<string>;
  transferToFula: (
    amount: string,
    wallet: string,
    chain: string
  ) => Promise<string>;
  getAccount: () => Promise<string>;


  //Hardware
  eraseBlData: () => Promise<string>;
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
