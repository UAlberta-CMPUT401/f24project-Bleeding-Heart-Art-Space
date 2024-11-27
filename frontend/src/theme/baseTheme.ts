import { ThemeOptions } from '@mui/material/styles';

export const baseTheme: ThemeOptions = {
  cssVariables: true,
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 5,
      },
    },
  },
}
