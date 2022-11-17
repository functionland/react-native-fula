# react-native-fula

This package is a bridge to use the Fula protocols in the react-native

## Installation

```sh
npm install react-native-fula
```

## Usage

```js
import { fula, Types } from 'react-native-fula';

// ...

// Set the config
const config: Types.Config = {
    identity: [], //a keypair that represents the libp2p peerId, or leave empty to create one by the library 
    storePath: '', //A path on the system for storage, or leave empty to use default in [app directory]/fula
  };

//Initialize the fula client, which creates the libp2p connection
await fula.init(config);

//Store file to the box
const res = await fula.put(cid, value);

//Get file path form the box
const fetchedValue = await fula.get(cid);

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
