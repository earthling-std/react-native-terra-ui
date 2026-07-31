import type { RadiusKey, TerraImageProps } from '#theme/types';

export interface ImageProps extends TerraImageProps {
  width?: number;
  height?: number;
  radius?: RadiusKey;
}
