import type { ColorToken } from '#theme/types';

/**
 * Shared, reusable config for both `PageIndicator` variants — geometry and
 * color tokens in one object. Pass a partial override via the `config` prop;
 * anything omitted falls back to `defaultPageIndicatorConfig`. Define one object
 * and reuse it across instances. Top-level color props (`activeColor`, …) take
 * precedence over `config` when both are set.
 */
export interface PageIndicatorConfig {
  /** Diameter of a resting dot (both variants). */
  dotSize: number;
  /** Gap between adjacent dots (both variants). */
  gap: number;
  /** Width of the active pill in the `pill` variant. */
  activeWidth: number;
  /** Opacity of inactive dots in the `pill` variant. */
  inactiveOpacity: number;
  /** Scale of inactive dots in the `pill` variant. */
  inactiveScale: number;
  /** Diameter of the loading ring in the `dot` variant. */
  ringSize: number;
  /** Stroke width of the loading ring in the `dot` variant. */
  ringStroke: number;
}

export const defaultPageIndicatorConfig: PageIndicatorConfig = {
  dotSize: 8,
  gap: 8,
  activeWidth: 24,
  inactiveOpacity: 0.42,
  inactiveScale: 0.8,
  ringSize: 16,
  ringStroke: 2,
};

export const resolvePageIndicatorConfig = (
  config?: Partial<PageIndicatorConfig>
): PageIndicatorConfig => {
  return { ...defaultPageIndicatorConfig, ...config };
};

/** Color tokens for page indicator states. Top-level props on `PageIndicator`. */
export interface PageIndicatorColors {
  /** Active page color token. */
  activeColor?: ColorToken;
  /** Inactive page color token. */
  inactiveColor?: ColorToken;
  /** Loading ring color token (dot variant only). */
  loadingColor?: ColorToken;
}

/** Resolved (theme-applied) colors passed down to the variant components. */
export interface ResolvedColors {
  activeColor: string;
  inactiveColor: string;
  loadingColor: string;
}
