export type ChipSize = 'sm' | 'md' | 'lg';
export type ChipVariant = 'solid' | 'soft' | 'outline' | 'ghost';

/**
 * Semantic color scheme, or a raw CSS color literal (`#fff`, `rgb(...)`, `hsl(...)`).
 * Has no effect when `variant="ghost"` — ghost always renders `text.default`.
 */
export type ChipColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  // literals last so scheme-name autocomplete still surfaces
  | (string & {});
