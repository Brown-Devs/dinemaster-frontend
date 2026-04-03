// src/theme/muiTheme.js
import { createTheme } from "@mui/material/styles";

const createAppTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
          primary: { main: "#000000" },
          background: { default: "#ffffff", paper: "#ffffff", other: '#f0f0f0' },
          text: { primary: "#171717" },
          tableHeader: { primary: "#f9fafb" },
          sidebarHighlight: { main: "#e8e8e8" }
        }
        : {
          primary: { main: "#ffffff" },
          background: { default: "#0a0a0a", paper: "#0f1724", other: '#0a0a0a' },
          tableHeader: { primary: "#171717" },
          text: { primary: "#ededed" },
          sidebarHighlight: { main: "#e8e8e8" }
        }),
    },

    typography: {
      fontFamily: "var(--font-sans), Inter, sans-serif",
    },

    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "6px 5px",
          },
          head: {
            padding: "7px 5px", // slightly bigger for header readability
            fontWeight: 600,
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            minHeight: 28,
            paddingTop: 2,
            paddingBottom: 2,
          },
        },
      },

      MuiMenuList: {
        styleOverrides: {
          root: {
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: {
            padding: 4,
          },
        },
      },
    },
  });

export default createAppTheme;
