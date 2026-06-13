const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

module.exports = (api) => {
  api.cache(true);

  return getConfig(
    {
      presets: ['babel-preset-expo'],
      plugins: [
        // Unistyles v3 requires its Babel plugin. `root` is the example's own
        // source folder; `autoProcessPaths` also processes the linked library
        // source so its StyleSheet.create / useUnistyles calls are transformed.
        [
          'react-native-unistyles/plugin',
          { root: 'src', autoProcessImports: ['react-native-terra-ui'] },
        ],
      ],
    },
    { root, pkg }
  );
};
