const path = require('node:path');
const { getDefaultConfig } = require('@expo/metro-config');

const projectRoot = __dirname;
const uiPackageRoot = path.resolve(projectRoot, '../../packages/ui');
const uiSrc = path.resolve(uiPackageRoot, 'src');

/**
 * Metro configuration
 * https://docs.expo.dev/guides/monorepos/
 *
 * Use Expo's built-in monorepo support (SDK 52+). Avoid watching the entire
 * repo root — that triggers Watchman recrawls and breaks Fast Refresh.
 *
 * @type {import('expo/metro-config').MetroConfig}
 */
const config = getDefaultConfig(projectRoot);

const { resolveRequest: customResolveRequest } = config.resolver;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  let resolvedName = moduleName;

  if (moduleName === 'react-native-terra-ui') {
    resolvedName = path.join(uiSrc, 'index.tsx');
  } else if (moduleName === 'react-native-terra-ui/theme') {
    resolvedName = path.join(uiSrc, 'theme/index.ts');
  } else if (moduleName.startsWith('#')) {
    resolvedName = path.resolve(uiSrc, moduleName.slice(1));
  }

  if (typeof customResolveRequest === 'function') {
    return customResolveRequest(context, resolvedName, platform);
  }

  return context.resolveRequest(context, resolvedName, platform);
};

module.exports = config;
