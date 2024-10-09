import { createTheme } from '@mui/material/styles';
import { baseTheme } from './baseTheme';

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      base1: '#1e1e1e',
    },
  },
});
