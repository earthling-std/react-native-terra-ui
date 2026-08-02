jest.mock('react-native-unistyles', () => {
  const { defaultLightTheme } = require('./src/theme/theme');

  // Minimal stand-in for `UnistylesMiniRuntime` — the second arg passed to a
  // `StyleSheet.create((theme, runtime) => ...)` factory and returned as
  // `rt` from `useUnistyles()`.
  const mockRuntime = {
    insets: { top: 0, bottom: 0, left: 0, right: 0, ime: 0 },
    colorScheme: 'light',
    themeName: 'light',
    breakpoint: undefined,
    contentSizeCategory: 'normal',
    orientation: 'portrait',
    pixelRatio: 1,
    fontScale: 1,
    rtl: false,
    isLandscape: false,
    isPortrait: true,
  };

  // Mirrors react-native-unistyles' own `variants`/`compoundVariants`
  // resolution (see its `src/web/variants.ts`), so tests can assert on the
  // actual resolved style rather than the raw, unresolved config.
  function resolveVariants(
    value: unknown,
    selected: Record<string, unknown>
  ): Record<string, unknown> {
    if (!value || typeof value !== 'object') return {};
    const { variants, compoundVariants, ...rest } = value as Record<
      string,
      unknown
    > & {
      variants?: Record<string, Record<string, unknown>>;
      compoundVariants?: Array<
        Record<string, unknown> & { styles: Record<string, unknown> }
      >;
    };

    let merged = { ...rest };

    if (variants) {
      for (const [variantName, options] of Object.entries(variants)) {
        const selectedValue = selected[variantName];
        const variantStyle =
          options[selectedValue as string] ?? options.default;
        if (variantStyle) merged = { ...merged, ...variantStyle };
      }
    }

    if (compoundVariants) {
      for (const compound of compoundVariants) {
        const { styles: compoundStyles, ...conditions } = compound;
        const matches = Object.entries(conditions).every(
          ([key, condValue]) => String(selected[key]) === String(condValue)
        );
        if (matches) merged = { ...merged, ...compoundStyles };
      }
    }

    return merged;
  }

  return {
    useUnistyles: () => ({ theme: defaultLightTheme, rt: mockRuntime }),
    StyleSheet: {
      configure: jest.fn(),
      create: (stylesOrFn: unknown) => {
        const styles =
          typeof stylesOrFn === 'function'
            ? stylesOrFn(defaultLightTheme, mockRuntime)
            : stylesOrFn;

        let selectedVariants: Record<string, unknown> = {};

        return new Proxy(styles as object, {
          get(target, prop) {
            if (prop === 'useVariants') {
              return (variants: Record<string, unknown>) => {
                selectedVariants = variants ?? {};
              };
            }
            const value = (target as Record<string | symbol, unknown>)[prop];
            if (typeof value === 'function') return value;
            return resolveVariants(value, selectedVariants);
          },
        });
      },
    },
  };
});

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const animationBuilder = {
    duration: () => animationBuilder,
    easing: () => animationBuilder,
    mass: () => animationBuilder,
    springify: () => animationBuilder,
  };

  return {
    __esModule: true,
    default: {
      View,
      ScrollView: View,
      createAnimatedComponent: (component: unknown) => component,
    },
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: (fn: () => object) => fn(),
    useAnimatedProps: (fn: () => object) => fn(),
    useAnimatedScrollHandler: () => () => undefined,
    useAnimatedRef: () => ({ current: null }),
    useFrameCallback: () => ({ setActive: () => undefined }),
    interpolate: (value: number) => value,
    interpolateColor: () => '#000000',
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    withRepeat: (value: unknown) => value,
    withSpring: (value: unknown) => value,
    withTiming: (value: unknown) => value,
    Keyframe: function Keyframe() {
      return animationBuilder;
    },
    FadeInDown: animationBuilder,
    FadeInUp: animationBuilder,
    FadeOutDown: animationBuilder,
    FadeOutUp: animationBuilder,
    Easing: {
      linear: (v: unknown) => v,
      out: (fn: unknown) => fn,
      cubic: (v: unknown) => v,
      bezier: () => (v: unknown) => v,
    },
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
