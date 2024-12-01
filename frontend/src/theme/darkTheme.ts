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

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: 'dark',
    primary: {
      main: '#a62536',
    },
    secondary: {
      main: '#3f51b5',
    },
    background: {
      default: '#26272b',
      paper: '#333333',
      base1: '#26272b',
    },
    notification: {
      unread: '#444746',
      read: '#000',
      background: '#181818'
    }
  },
  components: {
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                    },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: '#fff',
                }
            }
        }
    },
MuiFormControl: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                    },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: '#fff',
                }
            }
        }
    }
  }
});
