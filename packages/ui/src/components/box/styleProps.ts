import { StyleSheet, type ViewStyle } from 'react-native';
import type {
  ColorToken,
  RadiusKey,
  SpacingKey,
  TerraTheme,
} from '#theme/types';
import { resolveThemeColor } from '#utils/resolve-theme-color';

export type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type Justify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly';
export type BorderWidthInput = number | 'hairline';

/** Strips `readonly` so the style object can be built by mutation. */
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

/** Token-driven style props accepted by `Box` / `Stack`. */
export interface BoxStyleProps {
  // Spacing
  p?: SpacingKey;
  px?: SpacingKey;
  py?: SpacingKey;
  pt?: SpacingKey;
  pr?: SpacingKey;
  pb?: SpacingKey;
  pl?: SpacingKey;
  m?: SpacingKey;
  mx?: SpacingKey;
  my?: SpacingKey;
  mt?: SpacingKey;
  mr?: SpacingKey;
  mb?: SpacingKey;
  ml?: SpacingKey;
  gap?: SpacingKey;
  // Layout
  direction?: 'row' | 'column';
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  flex?: number;
  alignSelf?: Align;
  // Visual
  bg?: ColorToken;
  radius?: RadiusKey;
  borderWidth?: BorderWidthInput;
  borderColor?: ColorToken;
}

const ALIGN_MAP: Record<Align, NonNullable<ViewStyle['alignItems']>> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const JUSTIFY_MAP: Record<Justify, NonNullable<ViewStyle['justifyContent']>> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

const space = (
  theme: TerraTheme,
  key: SpacingKey | undefined
): number | undefined => (key === undefined ? undefined : theme.spacing[key]);

/** Builds a `ViewStyle` from token-driven props using the active theme. */
export function resolveBoxStyle(
  props: BoxStyleProps,
  theme: TerraTheme
): ViewStyle {
  const style: Mutable<ViewStyle> = {};

  // Padding
  const p = space(theme, props.p);
  const px = space(theme, props.px);
  const py = space(theme, props.py);
  if (p !== undefined) style.padding = p;
  if (px !== undefined) style.paddingHorizontal = px;
  if (py !== undefined) style.paddingVertical = py;
  const pt = space(theme, props.pt);
  const pr = space(theme, props.pr);
  const pb = space(theme, props.pb);
  const pl = space(theme, props.pl);
  if (pt !== undefined) style.paddingTop = pt;
  if (pr !== undefined) style.paddingRight = pr;
  if (pb !== undefined) style.paddingBottom = pb;
  if (pl !== undefined) style.paddingLeft = pl;

  // Margin
  const m = space(theme, props.m);
  const mx = space(theme, props.mx);
  const my = space(theme, props.my);
  if (m !== undefined) style.margin = m;
  if (mx !== undefined) style.marginHorizontal = mx;
  if (my !== undefined) style.marginVertical = my;
  const mt = space(theme, props.mt);
  const mr = space(theme, props.mr);
  const mb = space(theme, props.mb);
  const ml = space(theme, props.ml);
  if (mt !== undefined) style.marginTop = mt;
  if (mr !== undefined) style.marginRight = mr;
  if (mb !== undefined) style.marginBottom = mb;
  if (ml !== undefined) style.marginLeft = ml;

  // Gap
  const gap = space(theme, props.gap);
  if (gap !== undefined) style.gap = gap;

  // Layout
  if (props.direction !== undefined) style.flexDirection = props.direction;
  if (props.align !== undefined) style.alignItems = ALIGN_MAP[props.align];
  if (props.justify !== undefined) {
    style.justifyContent = JUSTIFY_MAP[props.justify];
  }
  if (props.wrap !== undefined) style.flexWrap = props.wrap ? 'wrap' : 'nowrap';
  if (props.flex !== undefined) style.flex = props.flex;
  if (props.alignSelf !== undefined)
    style.alignSelf = ALIGN_MAP[props.alignSelf];

  // Visual
  if (props.bg !== undefined) {
    const bg = resolveThemeColor(props.bg, theme);
    if (bg !== undefined) style.backgroundColor = bg;
  }
  if (props.radius !== undefined)
    style.borderRadius = theme.radius[props.radius];
  if (props.borderWidth !== undefined) {
    style.borderWidth =
      props.borderWidth === 'hairline'
        ? StyleSheet.hairlineWidth
        : props.borderWidth;
  }
  if (props.borderColor !== undefined) {
    const borderColor = resolveThemeColor(props.borderColor, theme);
    if (borderColor !== undefined) style.borderColor = borderColor;
  }

  return style;
}

/** Keys of {@link BoxStyleProps}, used to split style props from view props. */
export const BOX_STYLE_PROP_KEYS: readonly (keyof BoxStyleProps)[] = [
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'gap',
  'direction',
  'align',
  'justify',
  'wrap',
  'flex',
  'alignSelf',
  'bg',
  'radius',
  'borderWidth',
  'borderColor',
];
