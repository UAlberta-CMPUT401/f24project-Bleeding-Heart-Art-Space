import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    orange: {
      main: string;
    };
  }
  interface PaletteOptions {
    orange?: {
      main: string;
    };
  }

  interface TypeBackground {
    base1: string;
  }
  interface Theme {
    cssVariables: boolean;
  }
  interface ThemeOptions {
    cssVariables?: boolean;
  }
}
