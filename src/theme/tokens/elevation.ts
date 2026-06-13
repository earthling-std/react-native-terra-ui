/**
 * Elevation presets — platform-aware shadow + Android elevation.
 */
export interface ElevationStyle {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  /** Android elevation. */
  elevation: number;
}

export type ElevationKey = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export type ElevationScale = Record<ElevationKey, ElevationStyle>;

const make = (
  elevation: number,
  shadowRadius: number,
  shadowOpacity: number,
  height: number,
  shadowColor: string
): ElevationStyle => ({
  shadowColor,
  shadowOpacity,
  shadowRadius,
  shadowOffset: { width: 0, height },
  elevation,
});

export const lightElevation: ElevationScale = {
  none: make(0, 0, 0, 0, '#000000'),
  sm: make(1, 2, 0.08, 1, '#000000'),
  md: make(3, 6, 0.1, 2, '#000000'),
  lg: make(6, 12, 0.12, 4, '#000000'),
  xl: make(12, 24, 0.16, 8, '#000000'),
};

export const darkElevation: ElevationScale = {
  none: make(0, 0, 0, 0, '#000000'),
  sm: make(1, 2, 0.3, 1, '#000000'),
  md: make(3, 6, 0.4, 2, '#000000'),
  lg: make(6, 12, 0.5, 4, '#000000'),
  xl: make(12, 24, 0.6, 8, '#000000'),
};
