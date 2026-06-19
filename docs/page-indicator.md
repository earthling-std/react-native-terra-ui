# PageIndicator

Dot and pill pager indicators with smooth motion. Both variants share the same core props; dot adds loading and vertical layout.

## Shared props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | — | Number of pages |
| `current` | `number \| SharedValue<number>` | `0` | Active index or scroll-linked progress |
| `duration` | `number` | `420` | Animation duration for discrete index changes |
| `activeColor` | `ColorToken` | `content.primary` | Active page color |
| `inactiveColor` | `ColorToken` | `content.disabled` | Inactive page color |
| `vertical` | `boolean` | `false` | Stack dots vertically |
| `style` | `ViewStyle` | — | Wrapper style |

`current` runs from `0` (first page) to `count - 1` (last page). Pass a `SharedValue` to sync with a pager scroll position.

## Dot variant

```tsx
import { useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { DotIndicator, PageIndicator } from 'react-native-terra-ui';

function MyTabs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <PageIndicator count={4} variant="dot" current={activeIndex} loading />
  );
}

function ScrollSynced() {
  const current = useSharedValue(0);

  return <DotIndicator count={4} current={current} vertical />;
}
```

Dot-only props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loadingColor` | `ColorToken` | `content.disabled` | Loading ring color |
| `loading` | `boolean` | `false` | Show loading ring on active dot |

## Pill variant (default)

```tsx
import { useWindowDimensions } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { PageIndicator, PillIndicator, Screen } from 'react-native-terra-ui';

function MyCarouselScreen() {
  const { width } = useWindowDimensions();
  const current = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      current.value =
        width > 0 ? event.contentOffset.x / width : event.contentOffset.x;
    },
  });

  return (
    <Screen margins={false}>
      <Screen.ScrollView horizontal pagingEnabled scrollHandler={scrollHandler}>
        <PageOne width={width} />
        <PageTwo width={width} />
      </Screen.ScrollView>

      <PageIndicator count={2} current={current} />
    </Screen>
  );
}
```

When `count > 6`, the pill variant shows six dots and slides the row to keep the active page centered. The dot variant always shows all dots.

## Showcase

Interactive demos: run `yarn showcase start` and open **Page Indicator** in the gallery.
