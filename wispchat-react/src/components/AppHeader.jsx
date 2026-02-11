import Typography from "@mui/material/Typography";
import * as React from "react";
import stringAvatar from "../utils/stringAvatar.js";
import {useLocation, useNavigate} from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ElementAnchorMenu from "../components/ElementAnchorMenu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import useAuth from "../hooks/useAuth.js";

export default function AppHeader({setGlobalPopup}) {

    const {user, loggedIn, logout, loading} = useAuth();

    const location = useLocation()

    const navigate = useNavigate();

    const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null)

    if (loading) return;

    const handleOpenUserMenu = (event) => {
        setUserMenuAnchorEl(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setUserMenuAnchorEl(null)
    }

    const userMenuOptions = [{
        status: 'Home', action: () => navigate('/')
    }, {
        status: 'Profile', action: () => navigate('/profile')
    }, {
        status: 'Logout', action: async () => {
            const result = await logout()
            if (result.ok) {
                navigate('/login')
            } else {
                setGlobalPopup({
                    open: true,
                    severity: "error",
                    message: result.error,
                })
            }
        }
    }]

    const handleUserMenuSelect = ({action}) => {
        action()
        handleCloseUserMenu()
    }

    return (<AppBar position='sticky'>
        <Toolbar>
            <Box sx={{flexGrow: 1, alignItems: 'center'}}>
                <Typography variant="h3" noWrap
                            sx={{display: 'inline-block', cursor: 'pointer', userSelect: 'none'}}
                            onClick={() => navigate('/')}>
                    wispchat
                </Typography>
            </Box>

            {loggedIn && <Box sx={{flexGrow: 0, display: 'flex', justifyContent: 'center'}}>
                <Tooltip title="Options">
                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                        <Avatar {...stringAvatar(user.name)} />
                    </IconButton>
                </Tooltip>

                <ElementAnchorMenu anchorEl={userMenuAnchorEl} onClose={handleCloseUserMenu}
                                   options={userMenuOptions}
                                   onSelect={handleUserMenuSelect}
                                   orientation={{y: 'top', x: 'left'}}
                />

            </Box>}
            {location.pathname !== '/login' && !loggedIn && (
                <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>)}

        </Toolbar>
    </AppBar>)
}