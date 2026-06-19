---
name: terra-ui-showcase
description: >-
  Create or migrate Terra UI showcase-expo component screens using the paged
  horizontal demo pattern (Screen + Pager footer). Use when adding a new
  component showcase, converting ScreenShell/PropDemo screens to paged demos,
  or updating apps/showcase-expo/src/screens/*Screen.tsx.
---

# Terra UI Showcase (Paged Demo Screens)

## When to use this skill

Use for **showcase-expo component explorer screens** — not for library component implementation.

| Approach | Use when |
|----------|----------|
| **This skill** | Agent should build/migrate a paged `{Component}Screen.tsx` |
| **Cursor rule** | Always-on repo-wide style — too heavy for this workflow |
| **README / docs** | Human onboarding only — agent won't reliably follow |

## Reference screens

Copy structure from these (newest / canonical):

- `apps/showcase-expo/src/screens/SpinnerScreen.tsx` — minimal 2-page layout
- `apps/showcase-expo/src/screens/IconScreen.tsx` — 4-page catalog
- `apps/showcase-expo/src/screens/ButtonScreen.tsx` — variants, sizes, states, icons
- `apps/showcase-expo/src/screens/PageIndicatorScreen.tsx` — interactive demos per page

Shared footer: `apps/showcase-expo/src/components/Pager.tsx`

## Screen shell (required)

Replace `ScreenShell` + `DemoSection` + `PropDemo` with:

```tsx
<Screen margins={false}>
  <Screen.Header>
    <Header.Title
      dismissAction="back"
      onDismiss={() => router.back()}
      title="Human Title"  // e.g. "Page Indicator", not "PageIndicator"
    />
  </Screen.Header>

  <Screen.ScrollView
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    scrollHandler={scrollHandler}
  >
    <FooPage width={width} />
    <BarPage width={width} />
  </Screen.ScrollView>

  <Pager titles={PAGE_TITLES} progress={pageProgress} />
</Screen>
```

Wire scroll progress:

```tsx
const { width } = useWindowDimensions();
const pageProgress = useSharedValue(0);
const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    pageProgress.value =
      width > 0 ? event.contentOffset.x / width : event.contentOffset.x;
  },
});
```

## Page components

Each swipe page is a function component `{ width: number }`:

```tsx
function pageStyle(width: number) {
  return {
    flex: 1,
    width,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}

function SizesPage(props: { width: number }) {
  const { width } = props;
  return (
    <View style={pageStyle(width)}>
      {/* demo content */}
    </View>
  );
}
```

`PAGE_TITLES` length **must equal** the number of page components. Use short Title Case labels (`Variants`, `Sizes`, `Pill`, `Dot`).

## Layout recipes

Pick layouts that match the prop being demonstrated:

| Demo type | Layout |
|-----------|--------|
| **Size presets** | `HStack gap="6" align="center"` — 3 items centered horizontally |
| **Color / token list** | `VStack gap="6" align="start"` — row of sample + caption |
| **Variant catalog** | `VStack gap="3"` or `gap="4"` — one sample per row |
| **Full-width blocks** | `contentWidth = width - theme.layout.screen.margin.x * 2` on `VStack` |
| **Inline / toolbar** | `HStack gap="2"` with `fullWidth={false}` on `Button` |
| **Interactive** | Local `useState` + `PageIndicator page={index}` per page (don't share across swipe pages) |

## Gallery registration

Add or update in `apps/showcase-expo/src/screens/GalleryScreen.tsx`:

```tsx
{ href: '/my-component', label: 'Human Title' },
```

Route file: `apps/showcase-expo/src/app/{kebab-name}.tsx` re-exports the screen.

## Title naming

- **Gallery label** and **Header.Title**: spaced words — `Page Indicator`, `Spinner`
- **File names**: PascalCase — `PageIndicatorScreen.tsx`
- **Route path**: kebab-case — `/page-indicator`

## Button showcase notes

`Button` defaults to `fullWidth={true}`. Opt out explicitly for shrink-wrap demos:

- Variant / size comparison pages → `fullWidth={false}`
- States page: full-width loading/disabled; inline row for Cancel/Save pair
- Wrap in `<View>` if centering shrink-wrap buttons in `VStack align="center"` (Button uses `alignSelf: 'flex-start'`)

## Migration checklist

When converting an old `ScreenShell` screen:

```
- [ ] Create paged screen file in apps/showcase-expo/src/screens/
- [ ] Group old DemoSections into 2–4 swipe pages (one concern per page)
- [ ] Drop PropDemo code strings unless user asks to keep them
- [ ] Use human title in header + gallery
- [ ] Verify PAGE_TITLES matches page count
- [ ] Keep route app/*.tsx export unchanged or add new route
- [ ] Run lints on edited files
```

## Do not

- Use `ScreenShell`, `DemoSection`, or `PropDemo` for new paged showcases
- Nest the showcase `Pager` progress with inner demo `PageIndicator` unless intentional (Page Indicator screen is the exception)
- Use camelCase component names as user-facing titles (`PageIndicator` → `Page Indicator`)

## Optional: Typography-style screens

`TypographyScreen.tsx` uses the same pager but **without** titling every demo axis — use it when one page is a long scroll sample (article) rather than a centered prop grid.
