import { router } from 'expo-router';
import { View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Box,
  Button,
  DefaultToast,
  Header,
  Screen,
  Toast,
  type ToastVariant,
  useToast,
} from 'react-native-terra-ui';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import _ from 'lodash'

import { Pager } from '../components/Pager';

const TOAST_VARIANTS: ToastVariant[] = [
  'default',
  'accent',
  'info',
  'success',
  'warning',
  'danger',
];

const PAGE_TITLES = ['Variants', 'Hook API', 'Placement', 'Custom'];

function showStaticToast(variant: ToastVariant) {
  Toast.show({
    variant,
    label: `${variant} toast`,
    description:
      variant === 'default'
        ? 'Opened with Toast.show().'
        : `Uses the ${variant} visual tone.`,
    actionLabel: 'Close',
    onActionPress: ({ hide }) => hide(),
  });
}

function StaticApiPage() {
  return (
    <View style={styles.page}>
      <Box gap="2">
        {TOAST_VARIANTS.map((variant) => (
          <Button
            key={variant}
            fullWidth
            variant="outline"
            onPress={() => showStaticToast(variant)}
          >
            {`${_.startCase(variant)} Toast`}
          </Button>
        ))}
        <Button variant="danger" onPress={() => Toast.hide('all')}>
          Hide All
        </Button>
      </Box>
    </View>
  );
}

function HookApiPage() {
  const toast = useToast();

  return (
    <View style={styles.page}>
      <Box gap="4" style={styles.content}>
        <DefaultToast
          variant="success"
          label="Hook manager"
          description="useToast() returns the same show/hide stack controls."
          showCloseButton
        />
        <Box gap="3">
          <Button
            onPress={() =>
              toast.show({
                variant: 'accent',
                label: 'You have 2 credits left',
                description: 'Get a paid plan for more credits',
                icon: <Toast.Icon name="status.info" />,
                actionLabel: 'Close',
                onActionPress: ({ hide }) => hide(),
              })
            }
          >
            Show credit toast
          </Button>
          <Button
            variant="outline"
            onPress={() =>
              toast.show({
                id: 'persistent-toast',
                variant: 'warning',
                label: 'Persistent toast',
                description: 'This toast stays until hide() is called.',
                duration: 'persistent',
                showCloseButton: true,
              })
            }
          >
            Show persistent toast
          </Button>
          <Box row gap="2" wrap>
            <Button
              fullWidth={false}
              size="sm"
              variant="ghost"
              onPress={() => toast.hide()}
            >
              Hide latest
            </Button>
            <Button
              fullWidth={false}
              size="sm"
              variant="ghost"
              onPress={() => toast.hide('all')}
            >
              Hide All
            </Button>
          </Box>
        </Box>
      </Box>
    </View>
  );
}

function PlacementPage() {
  const toast = useToast();

  return (
    <View style={styles.page}>
      <Box gap="4" style={styles.content}>
        {TOAST_VARIANTS.map((variant) => (
          <DefaultToast
            key={variant}
            variant={variant}
            label={variant}
            description={`Preview for variant="${variant}".`}
          />
        ))}
        <Box row gap="2" wrap>
          <Button
            fullWidth={false}
            onPress={() =>
              toast.show({
                variant: 'info',
                label: 'Top placement',
                description: 'Newer toasts stack from the top safe area.',
                placement: 'top',
              })
            }
          >
            Show top
          </Button>
          <Button
            fullWidth={false}
            variant="outline"
            onPress={() =>
              toast.show({
                variant: 'success',
                label: 'Bottom placement',
                description: 'This toast enters from the bottom.',
                placement: 'bottom',
              })
            }
          >
            Show bottom
          </Button>
        </Box>
      </Box>
    </View>
  );
}

function CustomPage() {
  const toast = useToast();

  return (
    <View style={styles.page}>
      <Box gap="4" style={styles.content}>
        <DefaultToast
          variant="danger"
          icon={<Toast.Icon name="trash" />}
          label="Delete scheduled"
          description="DefaultToast accepts custom icon content."
          actionLabel="Cancel"
        />

        <Toast variant="accent" row={false} p="5" gap="4" align="stretch">
          <Box row gap="3" align="center">
            <Toast.Icon name="add" />
            <Box flex={1} gap="1" style={{ minWidth: 0 }}>
              <Toast.Title>Build your own body</Toast.Title>
              <Toast.Description>
                Toast is a themed Surface, so Box, Text, and Button compose
                naturally inside it.
              </Toast.Description>
            </Box>
          </Box>
          <Box row gap="2" wrap alignSelf="start" style={{ maxWidth: '100%' }}>
            <Button fullWidth={false} size="sm" variant="outline">
              Details
            </Button>
            <Toast.Action>Accept</Toast.Action>
          </Box>
        </Toast>

        <Button
          variant="outline"
          onPress={() =>
            toast.show({
              duration: 'persistent',
              placement: 'bottom',
              component: ({ id, hide }) => (
                <Toast
                  id={id}
                  hide={(toastId) => hide(String(toastId))}
                  variant="accent"
                  row={false}
                  p="5"
                  gap="4"
                  align="stretch"
                >
                  <Box row gap="3" align="center">
                    <Toast.Icon name="add" />
                    <Box flex={1} gap="1" style={{ minWidth: 0 }}>
                      <Toast.Title>Custom stack item</Toast.Title>
                      <Toast.Description>
                        The manager accepts a component renderer for fully
                        custom toast content.
                      </Toast.Description>
                    </Box>
                  </Box>
                  <Box
                    row
                    gap="2"
                    wrap
                    alignSelf="start"
                    style={{ maxWidth: '100%' }}
                  >
                    <Toast.Action onPress={() => hide(id)}>Done</Toast.Action>
                    <Toast.Close />
                  </Box>
                </Toast>
              ),
            })
          }
        >
          Show custom stacked toast
        </Button>
      </Box>
    </View>
  );
}

export function ToastScreen() {
  const { rt } = useUnistyles();
  const screenWidth = rt.screen.width;
  const pageProgress = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      pageProgress.value =
        screenWidth > 0
          ? event.contentOffset.x / screenWidth
          : event.contentOffset.x;
    },
  });

  return (
    <Screen margins={false}>
      <Screen.Header>
        <Header.Title
          dismissAction="back"
          onDismiss={() => router.back()}
          title="Toast"
        />
      </Screen.Header>

      <Screen.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollHandler={scrollHandler}
      >
        <StaticApiPage />
        <HookApiPage />
        <PlacementPage />
        <CustomPage />
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  page: {
    flex: 1,
    width: runtime.screen.width,
    justifyContent: 'center',
    paddingHorizontal: theme.layout.screen.margin.x,
  },
  content: {
    width: runtime.screen.width - theme.layout.screen.margin.x * 2,
  },
}));
