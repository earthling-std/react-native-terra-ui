import { router } from "expo-router";
import { useWindowDimensions, View } from "react-native";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  Box,
  type ElevationKey,
  Header,
  Screen,
  Surface,
  type SurfaceVariant,
  Text,
} from "react-native-terra-ui";
import { useUnistyles } from "react-native-unistyles";

import { Pager } from "../components/Pager";

const SURFACE_VARIANTS: SurfaceVariant[] = [
  "base",
  "raised",
  "sunken",
  "transparent",
];

const ELEVATIONS: ElevationKey[] = ["none", "sm", "md", "lg", "xl"];

const RADII = ["sm", "md", "lg", "xl", "full"] as const;

const PAGE_TITLES = ["Variants", "Elevation", "Radius", "Stacked"];

function pageStyle(width: number) {
  return {
    flex: 1,
    width,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
}

function DemoCaption(props: { children: string }) {
  return (
    <Text variant="caption" color="content.tertiary">
      {props.children}
    </Text>
  );
}

function VariantsPage(props: { width: number }) {
  const { width } = props;
  const { theme } = useUnistyles();
  const contentWidth = width - theme.layout.screen.margin.x * 2;

  return (
    <View style={pageStyle(width)}>
      <Box gap="4" align="start" style={{ width: contentWidth }}>
        {SURFACE_VARIANTS.map((variant) => (
          <Surface
            key={variant}
            variant={variant}
            p="4"
            gap="1"
            style={{ width: "100%" }}
          >
            <Text variant="title-sm">{variant}</Text>
            <Text variant="body-sm" color="content.secondary">
              {variant === "transparent"
                ? "No fill — shadow does not render"
                : `Maps to surface.${variant}`}
            </Text>
            <DemoCaption>{`variant="${variant}"`}</DemoCaption>
          </Surface>
        ))}
      </Box>
    </View>
  );
}

function ElevationPage(props: { width: number }) {
  const { width } = props;
  const { theme } = useUnistyles();
  const contentWidth = width - theme.layout.screen.margin.x * 2;

  return (
    <View style={pageStyle(width)}>
      <Box gap="4" align="start" style={{ width: contentWidth }}>
        {ELEVATIONS.map((elevation) => (
          <Surface
            key={elevation}
            variant="raised"
            elevation={elevation}
            p="4"
            style={{ width: "100%" }}
          >
            <Text variant="label-md">elevation="{elevation}"</Text>
            <DemoCaption>{`variant="raised" elevation="${elevation}"`}</DemoCaption>
          </Surface>
        ))}
      </Box>
    </View>
  );
}

function RadiusPage(props: { width: number }) {
  const { width } = props;

  return (
    <View style={pageStyle(width)}>
      <Box gap="4" align="center">
        {RADII.map((radius) => (
          <Surface
            key={radius}
            variant="raised"
            elevation="sm"
            radius={radius}
            p="4"
            style={{ minWidth: 160 }}
          >
            <Text variant="label-md">radius="{radius}"</Text>
            <DemoCaption>{`radius="${radius}"`}</DemoCaption>
          </Surface>
        ))}
      </Box>
    </View>
  );
}

function StackedPage(props: { width: number }) {
  const { width } = props;
  const { theme } = useUnistyles();
  const contentWidth = width - theme.layout.screen.margin.x * 2;

  return (
    <View style={pageStyle(width)}>
      <Box gap="4" align="start" style={{ width: contentWidth }}>
        <Surface variant="transparent" p="4" gap="3" style={{ width: "100%" }}>
          <Text variant="label-md">Transparent</Text>
          <Surface variant="base" p="4">
            <Text variant="label-md">Base</Text>
          </Surface>
          <Surface variant="raised" elevation="md" p="4">
            <Text variant="label-md">Raised</Text>
          </Surface>
          <Surface variant="sunken" p="4">
            <Text variant="label-md">Sunken</Text>
          </Surface>
        </Surface>
      </Box>
    </View>
  );
}

export function SurfaceScreen() {
  const { width } = useWindowDimensions();
  const pageProgress = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      pageProgress.value =
        width > 0 ? event.contentOffset.x / width : event.contentOffset.x;
    },
  });

  return (
    <Screen margins={false}>
      <Screen.Header>
        <Header.Title
          dismissAction="back"
          onDismiss={() => router.back()}
          title="Surface"
        />
      </Screen.Header>

      <Screen.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollHandler={scrollHandler}
      >
        <VariantsPage width={width} />
        <ElevationPage width={width} />
        <RadiusPage width={width} />
        <StackedPage width={width} />
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}
