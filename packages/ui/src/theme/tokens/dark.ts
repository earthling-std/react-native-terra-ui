/**
 * Dark-scheme color tokens — flat, dotted-key data (no imports, no types).
 *
 * Convention: [category].[context].[property?].[variant].[state]
 *
 * GENERATED-STYLE SOURCE: intended to be replaced by the Figma / design-sync export.
 */
export const dark = {
  // ── color: page background ────────────────────────────────────────────────
  'color.background': '{palette.neutral.950}',

  // ── color: surfaces  (bg implied — no property segment) ──────────────────
  'color.surface.default': '{palette.neutral.900}',
  'color.surface.raised': '{palette.neutral.800}',
  'color.surface.sunken': '#050506',
  'color.surface.overlay': 'rgba(0, 0, 0, 0.72)',
  'color.surface.accent': '{palette.emerald.500}',
  'color.surface.accent.subtle': '{palette.emerald.950}',

  // ── color: text / icons  (fg implied — no property segment) ──────────────
  'color.text.default': '{palette.neutral.50}',
  'color.text.muted': '{palette.neutral.400}',
  'color.text.subtle': '{palette.neutral.500}',
  'color.text.disabled': '{palette.neutral.700}',
  'color.text.inverse': '{palette.neutral.950}',
  'color.text.link': '{palette.blue.300}',
  'color.text.accent': '{palette.emerald.400}',
  'color.text.on-accent': '{palette.neutral.950}',
  'color.text.on-accent-subtle': '{palette.emerald.300}',

  // ── color: borders  (border-color implied — no property segment) ──────────
  'color.border.subtle': '{palette.neutral.800}',
  'color.border.default': '{palette.neutral.700}',
  'color.border.strong': '{palette.neutral.600}',
  'color.border.focus': '{palette.blue.400}',
  'color.border.accent': '{palette.emerald.500}',

  // ── color: interactive actions  (bg + fg → property required) ────────────
  'color.action.bg.primary': '{palette.emerald.500}',
  'color.action.bg.primary.hover': '{palette.emerald.400}',
  'color.action.bg.primary.active': '{palette.emerald.300}',
  'color.action.bg.primary.disabled': '{palette.slate.700}',
  'color.action.fg.primary': '{palette.slate.950}',

  'color.action.bg.subtle': '{palette.emerald.950}',
  'color.action.bg.subtle.hover': '{palette.emerald.900}',
  'color.action.bg.subtle.active': '{palette.emerald.800}',
  'color.action.bg.subtle.disabled': '{palette.neutral.900}',
  'color.action.fg.subtle': '{palette.emerald.300}',

  'color.action.bg.neutral': 'transparent',
  'color.action.bg.neutral.hover': '{palette.neutral.800}',
  'color.action.bg.neutral.active': '{palette.neutral.700}',
  'color.action.bg.neutral.disabled': 'transparent',
  'color.action.fg.neutral': '{palette.neutral.400}',

  // ── color: status  (bg + fg + border → property required) ────────────────
  'color.status.bg.success': '{palette.green.500}',
  'color.status.bg.success.subtle': '{palette.green.900}',
  'color.status.border.success': '{palette.green.700}',
  'color.status.border.success.subtle': '{palette.green.800}',
  'color.status.fg.success': '{palette.slate.950}',
  'color.status.fg.success.subtle': '{palette.green.200}',

  'color.status.bg.warning': '{palette.amber.400}',
  'color.status.bg.warning.subtle': '{palette.amber.900}',
  'color.status.border.warning': '{palette.amber.700}',
  'color.status.border.warning.subtle': '{palette.amber.800}',
  'color.status.fg.warning': '{palette.slate.950}',
  'color.status.fg.warning.subtle': '{palette.amber.200}',

  'color.status.bg.danger': '{palette.red.500}',
  'color.status.bg.danger.subtle': '{palette.red.950}',
  'color.status.border.danger': '{palette.red.800}',
  'color.status.border.danger.subtle': '{palette.red.900}',
  'color.status.fg.danger': '{palette.white}',
  'color.status.fg.danger.subtle': '{palette.red.200}',

  'color.status.bg.info': '{palette.sky.500}',
  'color.status.bg.info.subtle': '{palette.sky.950}',
  'color.status.border.info': '{palette.sky.800}',
  'color.status.border.info.subtle': '{palette.sky.900}',
  'color.status.fg.info': '{palette.slate.950}',
  'color.status.fg.info.subtle': '{palette.sky.200}',

  // ── elevation: platform-aware shadow + Android elevation ──────────────────
  'elevation.none.shadowColor': '#000000',
  'elevation.none.shadowOpacity': 0,
  'elevation.none.shadowRadius': 0,
  'elevation.none.shadowOffset.width': 0,
  'elevation.none.shadowOffset.height': 0,
  'elevation.none.elevation': 0,
  'elevation.sm.shadowColor': '#000000',
  'elevation.sm.shadowOpacity': 0.3,
  'elevation.sm.shadowRadius': 2,
  'elevation.sm.shadowOffset.width': 0,
  'elevation.sm.shadowOffset.height': 1,
  'elevation.sm.elevation': 1,
  'elevation.md.shadowColor': '#000000',
  'elevation.md.shadowOpacity': 0.4,
  'elevation.md.shadowRadius': 6,
  'elevation.md.shadowOffset.width': 0,
  'elevation.md.shadowOffset.height': 2,
  'elevation.md.elevation': 3,
  'elevation.lg.shadowColor': '#000000',
  'elevation.lg.shadowOpacity': 0.5,
  'elevation.lg.shadowRadius': 12,
  'elevation.lg.shadowOffset.width': 0,
  'elevation.lg.shadowOffset.height': 4,
  'elevation.lg.elevation': 6,
  'elevation.xl.shadowColor': '#000000',
  'elevation.xl.shadowOpacity': 0.6,
  'elevation.xl.shadowRadius': 24,
  'elevation.xl.shadowOffset.width': 0,
  'elevation.xl.shadowOffset.height': 8,
  'elevation.xl.elevation': 12,
};
