# react-native-fula

This package is a bridge to use the Fula protocols in the react-native. It uses WNFS to create the merkle dag from files and folders and transfer teh DAG using Graphsync to the nodes.

## Installation

```sh
npm install react-native-fula
```

## Usage

```js
import { fula } from 'react-native-fula';

// ...

//Initialize the fula client, which creates the libp2p connection
[peerId, cid, private_ref] = await fula.init('', ''); //private key of user's did which will be used to encrypt and store private key of generated peerId for this app, storePath which you can leave empty

//Creates a Folder
const cid = await fula.mkdir(valueString);

//Write a file to the pth
const cid = await fula.writeFile(valueString, ciduint8.toString());

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
