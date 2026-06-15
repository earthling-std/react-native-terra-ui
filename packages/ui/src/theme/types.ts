/**
 * Theme typing — the single source of truth for every consumer-facing and
 * structural theme type. The token DATA (tokens/*.ts) is intentionally
 * untyped (Figma-generated); these types describe the runtime theme that the
 * data is unflattened into, plus the public configuration surface.
 */
import type { DeepPartial } from '#utils/deep-merge';

// ─── Scale keys (declared explicitly; token data is untyped) ────────────────

/** Spacing scale keys (dp, 4dp base unit). Read as `gap={3}` → string '3'. */
export type SpacingKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '12'
  | '14'
  | '16'
  | '20'
  | '24'
  | '32';

/** Border-radius scale keys. */
export type RadiusKey =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full';

/**
 * The radius tokens offered as a component default. Excludes the extreme/rare
 * steps (`xs`, `2xl`, `3xl`).
 */
export type DefaultRadiusToken = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/** Components whose default appearance can be configured. */
export type RadiusComponent = 'button' | 'surface';

// ─── Elevation ──────────────────────────────────────────────────────────────

/** Elevation preset — platform-aware shadow + Android elevation. */
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

// ─── Typography ──────────────────────────────────────────────────────────────

export type TextVariant =
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'headline-lg'
  | 'headline-md'
  | 'headline-sm'
  | 'title-lg'
  | 'title-md'
  | 'title-sm'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'label-lg'
  | 'label-md'
  | 'label-sm'
  | 'caption';

export type FontWeightToken = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: FontWeightToken;
  /** Tracking, dp. */
  letterSpacing: number;
  /** Cap OS Dynamic Type scaling to protect layout. */
  maxFontSizeMultiplier: number;
}

export interface Typography {
  /**
   * Weight token → font-family name. Defaults to the system font.
   * For custom fonts, point each weight at its own family
   * (e.g. { regular: 'Inter-Regular', semibold: 'Inter-SemiBold' }).
   */
  fonts: Record<FontWeightToken, string>;
  variants: Record<TextVariant, TypeStyle>;
}

// ─── Semantic color tier ─────────────────────────────────────────────────────

/** Interactive emphasis role (buttons, pressables). */
export interface InteractiveRole {
  bg: string;
  fg: string;
  hover: string;
  active: string;
  disabled: string;
}

/** Feedback status role (alerts, badges) — soft + solid variants. */
export interface StatusRole {
  solid: string;
  onSolid: string;
  surface: string;
  onSurface: string;
  border: string;
}

/** Semantic color group — the layer components consume. */
export interface ThemeColor {
  background: string;
  surface: {
    base: string;
    raised: string;
    sunken: string;
    overlay: string;
  };
  content: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    link: string;
    accent: string;
    onAccent: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
    focus: string;
  };
  action: {
    primary: InteractiveRole;
    secondary: InteractiveRole;
    neutral: InteractiveRole;
  };
  status: {
    success: StatusRole;
    warning: StatusRole;
    danger: StatusRole;
    info: StatusRole;
  };
}

// ─── Full theme ──────────────────────────────────────────────────────────────

/** State-layer opacities for disabled / pressed feedback. */
export interface OpacityTokens {
  disabled: number;
  pressed: number;
}

/** Screen-level layout tokens. */
export interface LayoutTokens {
  screen: {
    /** Margin between content and the screen edge (applied as container padding). */
    margin: { x: number; y: number };
  };
}

/** The full resolved theme. `light` and `dark` are both `TerraTheme`. */
export interface TerraTheme {
  color: ThemeColor;
  spacing: Record<SpacingKey, number>;
  radius: Record<RadiusKey, number>;
  typography: Typography;
  elevation: ElevationScale;
  opacity: OpacityTokens;
  layout: LayoutTokens;
}

// ─── Color token paths (component prop surface) ──────────────────────────────

type C = ThemeColor;

export type BackgroundColorToken = 'background';
export type SurfaceColorToken = `surface.${keyof C['surface'] & string}`;
export type ContentColorToken = `content.${keyof C['content'] & string}`;
export type BorderColorToken = `border.${keyof C['border'] & string}`;

export type ActionColorToken = {
  [K in keyof C['action']]: `action.${K & string}.${keyof C['action'][K] & string}`;
}[keyof C['action']];

export type StatusColorToken = {
  [K in keyof C['status']]: `status.${K & string}.${keyof C['status'][K] & string}`;
}[keyof C['status']];

/**
 * Any color value a component accepts:
 * semantic token (`content.primary`, `surface.raised`, `action.primary.bg`),
 * or a raw CSS color literal (`#fff`, `rgb(...)`, `transparent`).
 */
export type ColorToken =
  | BackgroundColorToken
  | SurfaceColorToken
  | ContentColorToken
  | BorderColorToken
  | ActionColorToken
  | StatusColorToken
  // literals last so token autocomplete still surfaces
  | (string & {});

// ─── Configuration / accents ─────────────────────────────────────────────────

export type Scheme = 'light' | 'dark';

/** A hue shorthand per scheme — expands to primary + accent token patches. */
export interface AccentShorthand {
  light: string;
  dark: string;
}

/** A full partial-theme override per scheme. */
export interface AccentOverride {
  light?: DeepPartial<TerraTheme>;
  dark?: DeepPartial<TerraTheme>;
}

/** A named, runtime-switchable theme override. */
export type Accent = AccentShorthand | AccentOverride;

/** An accent input normalized to per-scheme partial-theme overrides. */
export interface NormalizedAccent {
  light: DeepPartial<TerraTheme>;
  dark: DeepPartial<TerraTheme>;
}

/** Default props for the Button component. A per-instance prop still wins. */
export interface ButtonDefaults {
  /** Default corner radius. Defaults to `'md'`. */
  radius?: DefaultRadiusToken;
}

/** Default props for the Surface component. A per-instance prop still wins. */
export interface SurfaceDefaults {
  /** Default corner radius. Defaults to `'md'`. */
  radius?: DefaultRadiusToken;
  /** Default drop-shadow depth (`'none'` = no shadow). Defaults to `'none'`. */
  elevation?: ElevationKey;
}

/** Per-component default props applied at configure time. */
export interface ComponentDefaults {
  button?: ButtonDefaults;
  surface?: SurfaceDefaults;
}

export interface TerraConfig {
  /**
   * Base corner radius in dp — the `lg` (×1) step. The rest of the scale is
   * derived by fixed multipliers (`xs` ×0.25, `sm` ×0.5, `md` ×0.75, `xl` ×1.5,
   * `2xl` ×2, `3xl` ×3); `none` (0) and `full` (9999) are constant. Defaults to
   * the `radius.base` token (`8`), which reproduces the shipped scale. Per-token
   * overrides in `theme.{light,dark}.radius` still win over the derived value.
   */
  radiusBase?: number;
  /** Per-project base override, deep-merged onto the shipped base (set once). */
  theme?: { light?: DeepPartial<TerraTheme>; dark?: DeepPartial<TerraTheme> };
  /** Runtime-switchable named overrides (hue shorthand or full partial). */
  accents?: Record<string, Accent>;
  /** Name of the accent (from `accents`) to apply by default. */
  defaultAccent?: string;
  /** Per-component default props (e.g. `{ button: { radius: 'full' } }`). */
  components?: ComponentDefaults;
  /** Follow the system color scheme. Default `true`. */
  adaptiveThemes?: boolean;
  /** Force a starting scheme (disables adaptive theming). */
  initialScheme?: Scheme;
}
