import { createTheme } from '@mui/material/styles';
import { baseTheme } from './baseTheme';

declare module '@mui/material/styles' {
  interface Palette {
    notification: {
      unread: string;
      read: string;
      background: string;
    }
  }

  interface PaletteOptions {
    notification?: {
      unread: string;
      read: string;
      background: string;
    }
  }
}


export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#a62536',
    },
    secondary: {
      main: '#3f51b5',
    },
    background: {
      base1: '#e8e8e8',
    },
    notification: {
      unread: '#fff',
      read: '#f2f6fc',
      background: '#f5f5f5'
    }
  },
  components: {
    ...baseTheme.components,
    MuiButton: {
      styleOverrides: {
        contained: {
          '&:hover': {
            color: '#fff',
          }
        }
      }
    }
  }
});
