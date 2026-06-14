// Import from the `/theme` entry, NOT the root: the root barrel loads
// `./context`, whose import-time `configureTerraUI()` default would otherwise
// run first and lock the registry, turning this explicit call into a no-op.
// The `/theme` entry has no such side effect, so this config wins.
import { configureTerraUI } from 'react-native-terra-ui/theme';

// Configure BEFORE any component loads (this module is imported first in index.js).
configureTerraUI({
  accents: {
    emerald: { light: '#00bc7d', dark: '#00bc7d' },
    indigo: { light: '#4f46e5', dark: '#818cf8' },
    rose: { light: '#e11d48', dark: '#fb7185' },
    amber: { light: '#d97706', dark: '#fbbf24' },
  },
  defaults: { accent: 'emerald' },
  components: {
    button: { radius: 'full' },
    surface: { radius: 'xl', elevation: 'sm' },
  },
});
