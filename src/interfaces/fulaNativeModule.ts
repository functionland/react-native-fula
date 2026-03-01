import { NativeModules, Platform } from 'react-native';

interface FulaNativeModule {
  registerLifecycleListener: () => Promise<void>;
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
  checkConnection: (timeout: number) => Promise<boolean>;
  ping: (timeout: number) => Promise<string>;

  shutdown: () => Promise<void>;

  //Blockchain related functions
  createAccount: (seed: string) => Promise<string>;
  checkAccountExists: (account: string) => Promise<string>;
  accountFund: (account: string) => Promise<string>;
  createPool: (seed: string, poolName: string) => Promise<string>;
  listPools: () => Promise<string>;
  joinPool: (poolID: string) => Promise<string>;
  leavePool: (poolID: string) => Promise<string>;
  joinPoolWithChain: (poolID: string, chainName: string) => Promise<string>;
  leavePoolWithChain: (poolID: string, chainName: string) => Promise<string>;
  cancelPoolJoin: (poolID: string) => Promise<string>;
  listPoolJoinRequests: (poolID: string) => Promise<string>;
  votePoolJoinRequest: (
    seed: string,
    poolID: number,
    account: string,
    accept: boolean
  ) => Promise<string>;
  batchUploadManifest: (
    cid: string[],
    poolID: string,
    replicationFactor: string
  ) => Promise<string>;
  replicateInPool: (
    cid: string[],
    account: string,
    poolID: string
  ) => Promise<string>;
  newStoreRequest: (
    seed: string,
    poolID: number,
    uploader: string,
    cid: string
  ) => Promise<string>;
  listAvailableReplicationRequests: (poolID: string) => Promise<string>;
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
  fetchContainerLogs: (
    containerName: string,
    tailCount: string
  ) => Promise<string>;
  findBestAndTargetInLogs: (
    containerName: string,
    tailCount: string
  ) => Promise<string>;
  getFolderSize: (folderPath: string) => Promise<string>;
  getDatastoreSize: () => Promise<string>;
  bloxFreeSpace: () => Promise<string>;
  wifiRemoveall: () => Promise<string>;
  reboot: () => Promise<string>;
  partition: () => Promise<string>;
  getDockerImageBuildDates: () => Promise<string>;
  getClusterInfo: () => Promise<string>;

  // Plugin related functions
  listPlugins: () => Promise<string>;
  listActivePlugins: () => Promise<string>;
  installPlugin: (pluginName: string, params: string) => Promise<string>;
  uninstallPlugin: (pluginName: string) => Promise<string>;
  showPluginStatus: (pluginName: string, lines: number) => Promise<string>;
  getInstallOutput: (pluginName: string, params: string) => Promise<string>;
  getInstallStatus: (pluginName: string) => Promise<string>;
  updatePlugin: (pluginName: string) => Promise<string>;

  //AI
  chatWithAI: (aiModel: string, userMessage: string) => Promise<string>;
  getChatChunk: (streamID: string) => Promise<string>;
  streamChunks: (streamID: string) => Promise<void>;

  // Auto-pin
  autoPinPair: (token: string, endpoint: string) => Promise<string>;
  autoPinRefresh: (token: string) => Promise<string>;
  autoPinUnpair: () => Promise<string>;
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
