const path = require('path');
const pak = require('../package.json');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-transform-class-static-block',
    '@babel/plugin-proposal-export-namespace-from',
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          [pak.name]: path.join(__dirname, '..', pak.source),
        },
      },
    ],
  ],
};
