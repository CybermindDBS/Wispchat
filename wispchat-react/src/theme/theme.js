import {createTheme, responsiveFontSizes} from "@mui/material/styles";

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    }
})

export const responsiveDarkTheme = responsiveFontSizes(darkTheme);