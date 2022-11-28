import 'node-libs-react-native/globals.js';
import './shim.js';
import 'react-native-get-random-values';
import 'text-encoding-polyfill';

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';



AppRegistry.registerComponent(appName, () => App);
