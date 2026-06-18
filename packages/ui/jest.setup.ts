jest.mock('react-native-unistyles', () => {
  const { defaultLightTheme } = require('./src/theme/theme');

  return {
    useUnistyles: () => ({ theme: defaultLightTheme }),
    StyleSheet: {
      configure: jest.fn(),
      create: (stylesOrFn: unknown) => {
        const styles =
          typeof stylesOrFn === 'function'
            ? stylesOrFn(defaultLightTheme)
            : stylesOrFn;
        return new Proxy(styles as object, {
          get(target, prop) {
            if (prop === 'useVariants') {
              return () => undefined;
            }
            return (target as Record<string | symbol, unknown>)[prop] ?? {};
          },
        });
      },
    },
  };
});

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      ScrollView: View,
      createAnimatedComponent: (component: unknown) => component,
    },
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: (fn: () => object) => fn(),
    useAnimatedScrollHandler: () => () => undefined,
    useAnimatedRef: () => ({ current: null }),
    interpolate: (value: number) => value,
    interpolateColor: () => '#000000',
    withRepeat: (value: unknown) => value,
    withTiming: (value: unknown) => value,
    Easing: { linear: (v: unknown) => v },
    cancelAnimation: () => undefined,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
