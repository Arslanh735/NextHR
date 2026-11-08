import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563EB",
      dark: "#1D4ED8",
      light: "#DBEAFE",
    },

    secondary: {
      main: "#0F172A",
    },

    background: {
      default: "#F5F7FB",
      paper: "#FFFFFF",
    },

    success: {
      main: "#16A34A",
    },

    warning: {
      main: "#D97706",
    },

    error: {
      main: "#DC2626",
    },

    text: {
      primary: "#172033",
      secondary: "#64748B",
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",

    h4: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E8EDF5",
          boxShadow: "0 2px 12px rgba(15,23,42,0.035)",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

export default theme;