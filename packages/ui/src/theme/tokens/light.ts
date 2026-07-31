/**
 * Light-scheme color tokens — flat, dotted-key data (no imports, no types).
 *
 * Convention: [category].[context].[property?].[variant].[state]
 *   - property is omitted when the context implies it (surface → bg, text → fg, border → border-color)
 *   - property is required when a context carries multiple attributes (action, status)
 *
 * Values use {palette.key} reference notation, resolved against primitives at
 * build time via resolveRefs() in theme.ts. Raw hex is used only where no
 * palette step matches exactly.
 *
 * GENERATED-STYLE SOURCE: intended to be replaced by the Figma / design-sync export.
 */
export const light = {
  // ── color: page background ────────────────────────────────────────────────
  'color.background': '#f9f9fb',

  // ── color: surfaces  (bg implied — no property segment) ──────────────────
  'color.surface.default': '{palette.white}',
  'color.surface.raised': '{palette.white}',
  'color.surface.sunken': '#ececee',
  'color.surface.overlay': 'rgba(9, 9, 11, 0.48)',
  'color.surface.accent': '{palette.emerald.600}',
  'color.surface.accent.subtle': '{palette.emerald.100}',

  // ── color: text / icons  (fg implied — no property segment) ──────────────
  'color.text.default': '{palette.neutral.950}',
  'color.text.muted': '#4b5060',
  'color.text.subtle': '#6b7280',
  'color.text.disabled': '#9ca3af',
  'color.text.inverse': '{palette.white}',
  'color.text.link': '{palette.blue.600}',
  'color.text.accent': '{palette.emerald.600}',
  'color.text.on-accent': '{palette.white}',
  'color.text.on-accent-subtle': '{palette.emerald.700}',

  // ── color: borders  (border-color implied — no property segment) ──────────
  'color.border.subtle': '#ebebed',
  'color.border.default': '{palette.neutral.200}',
  'color.border.strong': '#d1d5db',
  'color.border.focus': '{palette.blue.500}',
  'color.border.accent': '{palette.emerald.600}',

  // ── color: interactive actions  (bg + fg → property required) ────────────
  'color.action.bg.primary': '{palette.emerald.600}',
  'color.action.bg.primary.hover': '{palette.emerald.700}',
  'color.action.bg.primary.active': '{palette.emerald.800}',
  'color.action.bg.primary.disabled': '{palette.slate.200}',
  'color.action.fg.primary': '{palette.white}',

  'color.action.bg.subtle': '{palette.emerald.100}',
  'color.action.bg.subtle.hover': '{palette.emerald.200}',
  'color.action.bg.subtle.active': '{palette.emerald.300}',
  'color.action.bg.subtle.disabled': '{palette.slate.100}',
  'color.action.fg.subtle': '{palette.emerald.700}',

  'color.action.bg.neutral': 'transparent',
  'color.action.bg.neutral.hover': '{palette.slate.100}',
  'color.action.bg.neutral.active': '{palette.slate.200}',
  'color.action.bg.neutral.disabled': 'transparent',
  'color.action.fg.neutral': '{palette.slate.700}',

  // ── color: status  (bg + fg + border → property required) ────────────────
  'color.status.bg.success': '{palette.green.600}',
  'color.status.bg.success.subtle': '{palette.green.100}',
  'color.status.border.success': '{palette.green.300}',
  'color.status.border.success.subtle': '{palette.green.200}',
  'color.status.fg.success': '{palette.white}',
  'color.status.fg.success.subtle': '{palette.green.800}',

  'color.status.bg.warning': '{palette.amber.500}',
  'color.status.bg.warning.subtle': '{palette.amber.100}',
  'color.status.border.warning': '{palette.amber.300}',
  'color.status.border.warning.subtle': '{palette.amber.200}',
  'color.status.fg.warning': '{palette.slate.950}',
  'color.status.fg.warning.subtle': '{palette.amber.800}',

  'color.status.bg.danger': '{palette.red.600}',
  'color.status.bg.danger.subtle': '{palette.red.100}',
  'color.status.border.danger': '{palette.red.300}',
  'color.status.border.danger.subtle': '{palette.red.200}',
  'color.status.fg.danger': '{palette.white}',
  'color.status.fg.danger.subtle': '{palette.red.800}',

  'color.status.bg.info': '{palette.sky.600}',
  'color.status.bg.info.subtle': '{palette.sky.100}',
  'color.status.border.info': '{palette.sky.300}',
  'color.status.border.info.subtle': '{palette.sky.200}',
  'color.status.fg.info': '{palette.white}',
  'color.status.fg.info.subtle': '{palette.sky.800}',

  // ── elevation: platform-aware shadow + Android elevation ──────────────────
  'elevation.none.shadowColor': '#000000',
  'elevation.none.shadowOpacity': 0,
  'elevation.none.shadowRadius': 0,
  'elevation.none.shadowOffset.width': 0,
  'elevation.none.shadowOffset.height': 0,
  'elevation.none.elevation': 0,
  'elevation.sm.shadowColor': '#000000',
  'elevation.sm.shadowOpacity': 0.1,
  'elevation.sm.shadowRadius': 3,
  'elevation.sm.shadowOffset.width': 0,
  'elevation.sm.shadowOffset.height': 1,
  'elevation.sm.elevation': 1,
  'elevation.md.shadowColor': '#000000',
  'elevation.md.shadowOpacity': 0.12,
  'elevation.md.shadowRadius': 8,
  'elevation.md.shadowOffset.width': 0,
  'elevation.md.shadowOffset.height': 2,
  'elevation.md.elevation': 3,
  'elevation.lg.shadowColor': '#000000',
  'elevation.lg.shadowOpacity': 0.12,
  'elevation.lg.shadowRadius': 12,
  'elevation.lg.shadowOffset.width': 0,
  'elevation.lg.shadowOffset.height': 4,
  'elevation.lg.elevation': 6,
  'elevation.xl.shadowColor': '#000000',
  'elevation.xl.shadowOpacity': 0.16,
  'elevation.xl.shadowRadius': 24,
  'elevation.xl.shadowOffset.width': 0,
  'elevation.xl.shadowOffset.height': 8,
  'elevation.xl.elevation': 12,
};
