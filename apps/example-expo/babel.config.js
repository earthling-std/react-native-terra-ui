const path = require('node:path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../../packages/ui/package.json');

// `root` is the library package root (packages/ui), used by bob's babel-config
// to alias `react-native-terra-ui` to its source during development.
const root = path.resolve(__dirname, '../../packages/ui');

module.exports = (api) => {
  api.cache(true);

  return getConfig(
    {
      presets: ['babel-preset-expo'],
      plugins: [
        // Unistyles v3 requires its Babel plugin. Use an absolute root so file
        // watching and transforms stay scoped to the example app source tree.
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
    },
    { root, pkg }
  );
};
