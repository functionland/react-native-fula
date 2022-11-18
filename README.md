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

//Initialize the fula client, which creates the libp2p connection
await fula.initJNI('', ''); //identity,storePath

//Store file to the box
const res = await fula.put(ciduint8.toString(), valueString);

//Get file path form the box
const fetchedValue = await fula.get(ciduint8.toString());

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
