import type { ReactNode } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { pageIndicatorViewportClipStyle } from './utils';

export type PageIndicatorRootProps = {
  children: ReactNode;
  crossSize?: number;
  overflows: boolean;
  style?: StyleProp<ViewStyle>;
  vertical: boolean;
  viewportMainSize: number;
};

/** Non-interactive root with optional overflow clipping. */
export function PageIndicatorRoot({
  children,
  crossSize,
  overflows,
  style,
  vertical,
  viewportMainSize,
}: PageIndicatorRootProps) {
  return (
    <View pointerEvents="none" style={style}>
      {overflows ? (
        <View
          style={pageIndicatorViewportClipStyle(
            vertical,
            viewportMainSize,
            crossSize
          )}
        >
          {children}
        </View>
      ) : (
        children
      )}
    </View>
  );
}
