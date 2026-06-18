import Svg, { Circle, Path } from 'react-native-svg';

import type {
  TerraIconComponent,
  TerraIconProps,
  TerraSemanticIconName,
} from '#theme/types';

const DEFAULT_SIZE = 20;
const DEFAULT_COLOR = '#000000';
const DEFAULT_STROKE_WIDTH = 2;

const resolveIconProps = ({
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_STROKE_WIDTH,
}: TerraIconProps) => ({ color, size, strokeWidth });

const strokeProps = (color: string, strokeWidth: number) => ({
  stroke: color,
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

const SvgIcon = ({
  size,
  children,
}: {
  size: number;
  children: React.ReactNode;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {children}
  </Svg>
);

const PathIcon = ({ d, ...props }: TerraIconProps & { d: string }) => {
  const { color, size, strokeWidth } = resolveIconProps(props);

  return (
    <SvgIcon size={size}>
      <Path d={d} {...strokeProps(color, strokeWidth)} />
    </SvgIcon>
  );
};

const BackIcon: TerraIconComponent = (props) => (
  <PathIcon d="M15 18l-6-6 6-6" {...props} />
);

const ForwardIcon: TerraIconComponent = (props) => (
  <PathIcon d="M9 18l6-6-6-6" {...props} />
);

const CloseIcon: TerraIconComponent = (props) => (
  <PathIcon d="M18 6L6 18M6 6l12 12" {...props} />
);

const InfoIcon: TerraIconComponent = (props) => {
  const { color, size, strokeWidth } = resolveIconProps(props);
  const stroke = strokeProps(color, strokeWidth);

  return (
    <SvgIcon size={size}>
      <Circle cx={12} cy={12} r={10} {...stroke} />
      <Path d="M12 16v-4" {...stroke} />
      <Path d="M12 8h.01" {...stroke} />
    </SvgIcon>
  );
};

const SuccessIcon: TerraIconComponent = (props) => {
  const { color, size, strokeWidth } = resolveIconProps(props);
  const stroke = strokeProps(color, strokeWidth);

  return (
    <SvgIcon size={size}>
      <Circle cx={12} cy={12} r={10} {...stroke} />
      <Path d="m9 12 2 2 4-4" {...stroke} />
    </SvgIcon>
  );
};

const WarningIcon: TerraIconComponent = (props) => {
  const { color, size, strokeWidth } = resolveIconProps(props);
  const stroke = strokeProps(color, strokeWidth);

  return (
    <SvgIcon size={size}>
      <Path
        d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
        {...stroke}
      />
      <Path d="M12 9v4" {...stroke} />
      <Path d="M12 17h.01" {...stroke} />
    </SvgIcon>
  );
};

const DangerIcon: TerraIconComponent = (props) => {
  const { color, size, strokeWidth } = resolveIconProps(props);
  const stroke = strokeProps(color, strokeWidth);

  return (
    <SvgIcon size={size}>
      <Circle cx={12} cy={12} r={10} {...stroke} />
      <Path d="M12 8v4" {...stroke} />
      <Path d="M12 16h.01" {...stroke} />
    </SvgIcon>
  );
};

export const defaultIcons: Record<TerraSemanticIconName, TerraIconComponent> = {
  'navigation.back': BackIcon,
  'navigation.forward': ForwardIcon,
  'navigation.close': CloseIcon,
  'status.info': InfoIcon,
  'status.success': SuccessIcon,
  'status.warning': WarningIcon,
  'status.danger': DangerIcon,
};
