const path = require('node:path');

module.exports = (api) => {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Unistyles v3 requires its Babel plugin. Use an absolute root so file
      // watching and transforms stay scoped to the showcase app source tree.
      [
        'react-native-unistyles/plugin',
        {
          root: path.resolve(__dirname, 'src'),
          autoProcessImports: ['react-native-terra-ui'],
        },
      ],
      // Reanimated 4 worklets transform — required by Terra UI's Screen
      // (scroll-linked headers). MUST be the last plugin in the list.
      'react-native-worklets/plugin',
    ],
  };
};
