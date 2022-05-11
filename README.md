# react-native-fula

This package is a bridge to use the Fula libp2p protocols in the react-native

## Installation

```sh
npm install react-native-fula
```

## Usage

```js
import { file, fula } from 'react-native-fula';

// ...

//Connect to the box
const status = await fula.connect("[Your Box address]");

//Store file to the box
const cid = await file.send(decodeURI("[File path]"));

//Get file path form the box
const filepath = await file.receive(cid);

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
