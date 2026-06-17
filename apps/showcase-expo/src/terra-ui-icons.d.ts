import type { TerraIconComponent } from 'react-native-terra-ui/theme';

declare global {
  namespace TerraUI {
    interface IconRegistry {
      add: TerraIconComponent;
      trash: TerraIconComponent;
    }
  }
}

declare module 'react-native-terra-ui/theme' {
  interface TerraIconRegistry extends TerraUI.IconRegistry {}
}

declare module 'react-native-terra-ui' {
  interface TerraIconRegistry extends TerraUI.IconRegistry {}
}
