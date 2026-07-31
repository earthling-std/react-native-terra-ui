// Import from the `/theme` entry, NOT the root: the root barrel loads
// `./context`, whose import-time `configureTerraUI()` default would otherwise
// run first and lock the registry, turning this explicit call into a no-op.
// The `/theme` entry has no such side effect, so this config wins.

import { Image } from 'expo-image';
import { Plus, Trash2 } from 'lucide-react-native';

import {
  configureTerraUI,
  type TerraImageComponent,
  type TerraTheme,
} from 'react-native-terra-ui/theme';

declare module 'react-native-unistyles' {
  interface UnistylesThemes {
    light: TerraTheme;
    dark: TerraTheme;
  }
}

const TerraImage: TerraImageComponent = ({
  source,
  style,
  accessibilityLabel,
  contentFit = 'cover',
  placeholder,
  onError,
}) => (
  <Image
    source={source}
    style={style}
    accessibilityLabel={accessibilityLabel}
    contentFit={contentFit}
    placeholder={placeholder}
    onError={onError ? () => onError() : undefined}
  />
);

// Configure BEFORE any component loads (this module is imported first in index.js).
configureTerraUI({
  shared: {
    radius: { base: 12 },
    layout: {
      screen: { margin: { x: 20, y: 16 } },
      header: { height: 50 },
    },
    typography: {
      fonts: {
        regular: 'NunitoSans_400Regular',
        medium: 'NunitoSans_500Medium',
        semibold: 'NunitoSans_600SemiBold',
        bold: 'NunitoSans_700Bold',
      },
    },
  },
  accents: {
    emerald: { light: '#00bc7d', dark: '#00bc7d' },
    indigo: { light: '#4f46e5', dark: '#818cf8' },
    rose: { light: '#e11d48', dark: '#fb7185' },
    amber: { light: '#d97706', dark: '#fbbf24' },
  },
  defaultAccent: 'emerald',
  icons: {
    add: Plus,
    trash: Trash2,
  },
  image: TerraImage,
  components: {
    button: { radius: 'full' },
    surface: { radius: 'xl', elevation: 'sm' },
  },
});
