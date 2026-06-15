const path = require('node:path');
const { getDefaultConfig } = require('@expo/metro-config');

const projectRoot = __dirname;
const uiSrc = path.resolve(projectRoot, '../../packages/ui/src');

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
  const resolvedName = moduleName.startsWith('#')
    ? path.resolve(uiSrc, moduleName.slice(1))
    : moduleName;

  if (typeof customResolveRequest === 'function') {
    return customResolveRequest(context, resolvedName, platform);
  }

  return context.resolveRequest(context, resolvedName, platform);
};

module.exports = config;
