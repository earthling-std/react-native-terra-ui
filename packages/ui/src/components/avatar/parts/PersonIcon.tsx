import Svg, { Circle, Path } from 'react-native-svg';

interface PersonIconProps {
  size: number;
  color: string;
}

export function PersonIcon({ size, color }: PersonIconProps) {
  const iconSize = size * 0.55;
  return (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={8}
        r={4}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 20c0-4 3.582-7 8-7s8 3 8 7"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
