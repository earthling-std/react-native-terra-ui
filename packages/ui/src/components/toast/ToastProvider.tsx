import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Platform, View } from 'react-native';

import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { setToastManager } from './utils/controller';
import { ToastAnimatedItem } from './parts/ToastAnimatedItem';
import { DefaultToast } from './Toast';
import type {
  ToastComponentProps,
  ToastDuration,
  ToastId,
  ToastItem,
  ToastManager,
  ToastPlacement,
  ToastProviderProps,
  ToastShowConfig,
  ToastShowOptions,
  ToastShowOptionsWithComponent,
} from './types';

type ToastAction =
  | { type: 'show'; item: ToastItem }
  | { type: 'hide'; ids: ToastId[] }
  | { type: 'hideAll' };

const DEFAULT_DURATION = 4000;
const DEFAULT_MAX_VISIBLE_TOASTS = 3;

const ToastManagerContext = createContext<ToastManager | null>(null);

function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
  switch (action.type) {
    case 'show':
      return [
        ...state.filter((toast) => toast.id !== action.item.id),
        action.item,
      ];
    case 'hide':
      return state.filter((toast) => !action.ids.some((id) => id === toast.id));
    case 'hideAll':
      return [];
  }
}

function createDefaultToastComponent(
  config: ToastShowConfig,
  manager: ToastManager
) {
  return ({ id, hide }: ToastComponentProps) => (
    <DefaultToast
      id={id}
      hide={(toastId) => hide(String(toastId))}
      variant={config.variant}
      label={config.label}
      description={config.description}
      icon={config.icon}
      actionLabel={config.actionLabel}
      showCloseButton={config.showCloseButton}
      onActionPress={() => config.onActionPress?.(manager)}
    />
  );
}

function isCustomToast(
  options: ToastShowOptions
): options is ToastShowOptionsWithComponent {
  return (
    typeof options === 'object' && options !== null && 'component' in options
  );
}

function normalizePlacement(
  placement: ToastPlacement | undefined,
  fallback: ToastPlacement
): ToastPlacement {
  return placement ?? fallback;
}

function normalizeDuration(
  duration: ToastDuration | undefined,
  fallback: number
): ToastDuration {
  return duration ?? fallback;
}

function toastId(counter: number): ToastId {
  return `toast-${Date.now()}-${counter}`;
}

export function ToastProvider({
  children,
  defaultPlacement = 'top',
  defaultDuration = DEFAULT_DURATION,
  maxVisibleToasts = DEFAULT_MAX_VISIBLE_TOASTS,
  offset,
}: ToastProviderProps) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const toastsRef = useRef<ToastItem[]>([]);
  const counterRef = useRef(0);
  const timeoutsRef = useRef<Map<ToastId, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  const clearToastTimeout = useCallback((id: ToastId) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) clearTimeout(timeout);
    timeoutsRef.current.delete(id);
  }, []);

  const hide = useCallback<ToastManager['hide']>(
    (id) => {
      if (id === 'all') {
        for (const toast of toastsRef.current) {
          clearToastTimeout(toast.id);
          toast.onHide?.();
        }
        toastsRef.current = [];
        dispatch({ type: 'hideAll' });
        return;
      }
      const lastToastId = toastsRef.current[toastsRef.current.length - 1]?.id;
      const ids =
        id === undefined
          ? lastToastId
            ? [lastToastId]
            : []
          : Array.isArray(id)
            ? id
            : [id];

      if (ids.length === 0) return;

      for (const toastId of ids) {
        clearToastTimeout(toastId);
        toastsRef.current.find((toast) => toast.id === toastId)?.onHide?.();
      }
      toastsRef.current = toastsRef.current.filter(
        (toast) => !ids.some((toastId) => toastId === toast.id)
      );
      dispatch({ type: 'hide', ids });
    },
    [clearToastTimeout]
  );

  const managerRef = useRef<ToastManager>({
    show: () => '',
    hide,
  });

  const show = useCallback<ToastManager['show']>(
    (options) => {
      const nextId =
        typeof options === 'object' && options !== null && 'id' in options
          ? (options.id ?? toastId(counterRef.current++))
          : toastId(counterRef.current++);

      const item =
        typeof options === 'string'
          ? {
              id: nextId,
              component: createDefaultToastComponent(
                { label: options },
                managerRef.current
              ),
              duration: defaultDuration,
              placement: defaultPlacement,
            }
          : isCustomToast(options)
            ? {
                id: nextId,
                component: options.component,
                duration: normalizeDuration(options.duration, defaultDuration),
                placement: normalizePlacement(
                  options.placement,
                  defaultPlacement
                ),
                onHide: options.onHide,
              }
            : {
                id: nextId,
                component: createDefaultToastComponent(
                  options,
                  managerRef.current
                ),
                duration: normalizeDuration(options.duration, defaultDuration),
                placement: normalizePlacement(
                  options.placement,
                  defaultPlacement
                ),
                onHide: options.onHide,
              };

      clearToastTimeout(item.id);
      toastsRef.current = [
        ...toastsRef.current.filter((toast) => toast.id !== item.id),
        item,
      ];
      dispatch({ type: 'show', item });
      if (
        typeof options === 'object' &&
        options !== null &&
        'onShow' in options
      ) {
        options.onShow?.();
      }

      if (
        item.duration !== 'persistent' &&
        Number.isFinite(item.duration) &&
        item.duration > 0
      ) {
        const timeout = setTimeout(() => hide(item.id), item.duration);
        timeoutsRef.current.set(item.id, timeout);
      }

      return item.id;
    },
    [clearToastTimeout, defaultDuration, defaultPlacement, hide]
  );

  const manager = useMemo<ToastManager>(() => ({ show, hide }), [show, hide]);
  managerRef.current = manager;

  useEffect(() => {
    setToastManager(manager);
    return () => {
      setToastManager(null);
      for (const timeout of timeoutsRef.current.values()) {
        clearTimeout(timeout);
      }
      timeoutsRef.current.clear();
    };
  }, [manager]);

  const topToasts = toasts.filter((toast) => toast.placement === 'top');
  const bottomToasts = toasts.filter((toast) => toast.placement === 'bottom');

  return (
    <ToastManagerContext.Provider value={manager}>
      {children}
      <ToastViewport
        placement="top"
        toasts={topToasts}
        manager={manager}
        maxVisibleToasts={maxVisibleToasts}
        offset={offset}
      />
      <ToastViewport
        placement="bottom"
        toasts={bottomToasts}
        manager={manager}
        maxVisibleToasts={maxVisibleToasts}
        offset={offset}
      />
    </ToastManagerContext.Provider>
  );
}

interface ToastViewportProps {
  placement: ToastPlacement;
  toasts: ToastItem[];
  manager: ToastManager;
  maxVisibleToasts: number;
  offset?: ToastProviderProps['offset'];
}

function ToastViewport({
  placement,
  toasts,
  manager,
  maxVisibleToasts,
  offset,
}: ToastViewportProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const heights = useSharedValue<Record<ToastId, number>>({});
  const total = useSharedValue(0);
  const edgeStyle =
    placement === 'top'
      ? {
          top:
            offset?.top ??
            safeAreaInsets.top + (Platform.OS === 'ios' ? 0 : 12),
        }
      : {
          bottom:
            offset?.bottom ??
            safeAreaInsets.bottom + (Platform.OS === 'ios' ? 6 : 12),
        };

  useEffect(() => {
    total.value = toasts.length;
    const activeIds = new Set(toasts.map((toast) => toast.id));
    const nextHeights: Record<ToastId, number> = {};
    for (const [id, height] of Object.entries(heights.value)) {
      if (activeIds.has(id)) {
        nextHeights[id] = height;
      }
    }
    heights.value = nextHeights;
  }, [heights, toasts, total]);

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          position: 'absolute',
          left: offset?.left ?? safeAreaInsets.left + 12,
          right: offset?.right ?? safeAreaInsets.right + 12,
        },
        edgeStyle,
      ]}
    >
      {toasts.map((toast, index) => (
        <ToastAnimatedItem
          key={toast.id}
          heights={heights}
          id={toast.id}
          index={index}
          maxVisibleToasts={maxVisibleToasts}
          placement={placement}
          total={total}
        >
          {toast.component({
            id: toast.id,
            index,
            hide: manager.hide,
            show: manager.show,
          })}
        </ToastAnimatedItem>
      ))}
    </View>
  );
}

export function useToast(): ToastManager {
  const manager = useContext(ToastManagerContext);
  if (!manager) {
    throw new Error('useToast must be used within <TerraUIProvider>.');
  }
  return manager;
}
