import { LargeTitleHeader } from './LargeTitleHeader';
import { TitleHeader } from './TitleHeader';

/**
 * Composite header namespace.
 *
 * - `Header.Title` — compact title bar ({@link TitleHeader}).
 * - `Header.LargeTitle` — collapsing large-title header ({@link LargeTitleHeader}).
 *
 * Both are also exported standalone (`TitleHeader`, `LargeTitleHeader`).
 *
 * @example
 * ```tsx
 * <Screen.Header>
 *   <Header.LargeTitle title="Meditate" />
 * </Screen.Header>
 * ```
 */
export const Header = {
  Title: TitleHeader,
  LargeTitle: LargeTitleHeader,
};
