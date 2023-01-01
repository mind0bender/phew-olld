import { DefaultColors } from "tailwindcss/types/generated/colors";

const colors: DefaultColors = require("tailwindcss/colors");
import { createTheme, Theme } from "@mui/material/styles";

const muiTheme: Theme = createTheme({
  palette: {
    primary: {
      main: colors.emerald[400],
      ...colors.emerald,
    },
    secondary: {
      main: colors.zinc[50],
      ...colors.zinc,
    },
  },
});

export default muiTheme;
