import type { ToastId, ToastManager, ToastShowOptions } from './types';

let activeManager: ToastManager | null = null;

export function setToastManager(manager: ToastManager | null): void {
  activeManager = manager;
}

export function showToast(options: ToastShowOptions): ToastId {
  if (!activeManager) {
    if (__DEV__) {
      console.warn(
        '[react-native-terra-ui] Toast.show() called before <TerraUIProvider> mounted.'
      );
    }
    return '';
  }
  return activeManager.show(options);
}

export function hideToast(id?: ToastId | ToastId[] | 'all'): void {
  activeManager?.hide(id);
}
