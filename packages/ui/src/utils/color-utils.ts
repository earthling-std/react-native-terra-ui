/** Small color helpers for deriving accent shades from a single hue. */

interface RGB {
  r: number;
  g: number;
  b: number;
}

const clamp = (n: number): number => Math.max(0, Math.min(255, Math.round(n)));

function parseHex(hex: string): RGB | null {
  const hex6 = /^#?([0-9a-f]{6})$/i.exec(hex.trim())?.[1];
  if (!hex6) return null;
  const int = Number.parseInt(hex6, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

const toHex = ({ r, g, b }: RGB): string =>
  `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')}`;

/**
 * Shifts a hex color toward black (negative `amount`) or white (positive),
 * by a fraction in [-1, 1]. Returns the input unchanged if not a 6-digit hex.
 */
export function shade(hex: string, amount: number): string {
  const c = parseHex(hex);
  if (!c) return hex;
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  return toHex({
    r: c.r + (target - c.r) * t,
    g: c.g + (target - c.g) * t,
    b: c.b + (target - c.b) * t,
  });
}

/** Returns an `rgba(...)` string for a hex color at the given alpha. */
export function withAlpha(hex: string, alpha: number): string {
  const c = parseHex(hex);
  if (!c) return hex;
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

/** Picks black or white for legible text/icons on top of `hex`. */
export function readableOn(hex: string): string {
  const c = parseHex(hex);
  if (!c) return '#ffffff';
  // Perceived luminance (0–1).
  const luminance = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
  return luminance > 0.6 ? '#000000' : '#ffffff';
}
