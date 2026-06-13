import { palette } from './palette';

/** Interactive emphasis role (buttons, pressables). */
export interface InteractiveRole {
  bg: string;
  fg: string;
  hover: string;
  active: string;
  disabled: string;
}

/** Feedback status role (alerts, badges) — soft + solid variants. */
export interface StatusRole {
  solid: string;
  onSolid: string;
  surface: string;
  onSurface: string;
  border: string;
}

/** Semantic color group — the layer components consume. */
export interface ThemeColor {
  background: string;
  surface: {
    base: string;
    raised: string;
    sunken: string;
    overlay: string;
  };
  content: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    link: string;
    accent: string;
    onAccent: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
    focus: string;
  };
  action: {
    primary: InteractiveRole;
    secondary: InteractiveRole;
    neutral: InteractiveRole;
  };
  status: {
    success: StatusRole;
    warning: StatusRole;
    danger: StatusRole;
    info: StatusRole;
  };
}

const n = palette.slate;

export const lightColor: ThemeColor = {
  background: n[100],
  surface: {
    base: palette.white,
    raised: palette.white,
    sunken: n[100],
    overlay: 'rgba(2, 6, 24, 0.45)',
  },
  content: {
    primary: n[950],
    secondary: n[600],
    tertiary: n[500],
    disabled: n[400],
    inverse: palette.white,
    link: palette.blue[600],
    accent: palette.emerald[600],
    onAccent: palette.white,
  },
  border: {
    default: n[200],
    subtle: n[100],
    strong: n[300],
    focus: palette.blue[500],
  },
  action: {
    primary: {
      bg: palette.emerald[600],
      fg: palette.white,
      hover: palette.emerald[700],
      active: palette.emerald[800],
      disabled: n[200],
    },
    secondary: {
      bg: palette.emerald[50],
      fg: palette.emerald[700],
      hover: palette.emerald[100],
      active: palette.emerald[200],
      disabled: n[100],
    },
    neutral: {
      bg: 'transparent',
      fg: n[700],
      hover: n[100],
      active: n[200],
      disabled: 'transparent',
    },
  },
  status: {
    success: {
      solid: palette.green[600],
      onSolid: palette.white,
      surface: palette.green[50],
      onSurface: palette.green[800],
      border: palette.green[200],
    },
    warning: {
      solid: palette.amber[500],
      onSolid: n[950],
      surface: palette.amber[50],
      onSurface: palette.amber[800],
      border: palette.amber[200],
    },
    danger: {
      solid: palette.red[600],
      onSolid: palette.white,
      surface: palette.red[50],
      onSurface: palette.red[800],
      border: palette.red[200],
    },
    info: {
      solid: palette.sky[600],
      onSolid: palette.white,
      surface: palette.sky[50],
      onSurface: palette.sky[800],
      border: palette.sky[200],
    },
  },
};

export const darkColor: ThemeColor = {
  background: n[900],
  surface: {
    base: n[800],
    raised: n[700],
    sunken: n[950],
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    primary: n[50],
    secondary: n[300],
    tertiary: n[400],
    disabled: n[600],
    inverse: n[950],
    link: palette.blue[300],
    accent: palette.emerald[400],
    onAccent: n[950],
  },
  border: {
    default: n[700],
    subtle: n[800],
    strong: n[600],
    focus: palette.blue[400],
  },
  action: {
    primary: {
      bg: palette.emerald[500],
      fg: n[950],
      hover: palette.emerald[400],
      active: palette.emerald[300],
      disabled: n[700],
    },
    secondary: {
      bg: palette.emerald[950],
      fg: palette.emerald[300],
      hover: palette.emerald[900],
      active: palette.emerald[800],
      disabled: n[800],
    },
    neutral: {
      bg: 'transparent',
      fg: n[300],
      hover: n[800],
      active: n[700],
      disabled: 'transparent',
    },
  },
  status: {
    success: {
      solid: palette.green[500],
      onSolid: n[950],
      surface: palette.green[950],
      onSurface: palette.green[200],
      border: palette.green[800],
    },
    warning: {
      solid: palette.amber[400],
      onSolid: n[950],
      surface: palette.amber[950],
      onSurface: palette.amber[200],
      border: palette.amber[800],
    },
    danger: {
      solid: palette.red[500],
      onSolid: palette.white,
      surface: palette.red[950],
      onSurface: palette.red[200],
      border: palette.red[800],
    },
    info: {
      solid: palette.sky[500],
      onSolid: n[950],
      surface: palette.sky[950],
      onSurface: palette.sky[200],
      border: palette.sky[800],
    },
  },
};
