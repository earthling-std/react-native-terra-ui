import { router } from 'expo-router';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Header,
  Screen,
  Text,
  type TextVariant,
  VStack,
} from 'react-native-terra-ui';

import { Pager } from '../components/Pager';

const TEXT_VARIANTS: TextVariant[] = [
  'display-lg',
  'display-md',
  'display-sm',
  'headline-lg',
  'headline-md',
  'headline-sm',
  'title-lg',
  'title-md',
  'title-sm',
  'body-lg',
  'body-md',
  'body-sm',
  'label-lg',
  'label-md',
  'label-sm',
  'caption',
];

const PAGE_COUNT = 2;
const isArticleLoading = true;

const SIZE_LABELS: Record<string, string> = {
  lg: 'Large',
  md: 'Medium',
  sm: 'Small',
};

function variantLabel(variant: TextVariant): string {
  const [word = variant, ...rest] = variant.split('-');
  if (rest.length === 0) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const size = rest[rest.length - 1] ?? '';
  const role = [word, ...rest.slice(0, -1)]
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return `${role} ${SIZE_LABELS[size] ?? size}`;
}

function VariantCatalogPage(props: { width: number }) {
  const { width } = props;

  return (
    <View
      style={{
        flex: 1,
        width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
      }}
    >
      <VStack gap="2" align="center">
        {TEXT_VARIANTS.map((variant) => (
          <Text key={variant} variant={variant}>
            {variantLabel(variant)}
          </Text>
        ))}
      </VStack>
    </View>
  );
}

function ArticleSamplePage(props: { width: number }) {
  const { width } = props;

  return (
    <ScrollView
      style={{ width }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      <VStack gap="4">
        <VStack gap="1">
          <Text variant="label-sm" color="content.tertiary">
            MOBILE DESIGN
          </Text>
          <Text variant="h1">Reading on Small Screens</Text>
          <VStack gap="1">
            <Text variant="label-md" color="content.secondary">
              Mira Stone, Design Systems
            </Text>
            <Text variant="caption" color="content.tertiary">
              Published June 16, 2026 · 6 min read
            </Text>
          </VStack>
        </VStack>

        <VStack gap="3">
          <Text variant="h2">A page needs a visible outline</Text>
          <Text variant="body-md">
            Readers usually scan before they commit. A good article gives them a
            clear title, a short deck, a byline, and section headings that make
            the shape of the story visible before the first full paragraph.
          </Text>
          <Text variant="body-md">
            On mobile, that outline matters even more. The screen shows only a
            few blocks at once, so each heading has to tell the reader what kind
            of content is coming next.
          </Text>
        </VStack>

        <View
          style={{
            borderLeftWidth: 3,
            borderLeftColor: '#94a3b8',
            paddingLeft: 14,
          }}
        >
          <VStack gap="2">
            <Text variant="body-md">
              Structure is what lets the typography become quiet.
            </Text>
          </VStack>
        </View>

        <VStack gap="3">
          <Text variant="h2">What changes on mobile</Text>
          <Text variant="body-md">
            Desktop layouts can rely on columns, sidebars, and large visible
            regions. A phone mostly has one column, so typography does more of
            the navigation work.
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: '#cbd5e1',
              borderRadius: 8,
              padding: 14,
            }}
          >
            <VStack gap="2">
              <Text variant="label-lg" color="content.secondary">
                Editor's note
              </Text>
              <Text variant="title-lg">Use display text once</Text>
              <Text variant="body-sm" color="content.secondary">
                Large type works best as an entry point, a pull quote, or a
                featured number. Repeating it inside the body makes the article
                feel fragmented.
              </Text>
            </VStack>
          </View>

          <VStack gap="2">
            <Text variant="h3">When hierarchy disappears</Text>
            <Text variant="body-md">
              If every heading has the same size and weight, readers have to
              infer structure from spacing alone. That slows scanning and makes
              long screens feel heavier than they are.
            </Text>
          </VStack>

          <VStack gap="2">
            <Text variant="h3">A better pattern</Text>
            <Text variant="body-md">
              Use headline styles for the article outline, title styles for
              local blocks, body styles for the argument, and labels for small
              signals like category, author, or status.
            </Text>
          </VStack>
        </VStack>

        <VStack gap="3">
          <Text variant="h2">Reading checklist</Text>

          <VStack gap="1">
            <Text variant="h3">1. Lead with meaning</Text>
            <Text variant="body-md">
              The title should name the subject plainly. Decorative language can
              come later, once the reader understands where they are.
            </Text>
          </VStack>

          <VStack gap="2">
            <Text variant="h3">2. Make sections obvious</Text>
            <Text variant="body-md">
              Each heading should announce a useful change: a new idea, a
              supporting example, a quote, a note, or a summary.
            </Text>
          </VStack>

          <VStack gap="2">
            <Text variant="h3">3. Keep support text supportive</Text>
            <Text variant="body-md">
              Metadata, notes, and captions should help the reader, not compete
              with the main paragraph.
            </Text>
          </VStack>
        </VStack>

        <View
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: '#cbd5e1',
            paddingVertical: 14,
          }}
        >
          <VStack gap="3">
            <Text variant="label-sm" color="content.tertiary">
              QUICK FACT
            </Text>
            <Text variant="h1">3 levels</Text>
            <Text variant="title-sm">
              Most article sections need only a few.
            </Text>
            <Text variant="body-sm" color="content.secondary">
              A primary heading, a local subheading, and paragraph text are
              usually enough for a readable mobile story.
            </Text>
          </VStack>
        </View>

        <VStack gap="3">
          <Text variant="headline-sm">Related reading</Text>
          <VStack gap="1">
            <Text variant="title-sm">Designing article previews</Text>
            <Text variant="body-sm" color="content.secondary">
              How summaries, labels, and thumbnails shape the first tap.
            </Text>
          </VStack>
          <VStack gap="1">
            <Text variant="title-sm">Choosing text styles for apps</Text>
            <Text variant="body-sm" color="content.secondary">
              A practical guide to display, headline, title, body, and label
              roles.
            </Text>
          </VStack>
        </VStack>

        <VStack gap="2">
          <Text variant="label-sm" color="content.tertiary">
            PHOTO CAPTION
          </Text>
          <Text variant="body-md">
            Morning light over a phone screen during a commuter reading test.
          </Text>
          <Text variant="caption" color="content.tertiary">
            Captions explain media without interrupting the article flow.
          </Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

export function TypographyScreen() {
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
          bg="transparent"
          dismissAction="back"
          onDismiss={() => router.back()}
          title="Typography"
        />
      </Screen.Header>

      <Screen.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        scrollHandler={scrollHandler}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VariantCatalogPage width={width} />
        <ArticleSamplePage width={width} />
      </Screen.ScrollView>
      <Pager
        count={PAGE_COUNT}
        progress={pageProgress}
        isLoading={isArticleLoading}
      />
    </Screen>
  );
}
