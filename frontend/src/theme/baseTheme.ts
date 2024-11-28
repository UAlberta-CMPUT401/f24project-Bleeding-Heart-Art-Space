import { ThemeOptions } from '@mui/material/styles';

export const baseTheme: ThemeOptions = {
  cssVariables: true,
  shape: {
    borderRadius: 16,
  },
  palette: {
    orange: {
      main: '#f0a500',
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 5,
      },
    },
  },
}

