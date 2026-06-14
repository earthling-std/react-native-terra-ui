/**
 * Rebuilds a nested object from a flat map of dotted-path keys.
 *
 * @example
 * unflatten({ 'a.b.c': 1, 'a.b.d': 2 }) // → { a: { b: { c: 1, d: 2 } } }
 *
 * Used to turn the flat, Figma-style token data (tokens/*.ts) back into the
 * nested runtime theme shape that components and Unistyles consume. The caller
 * is responsible for asserting the resulting shape (e.g. `as TerraTheme`).
 */
export function unflatten<T = unknown>(flat: Record<string, unknown>): T {
  const root: Record<string, unknown> = {};

  for (const [path, value] of Object.entries(flat)) {
    const segments = path.split('.');
    let node = root;

    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i];
      if (seg === undefined) continue;
      const next = node[seg];
      if (typeof next === 'object' && next !== null) {
        node = next as Record<string, unknown>;
      } else {
        const created: Record<string, unknown> = {};
        node[seg] = created;
        node = created;
      }
    }

    const leaf = segments[segments.length - 1];
    if (leaf !== undefined) node[leaf] = value;
  }

  return root as T;
}
