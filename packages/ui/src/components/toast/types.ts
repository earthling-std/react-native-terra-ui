import type { ReactElement, ReactNode } from 'react';

import type { ToastProps, ToastVariant } from './Toast';

export type ToastId = string;
export type ToastDuration = number | 'persistent';
export type ToastPlacement = 'top' | 'bottom';

export interface ToastActionHelpers {
  show: ToastManager['show'];
  hide: ToastManager['hide'];
}

export interface ToastShowConfig extends Pick<ToastProps, 'variant'> {
  id?: ToastId;
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode | false;
  actionLabel?: ReactNode;
  onActionPress?: (helpers: ToastActionHelpers) => void;
  duration?: ToastDuration;
  placement?: ToastPlacement;
  showCloseButton?: boolean;
  onShow?: () => void;
  onHide?: () => void;
}

export interface ToastComponentProps {
  id: ToastId;
  index: number;
  hide: ToastManager['hide'];
  show: ToastManager['show'];
}

export interface ToastShowOptionsWithComponent {
  id?: ToastId;
  component: (props: ToastComponentProps) => ReactElement;
  duration?: ToastDuration;
  placement?: ToastPlacement;
  onShow?: () => void;
  onHide?: () => void;
}

export type ToastShowOptions =
  | ToastShowConfig
  | ToastShowOptionsWithComponent
  | string;

export interface ToastItem {
  id: ToastId;
  component: (props: ToastComponentProps) => ReactElement;
  duration: ToastDuration;
  placement: ToastPlacement;
  onHide?: () => void;
}

export interface ToastManager {
  show: (options: ToastShowOptions) => ToastId;
  hide: (id?: ToastId | ToastId[] | 'all') => void;
}

export interface ToastProviderProps {
  children?: ReactNode;
  defaultPlacement?: ToastPlacement;
  defaultDuration?: number;
  maxVisibleToasts?: number;
  offset?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export type { ToastVariant };
