import * as React from 'react';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import {ThemeProvider} from "@mui/material";
import {responsiveDarkTheme} from "../theme/theme.js";
import Container from "@mui/material/Container";
import AppRoutes from "../routes/AppRoutes.jsx";
import AppHeader from "../components/AppHeader.jsx";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "../context/auth/AuthProvider.jsx";
import PopupAlert from "../components/PopupAlert.jsx";
import {WebSocketProvider} from "../context/websocket/WebSocketProvider.jsx";


function App() {

    const [popupState, setPopupState] = React.useState({open: false, severity: "success", message: ""});

    return (
        <AuthProvider>
            <WebSocketProvider>
                <BrowserRouter>
                    <ThemeProvider theme={responsiveDarkTheme}>
                        <CssBaseline/>
                        <Container maxWidth={"none"} disableGutters sx={{overflowX: 'hidden'}}>
                            <AppHeader setGlobalPopup={setPopupState}/>
                            <AppRoutes setGlobalPopup={setPopupState}/>
                            <PopupAlert key={popupState.message} open={popupState.open} message={popupState.message}
                                        severity={popupState.severity} onClose={() => {
                                setPopupState((prevState) => {
                                    return {...prevState, open: false};
                                });
                            }}></PopupAlert>
                        </Container>
                    </ThemeProvider>
                </BrowserRouter>
            </WebSocketProvider>
        </AuthProvider>
    );
}

export default App
