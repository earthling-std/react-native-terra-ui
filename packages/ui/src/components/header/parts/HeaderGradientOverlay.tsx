import { useId } from 'react';
import Svg, {
  Defs,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg';

export interface HeaderGradientOverlayProps {
  /** Fill color, fading from fully opaque to 90% opacity along the gradient. */
  color: string;
}

/** Vertical fade-out overlay behind header content, shared by header variants. */
export function HeaderGradientOverlay({ color }: HeaderGradientOverlayProps) {
  const gradientId = useId();

  return (
    <Svg height="100%" width="100%">
      <Defs>
        <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="1" />
          <Stop offset="1" stopColor={color} stopOpacity="0.9" />
        </SvgLinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  );
}
