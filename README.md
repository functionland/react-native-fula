# react-native-fula

This package is a React Native bridge to use the [Fula protocols](https://github.com/functionland/go-fula) for blockchain operations, device management, plugin management, and AI interactions via go-fula/mobile.

## Installation

```sh
npm install react-native-fula
```

## Usage

```js
import { fula } from 'react-native-fula'; // Until the library becomes stable, we suggest importing from github directly
```

```js
// Creates a new client. It is better to call this instead of directly calling init
const peerId //returns peerId as string
=  newClient(
  identity: string, //privateKey of did identity
  storePath: string, // leave empty to use the default temp one
  bloxAddr: string, //leave empty for testing without a backend node
  exchange: 'noop'|'', //add noop for testing without a backend
  autoFlush: boolean, //Default to false. Always set to false unless you know what you are doing. explicitly write data to disk after each operation if set to true
  useRelay: boolean, //default to true. If true it forces the connection through relay
  refresh: boolean? //forces the fula object to be recreated. default is false
)
```

```js
//Initialize the fula client, which creates the libp2p connection if newClient is not called before.
// Note that input is not an object e.g. init('','','','noop', false)
{
    peerId, //returns peerId of the created libp2p instance in form of a string
    rootCid, //always empty string (kept for backward compatibility)
}
=
await fula.init(
    identity: string, //bytes of the privateKey of did identity in string format
    storePath: string, // leave empty to use the default temp one
    bloxAddr: string, //leave empty for testing without a backend node
    exchange: 'noop'|'', //add noop for testing without a backend
    autoFlush: boolean, //Default to false. Always set to false unless you know what you are doing. explicitly write data to disk after each operation if set to true
    useRelay: boolean, //default to true. If true it forces the connection through relay
    refresh: boolean? //forces the fula object to be recreated. default is false
);
```

```js
//checks if fula is ready (initialized through newClient or init)
const result //returns true if initialized and false otherwise
=
await fula.isReady(
    filesystemCheck: boolean //Ignored. Kept for backward compatibility.
);

```

```js
//checks if client can reach server
const result //returns true if it can, and false if it cannot
=
await fula.checkConnection(
    timeout: number? //default to 20. Maximum time in seconds that checkConnection waits before throwing an error
);

```

```js
//pings the blox peer and returns latency information
const result //returns JSON with success, successes, avg_rtt_ms, errors
=
await fula.ping(
    timeout: number? //default to 20. Maximum time in seconds
);

```

```js
//shuts down the fula libp2p and datastore
await fula.shutdown();
```

```js
//shuts down and clears the fula client
const result //returns true if successful and false if fails
=
await fula.logout(
    identity: string, //bytes of the privateKey of did identity in string format
    storePath: string, // leave empty to use the default temp one
);

```

## Polkadot type creation

You can follow the documentation here: https://polkadot.js.org/docs/api/examples/promise/typegen

Alternatively you do the below on a Linux or WSL inside the react-native-fula folder:

```bash
curl -H "Content-Type: application/json" -d "{\"id\":\"1\", \"jsonrpc\":\"2.0\", \"method\": \"state_getMetadata\", \"params\":[]}" https://node3.functionyard.fula.network > edgeware.json

yarn build:polkadot
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
