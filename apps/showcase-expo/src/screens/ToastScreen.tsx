import { router } from 'expo-router';
import { type ComponentRef, useRef } from 'react';
import { TextInput, useWindowDimensions, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Box,
  Button,
  Header,
  Screen,
  Toast,
  type ToastVariant,
  useToast,
} from 'react-native-terra-ui';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Pager } from '../components/Pager';

const TOAST_VARIANTS: ToastVariant[] = [
  'default',
  'accent',
  'info',
  'success',
  'warning',
  'danger',
];

const PAGE_TITLES = [
  'Color Variants',
  'Placement',
  'Keyboard Avoiding',
  'Custom',
];

// ─── Color Variants ───────────────────────────────────────────────────────────

function ColorVariantsPage({ width }: { width: number }) {
  return (
    <View style={[styles.page, { width }]}>
      <Box gap="2" style={styles.content}>
        {TOAST_VARIANTS.map((variant) => (
          <Button
            key={variant}
            variant="outline"
            onPress={() =>
              Toast.show({
                variant,
                label: `${variant.charAt(0).toUpperCase()}${variant.slice(1)} toast`,
                description: `variant="${variant}"`,
                actionLabel: 'Close',
              })
            }
          >
            {`${variant.charAt(0).toUpperCase()}${variant.slice(1)}`}
          </Button>
        ))}
        <Button variant="ghost" onPress={() => Toast.hide('all')}>
          Hide All
        </Button>
      </Box>
    </View>
  );
}

// ─── Placement ────────────────────────────────────────────────────────────────

function PlacementPage({ width }: { width: number }) {
  const toast = useToast();

  return (
    <View style={[styles.page, { width }]}>
      <Box gap="2" style={styles.content}>
        <Button
          onPress={() =>
            toast.show({
              variant: 'info',
              label: 'Top placement',
              description: 'Stacks from the top safe area downward.',
              placement: 'top',
              showCloseButton: true,
            })
          }
        >
          Show top toast
        </Button>
        <Button
          variant="outline"
          onPress={() =>
            toast.show({
              variant: 'success',
              label: 'Bottom placement',
              description: 'Stacks from the bottom safe area upward.',
              placement: 'bottom',
              showCloseButton: true,
            })
          }
        >
          Show bottom toast
        </Button>
        <Button variant="ghost" onPress={() => toast.hide('all')}>
          Hide all
        </Button>
      </Box>
    </View>
  );
}

// ─── Keyboard Avoiding ────────────────────────────────────────────────────────

function KeyboardAvoidingPage({ width }: { width: number }) {
  const toast = useToast();
  const { theme } = useUnistyles();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

  return (
    <View style={[styles.page, { width }]}>
      <Box gap="2" style={styles.content}>
        <TextInput
          ref={inputRef}
          placeholder="Tap to open keyboard…"
          placeholderTextColor={(theme.color as unknown as Record<string, string | undefined>)['text.subtle']}
          style={[
            styles.input,
            {
              color: (theme.color as unknown as Record<string, string | undefined>)['text.default'],
              borderColor: (theme.color as unknown as Record<string, string | undefined>)['border.default'],
              backgroundColor: (theme.color as unknown as Record<string, string | undefined>)['surface.default'],
            },
          ]}
        />

        <Button
          onPress={() => {
            toast.show({
              variant: 'accent',
              label: 'Toast avoids the keyboard',
              description: 'It slides up as the keyboard appears.',
              duration: 'persistent',
              placement: 'bottom',
              showCloseButton: true,
            });
            inputRef.current?.focus();
          }}
        >
          Show toast
        </Button>

        <Button
          variant="ghost"
          onPress={() => {
            inputRef.current?.blur();
            toast.hide('all');
          }}
        >
          Dismiss
        </Button>
      </Box>
    </View>
  );
}

// ─── Custom ───────────────────────────────────────────────────────────────────

function CustomPage({ width }: { width: number }) {
  const toast = useToast();

  return (
    <View style={[styles.page, { width }]}>
      <Box gap="2" style={styles.content}>
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
                    <Box flex={1} gap="1" style={{ minWidth: 0 }}>
                      <Toast.Title>Custom stack item</Toast.Title>
                      <Toast.Description>
                        Pass a component renderer for fully custom toast
                        content.
                      </Toast.Description>
                    </Box>
                  </Box>
                  <Box row gap="2" wrap alignSelf="end">
                    <Toast.Action onPress={() => hide(id)}>Accept</Toast.Action>
                    <Toast.Action variant="default" onPress={() => hide(id)}>
                      Cancel
                    </Toast.Action>
                  </Box>
                </Toast>
              ),
            })
          }
        >
          Custom toast
        </Button>
      </Box>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ToastScreen() {
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
          title="Toast"
        />
      </Screen.Header>

      <Screen.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollHandler={scrollHandler}
      >
        <ColorVariantsPage width={width} />
        <PlacementPage width={width} />
        <KeyboardAvoidingPage width={width} />
        <CustomPage width={width} />
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  page: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.layout.screen.margin.x,
  },
  content: {
    width: runtime.screen.width - theme.layout.screen.margin.x * 2,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing['4'],
    fontSize: theme.typography.variants['body-md'].fontSize,
  },
}));
