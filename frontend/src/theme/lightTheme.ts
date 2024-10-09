import { createTheme } from '@mui/material/styles';
import { baseTheme } from './baseTheme';

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});
