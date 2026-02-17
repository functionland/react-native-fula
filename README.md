# react-native-fula

React Native bridge for the [Fula protocols](https://github.com/functionland/go-fula), providing blockchain operations, blox device management, plugin management, and AI interactions via go-fula/mobile.

> **TODO:** The Android native dependency (`fula-build-aar`) is currently at **v1.57.3** while the iOS native dependency (`Fula` pod from go-fula/mobile) is at **~> 1.57.2**. These versions need to be aligned in a future release.

## Architecture

```
┌─────────────────────────────────────────────────┐
│              React Native App                    │
├─────────────────────────────────────────────────┤
│   TypeScript API (fula, blockchain, fxblox, fxAi)│
├───────────────────┬─────────────────────────────┤
│  Android (Java)   │       iOS (Swift)           │
│  FulaModule.java  │       FulaModule.swift       │
├───────────────────┼─────────────────────────────┤
│  go-fula/mobile   │       go-fula/mobile        │
│  (JNI via .aar)   │       (Fula framework)      │
└───────────────────┴─────────────────────────────┘
```

The library uses React Native's NativeModules bridge. All heavy operations run on background threads (single-threaded executor on Android, `DispatchQueue.global` on iOS) to avoid blocking the JS thread. Responses are returned as JSON strings from the native layer and parsed into typed objects in TypeScript.

## Installation

```sh
npm install @functionland/react-native-fula
```

### iOS

```sh
cd ios && pod install
```

Requires iOS 15.0+.

### Android

The Android AAR is fetched automatically from [JitPack](https://jitpack.io/#functionland/fula-build-aar). Make sure your project-level `build.gradle` (or the library's own repositories block) includes:

```gradle
maven { url 'https://jitpack.io' }
```

Requires `minSdkVersion` 26+, Java 17.

## Usage

The library exports four namespaced modules:

```js
import { fula, blockchain, fxblox, fxAi } from '@functionland/react-native-fula';
```

### fula -- Client Lifecycle

Manages the Fula client: initialization, connectivity, and shutdown.

```js
// Register lifecycle listeners for proper cleanup on app background/termination
await fula.registerLifecycleListener();

// Create a new client and connect to the blox node
const peerId = await fula.newClient(
  identity,    // string -- base64 private key of DID identity
  storePath,   // string -- local store path (empty string for default)
  bloxAddr,    // string -- blox multiaddr (empty string for testing without backend)
  exchange,    // string -- 'noop' for testing, '' for production
  autoFlush,   // boolean (default: false) -- flush writes to disk after each operation
  useRelay,    // boolean (default: true) -- force connection through relay
  refresh      // boolean (default: false) -- force recreate the fula object
);

// init() is a backward-compatible alias for newClient.
// Returns { peerId, rootCid } where rootCid is always "".
const { peerId, rootCid } = await fula.init(
  identity, storePath, bloxAddr, exchange,
  autoFlush, rootCid, useRelay, refresh
);
```

```js
// Check if fula is initialized (optionally check filesystem too)
const ready = await fula.isReady(filesystemCheck); // default: true

// Check if client can reach the blox
const connected = await fula.checkConnection(timeout); // timeout in seconds, default 20

// Ping blox peer (tries direct -> relay -> DHT fallback)
const result = await fula.ping(timeout); // default 60s
// result: { success: boolean, successes: number, avg_rtt_ms: number, errors: string[] }

// Shut down libp2p and datastore (client must be discarded after this)
await fula.shutdown();

// Shut down and clear all local data
const success = await fula.logout(identity, storePath);
```

### blockchain -- On-Chain Operations

All blockchain operations are relayed through the connected blox node. The client must be initialized first via `fula.newClient()` or `fula.init()`.

#### Account Management

```js
// Check if account exists on-chain
const { account, exists } = await blockchain.checkAccountExists(account);

// Fund an account
const { from, to, amount } = await blockchain.accountFund(account);

// Get current account info
const { account } = await blockchain.getAccount();

// Query asset balance
const { amount } = await blockchain.assetsBalance(account, assetId, classId);

// Transfer tokens to Fula network
const { msg, description } = await blockchain.transferToFula(amount, wallet, chain);
```

#### Pool Management

```js
// List all pools
const { pools } = await blockchain.listPools();
// pools: [{ poolID, creator, poolName, parent, participants, region }]

// Join / leave a pool
const joined = await blockchain.joinPool(poolID);
const left = await blockchain.leavePool(poolID);

// Join / leave with a specific blockchain
const joined = await blockchain.joinPoolWithChain(poolID, chainName);
const left = await blockchain.leavePoolWithChain(poolID, chainName);

// Cancel a pending join request
const cancelled = await blockchain.cancelPoolJoin(poolID);

// List pending join requests for a pool
const { poolRequests } = await blockchain.listPoolJoinRequests(poolID);
// poolRequests: [{ poolID, account, voted, positiveVotes, peerID }]
```

#### Storage and Replication

```js
// Upload manifest for multiple CIDs
const { storer, cid, pool_id } = await blockchain.batchUploadManifest(
  cids, poolId, replicationFactor
);

// Replicate content in pool
const replicatedCids = await blockchain.replicateInPool(cids, account, poolId);

// List available replication requests
const available = await blockchain.listAvailableReplicationRequests(poolID);
```

#### Blox Info

```js
// Get free space on blox device
const { size, avail, used, used_percentage } = await blockchain.bloxFreeSpace();
```

### fxblox -- Device and Plugin Management

Hardware commands, diagnostics, and plugin management for blox devices. Commands are sent over libp2p to the connected blox.

#### Hardware Commands

```js
const { status, msg } = await fxblox.wifiRemoveall();  // Remove all saved WiFi connections
const { status, msg } = await fxblox.reboot();          // Reboot device
const { status, msg } = await fxblox.partition();        // Partition device storage
const { status, msg } = await fxblox.eraseBlData();      // Erase all blox local data
```

#### Diagnostics

```js
// Fetch Docker container logs
const { status, msg } = await fxblox.fetchContainerLogs(containerName, tailCount);

// Analyze logs for best/target peers
const { best, target, err } = await fxblox.findBestAndTargetInLogs(containerName, tailCount);

// Storage information
const { folder_path, size } = await fxblox.getFolderSize(folderPath);
const { size, storage_max, count, folder_path, version } = await fxblox.getDatastoreSize();

// Docker image info
const { images } = await fxblox.getDockerImageBuildDates();
// images: [{ container_name, image_name, image_created, image_digest }]

// IPFS cluster info
const { cluster_peer_id, cluster_peer_name } = await fxblox.getClusterInfo();
```

#### Plugin Management

```js
// List all available plugins
const { plugins } = await fxblox.listPlugins();
// plugins: [{ name, description, version, usage, rewards, socials, requiredInputs, approved, installed }]

// List currently active plugins
const { msg, status } = await fxblox.listActivePlugins();

// Install / uninstall / update a plugin
const installed = await fxblox.installPlugin(pluginName, params);
const uninstalled = await fxblox.uninstallPlugin(pluginName);
const updated = await fxblox.updatePlugin(pluginName);

// Check plugin status
const { status } = await fxblox.showPluginStatus(pluginName, lines);
const { status, msg } = await fxblox.getInstallStatus(pluginName);
const { status, msg } = await fxblox.getInstallOutput(pluginName, params);
```

### fxAi -- AI Chat

Interact with AI models running on the blox device. Responses are streamed over libp2p.

```js
// Start a chat session -- returns a stream ID
const streamID = await fxAi.chatWithAI(aiModel, userMessage);

// Option 1: Collect all chunks into a single response
const fullResponse = await fxAi.fetchChunksUsingIterator(streamID);

// Option 2: Stream chunks with callbacks
const cancel = fxAi.streamChunks(streamID, {
  onChunk: (chunk) => console.log(chunk),
  onComplete: () => console.log('done'),
  onError: (err) => console.error(err),
});
// Call cancel() to stop listening

// Option 3: Get chunks manually one at a time
const chunk = await fxAi.getChatChunk(streamID);
```

## Deprecated / Dead Code

The following methods still exist in the TypeScript layer (`src/protocols/blockchain.ts` and `src/interfaces/fulaNativeModule.ts`) but have **no native implementation** on either Android or iOS. They were removed from native modules when direct chain/polkadot APIs were dropped. Calling them will result in a runtime error:

- `blockchain.createAccount(seed)` -- use blox-side account creation instead
- `blockchain.createPool(seed, poolName)` -- use blox-side pool creation instead
- `blockchain.votePoolJoinRequest(seed, poolID, account, accept)`
- `blockchain.newStoreRequest(seed, poolID, uploader, cid)`
- `blockchain.removeReplicationRequest(seed, poolID, cid)`
- `blockchain.removeStorer(seed, storer, poolID, cid)`
- `blockchain.removeStoredReplication(seed, uploader, poolID, cid)`

> **TODO:** Clean up the TypeScript layer to remove these dead methods and their associated types (`SeededResponse`, `PoolCreateResponse`, `PoolVoteResponse`).

## Native Dependency Versions

| Platform | Dependency | Version | Source |
| --- | --- | --- | --- |
| Android | `com.github.functionland:fula-build-aar` | v1.57.3 | [JitPack](https://jitpack.io/#functionland/fula-build-aar) |
| iOS | `Fula` (go-fula/mobile) | ~> 1.57.2 | [CocoaPods](https://cocoapods.org/) |

## Development

### Prerequisites

- Node >= 16
- Yarn 1.22+
- For Android: JDK 17, Android SDK with NDK 27.1.12297006
- For iOS: Xcode with iOS 15.0+ SDK

### Setup

```sh
# Enable corepack (run as admin/sudo)
corepack enable

# Install dependencies
yarn install

# Install iOS pods (macOS only)
yarn example pods
```

### Running the Example App

```sh
# Android
yarn example android

# iOS
yarn example ios
```

### Scripts

| Command | Description |
| --- | --- |
| `yarn install` | Install dependencies |
| `yarn example android` | Run example app on Android |
| `yarn example ios` | Run example app on iOS |
| `yarn test` | Run Jest tests |
| `yarn typecheck` | TypeScript type checking |
| `yarn lint` | ESLint + Prettier |
| `yarn build:android` | Build Android debug APK |
| `yarn build:ios` | Build iOS for simulator |

## Project Structure

```
src/
  index.tsx                     # Entry point -- re-exports all modules
  interfaces/
    fulaNativeModule.ts         # NativeModules bridge interface
  protocols/
    fula.ts                     # Client lifecycle (init, connect, shutdown)
    blockchain.ts               # On-chain operations (accounts, pools, storage)
    fxblox.ts                   # Device and plugin management
    fx-ai.ts                    # AI chat streaming
  types/
    blockchain.ts               # Blockchain response types
    fxblox.ts                   # Fxblox response types
android/
  src/main/java/land/fx/fula/
    FulaModule.java             # Android native module
    FulaPackage.java            # React Native package registration
    ThreadUtils.java            # Single-threaded executor for background work
ios/
  Fula.swift                    # iOS native module (Swift)
  Fula.mm                       # Objective-C++ bridge declarations
  Extensions.swift              # String/Data/UInt8 utility extensions
example/                        # Example React Native app
```

## Related Libraries

| Name | Description |
| --- | --- |
| [go-fula](https://github.com/functionland/go-fula) | Core Fula protocol implementation in Go |
| [fula-build-aar](https://github.com/functionland/fula-build-aar) | Android .aar build of go-fula/mobile |
| [Fx Fotos](https://github.com/functionland/fx-fotos) | Photo dApp built with react-native-fula |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
