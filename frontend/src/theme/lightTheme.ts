import { createTheme } from '@mui/material/styles';
import { baseTheme } from './baseTheme';

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
  },
});
