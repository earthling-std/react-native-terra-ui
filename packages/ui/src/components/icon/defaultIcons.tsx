import { Text, View } from 'react-native';

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

const ChevronIcon = ({
  direction,
  ...props
}: TerraIconProps & { direction: 'back' | 'forward' }) => {
  const { color, size, strokeWidth } = resolveIconProps(props);
  const lineLength = size * 0.46;
  const offset = lineLength * 0.34;
  const rotateTop = direction === 'back' ? '-45deg' : '45deg';
  const rotateBottom = direction === 'back' ? '45deg' : '-45deg';
  const translateX = direction === 'back' ? -offset * 0.2 : offset * 0.2;

  return (
    <View
      pointerEvents="none"
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: lineLength,
          height: strokeWidth,
          borderRadius: strokeWidth,
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY: -offset },
            { rotate: rotateTop },
          ],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: lineLength,
          height: strokeWidth,
          borderRadius: strokeWidth,
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY: offset },
            { rotate: rotateBottom },
          ],
        }}
      />
    </View>
  );
};

const BackIcon: TerraIconComponent = (props) => (
  <ChevronIcon direction="back" {...props} />
);

const ForwardIcon: TerraIconComponent = (props) => (
  <ChevronIcon direction="forward" {...props} />
);

const CloseIcon: TerraIconComponent = (props) => {
  const { color, size, strokeWidth } = resolveIconProps(props);
  const lineLength = size * 0.62;

  return (
    <View
      pointerEvents="none"
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: lineLength,
          height: strokeWidth,
          borderRadius: strokeWidth,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: lineLength,
          height: strokeWidth,
          borderRadius: strokeWidth,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
};

const SuccessIcon: TerraIconComponent = (props) => {
  const { color, size, strokeWidth } = resolveIconProps(props);

  return (
    <View
      pointerEvents="none"
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.5,
          height: size * 0.28,
          borderLeftWidth: strokeWidth,
          borderBottomWidth: strokeWidth,
          borderColor: color,
          transform: [{ rotate: '-45deg' }, { translateY: -size * 0.05 }],
        }}
      />
    </View>
  );
};

const CircleGlyphIcon = ({
  glyph,
  ...props
}: TerraIconProps & { glyph: string }) => {
  const { color, size, strokeWidth } = resolveIconProps(props);

  return (
    <View
      pointerEvents="none"
      style={{
        width: size,
        height: size,
        borderWidth: strokeWidth,
        borderColor: color,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color,
          fontSize: size * 0.68,
          lineHeight: size * 0.74,
          fontWeight: '700',
          includeFontPadding: false,
        }}
      >
        {glyph}
      </Text>
    </View>
  );
};

const InfoIcon: TerraIconComponent = (props) => (
  <CircleGlyphIcon glyph="i" {...props} />
);

const WarningIcon: TerraIconComponent = (props) => (
  <CircleGlyphIcon glyph="!" {...props} />
);

const DangerIcon: TerraIconComponent = (props) => (
  <CircleGlyphIcon glyph="!" {...props} />
);

export const defaultIcons: Record<TerraSemanticIconName, TerraIconComponent> = {
  'navigation.back': BackIcon,
  'navigation.forward': ForwardIcon,
  'navigation.close': CloseIcon,
  'status.info': InfoIcon,
  'status.success': SuccessIcon,
  'status.warning': WarningIcon,
  'status.danger': DangerIcon,
};
