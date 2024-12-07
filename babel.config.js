module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-transform-class-static-block',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          '@functionland/react-native-fula': './src',
        },
      },
    ],
  ],
};
