import type { LayoutTokens } from '#theme/types';

export function resolveScreenContentInsets(
  margin: LayoutTokens['screen']['margin'],
  margins: boolean,
  bottomInset?: number,
  topInset?: number
) {
  return {
    contentPadding: {
      flexGrow: 1 as const,
      paddingTop: topInset ?? 0,
      paddingHorizontal: margins ? margin.x : 0,
      paddingBottom: bottomInset ?? (margins ? margin.y : 0),
    },
    portalSpacing: margins ? margin.y : 0,
  };
}
