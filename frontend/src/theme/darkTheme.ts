import { createTheme } from '@mui/material/styles';
import { baseTheme } from './baseTheme';

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#a62536',
    },
    secondary: {
      main: '#3f51b5',
    },
    background: {
      base1: '#1e1e1e',
    },
  },
});
