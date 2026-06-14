const path = require('node:path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

// Monorepo root (two levels up from apps/example-expo): used by
// react-native-monorepo-config for watchFolders + nodeModulesPaths.
const root = path.resolve(__dirname, '../..');

// Source dir of the workspace library, for resolving its internal `#*` imports.
const uiSrc = path.resolve(__dirname, '../../packages/ui/src');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
});

const { resolveRequest: baseResolveRequest } = config.resolver;

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    resolveRequest: (context, moduleName, platform) => {
      // Resolve the library's internal `#foo` subpath imports against its
      // own source. (Cleanup candidate: enable Metro's package-exports
      // resolution — `config.resolver.unstable_enablePackageExports = true` —
      // so the package.json `imports` field is honored natively and this hack
      // can be removed.)
      const resolvedName = moduleName.startsWith('#')
        ? path.resolve(uiSrc, moduleName.slice(1))
        : moduleName;
      return baseResolveRequest(context, resolvedName, platform);
    },
  },
};
