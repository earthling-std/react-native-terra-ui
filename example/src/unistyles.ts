import { configureTerraUI } from 'react-native-terra-ui/theme';

// Configure BEFORE any component loads. Imported first in index.js so the root
// package's import-time default becomes a guarded no-op and these accents win.
configureTerraUI({
  accents: {
    emerald: { light: '#009966', dark: '#00bc7d' },
    indigo: { light: '#4f46e5', dark: '#818cf8' },
    rose: { light: '#e11d48', dark: '#fb7185' },
    amber: { light: '#d97706', dark: '#fbbf24' },
  },
  defaultAccent: 'emerald',
});
