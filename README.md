# react-native-fula

React Native bridge for the [Fula protocols](https://github.com/functionland/go-fula), providing blockchain operations, blox device management, plugin management, and AI interactions via go-fula/mobile.

## Installation

```sh
npm install react-native-fula
```

## Usage

The library exports four modules:

```js
import { fula, blockchain, fxblox, fxAi } from 'react-native-fula';
```

### fula — Client Lifecycle

```js
// Creates a new client and connects to the blox node
const peerId = await fula.newClient(
  identity,    // string — privateKey of DID identity
  storePath,   // string — leave empty for default temp path
  bloxAddr,    // string — blox multiaddr, leave empty for testing without backend
  exchange,    // string — 'noop' for testing without backend, '' for production
  autoFlush,   // boolean — default false, write to disk after each operation
  useRelay,    // boolean — default true, force connection through relay
  refresh      // boolean — default false, force recreate the fula object
);

// init() is a backward-compatibility alias for newClient.
// It calls newClient internally and returns { peerId, rootCid } where rootCid is always "".
```

```js
// Check if fula is initialized
const ready = await fula.isReady(filesystemCheck); // boolean

// Check if client can reach the blox
const connected = await fula.checkConnection(timeout); // timeout in seconds, default 20

// Ping blox peer, returns latency info (tries direct -> relay -> DHT)
const result = await fula.ping(timeout); // { success, successes, avg_rtt_ms, errors }

// Shut down libp2p and datastore
await fula.shutdown();

// Shut down, clear local data
const success = await fula.logout(identity, storePath);
```

### blockchain — On-Chain Operations (via Blox)

These functions communicate with the blockchain through the connected blox node.

```js
// Account management
const { seed, account } = await blockchain.createAccount(seed);
const { account, exists } = await blockchain.checkAccountExists(account);
const funded = await blockchain.accountFund(account);
const accountInfo = await blockchain.getAccount();
const balance = await blockchain.assetsBalance(account, assetId, classId);
const transfer = await blockchain.transferToFula(amount, wallet, chain);

// Pool management
const pool = await blockchain.createPool(seed, poolName);
const pools = await blockchain.listPools();
const joined = await blockchain.joinPool(poolID);
const left = await blockchain.leavePool(poolID);
const joinedChain = await blockchain.joinPoolWithChain(poolID, chainName);
const leftChain = await blockchain.leavePoolWithChain(poolID, chainName);
const cancelled = await blockchain.cancelPoolJoin(poolID);
const requests = await blockchain.listPoolJoinRequests(poolID);
const vote = await blockchain.votePoolJoinRequest(seed, poolID, account, accept);

// Storage & replication
const uploaded = await blockchain.batchUploadManifest(cids, poolId, replicationFactor);
const replicated = await blockchain.replicateInPool(cids, account, poolId);
const stored = await blockchain.newStoreRequest(seed, poolID, uploader, cid);
const available = await blockchain.listAvailableReplicationRequests(poolID);
const removed = await blockchain.removeReplicationRequest(seed, poolID, cid);
const storerRemoved = await blockchain.removeStorer(seed, storer, poolID, cid);
const replicationRemoved = await blockchain.removeStoredReplication(seed, uploader, poolID, cid);

// Blox info
const space = await blockchain.bloxFreeSpace();
```

### fxblox — Device & Plugin Management

Hardware commands and plugin management for blox devices. These are sent over libp2p to the connected blox.

```js
// Hardware commands
const wifiResult = await fxblox.wifiRemoveall();
const rebootResult = await fxblox.reboot();
const partitionResult = await fxblox.partition();
const eraseResult = await fxblox.eraseBlData();

// Diagnostics
const logs = await fxblox.fetchContainerLogs(containerName, tailCount);
const bestTarget = await fxblox.findBestAndTargetInLogs(containerName, tailCount);
const folderSize = await fxblox.getFolderSize(folderPath);
const datastoreSize = await fxblox.getDatastoreSize();
const imageDates = await fxblox.getDockerImageBuildDates();
// Returns: { images: [{ container_name, image_name, image_created, image_digest }] }
const clusterInfo = await fxblox.getClusterInfo();
// Returns: { cluster_peer_id, cluster_peer_name }

// Plugin management
const plugins = await fxblox.listPlugins();
const activePlugins = await fxblox.listActivePlugins();
const installed = await fxblox.installPlugin(pluginName, params);
const uninstalled = await fxblox.uninstallPlugin(pluginName);
const updated = await fxblox.updatePlugin(pluginName);
const status = await fxblox.showPluginStatus(pluginName, lines);
const installStatus = await fxblox.getInstallStatus(pluginName);
const installOutput = await fxblox.getInstallOutput(pluginName, params);
```

### fxAi — AI Chat

Interact with AI models running on the blox device. Responses are streamed.

```js
// Start a chat session — returns a stream ID
const streamID = await fxAi.chatWithAI(aiModel, userMessage);

// Option 1: Collect all chunks into a single response
const fullResponse = await fxAi.fetchChunksUsingIterator(streamID);

// Option 2: Stream chunks with callbacks
const cancel = fxAi.streamChunks(streamID, {
  onChunk: (chunk) => console.log(chunk),
  onComplete: () => console.log('done'),
  onError: (err) => console.error(err),
});
// Call cancel() to stop streaming

// Option 3: Get chunks manually one at a time
const chunk = await fxAi.getChatChunk(streamID);
```

## Testing

Open a cmd or terminal as admin (sudo)

```
corepack enable
```

Then cd to the `react-native-fula` folder (no need for admin, sudo) and run:
```
yarn install
```

to run the example app, run:
```
yarn example android
```

## Other related libraries

| Name | Description |
| --- | --- |
| [Fula Build](https://github.com/functionland/fula-build-aar) | android .aar file for Fula |
| [Fx Fotos](https://github.com/functionland/fx-fotos) | Fx Fotos dApp using react-native-fula |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
