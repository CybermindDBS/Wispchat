import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined'
import {useForm} from "react-hook-form";
import useAuth from "../hooks/useAuth.js";
import {updateUser} from "../service/userService.js";
import PopupAlert from "../components/PopupAlert.jsx";
import * as React from "react";
import {useState} from "react";

function Profile() {

    const {user, refreshUser} = useAuth()

    const [popupState, setPopupState] = React.useState({open: false, severity: "success", message: ""});

    const {
        register, handleSubmit, formState: {errors}
    } = useForm({
        defaultValues: {
            name: user?.name || ""
        }
    })


    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = async (data) => {
        const result = await updateUser(data.name, data.password)
        if (result.ok) {
            refreshUser()
            localStorage.setItem("userDetailsUpdate", Date.now().toString());
            setPopupState({
                open: true, severity: "success", message: "Updated successfully",
            })
        } else {
            setPopupState({
                open: true, severity: "error", message: result.error,
            })
        }
    }

    return (<>
        <Container maxWidth="md" sx={{
            height: 'calc(100vh - 150px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'fit-content',
        }}>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} width="70%" minWidth="400px" maxWidth="500px">

                <Stack direction="column" spacing={2} sx={{
                    alignItems: 'center', padding: '50px', gap: '10px', borderRadius: '10px',
                }}>
                    <Typography variant="h4">Edit profile</Typography>
                    <Divider/>
                    <TextField variant="outlined"
                               label="Name"
                               fullWidth
                               {...register("name", {
                                   required: "Name is required"
                               })}
                               error={!!errors.name}
                               helperText={errors.name?.message}
                               autoComplete="new-name"
                               sx={{
                                   '& .MuiOutlinedInput-root': {
                                       borderRadius: '50px',
                                   }
                               }}
                    ></TextField>
                    <TextField variant="outlined"
                               label="User ID"
                               value={user.userId}
                               fullWidth
                               disabled
                               slotProps={{
                                   input: {
                                       startAdornment: (<InputAdornment position="start">
                                           <PersonOutlined sx={{color: 'grey'}}/>
                                       </InputAdornment>)
                                   }
                               }}
                               autoComplete="new-userId"
                               sx={{
                                   '& .MuiOutlinedInput-root': {
                                       borderRadius: '50px',
                                   }
                               }}
                    ></TextField>
                    <TextField type={showPassword ? 'text' : 'password'}
                               variant="outlined"
                               label="Password"
                               fullWidth
                               autoComplete="new-password"
                               {...register("password")}
                               slotProps={{
                                   input: {
                                       startAdornment: (<InputAdornment position="start">
                                           <LockOutlined sx={{color: 'grey'}}/>
                                       </InputAdornment>), endAdornment: (<InputAdornment position="end">
                                           <IconButton
                                               onClick={handleClickShowPassword}
                                               onMouseDown={handleMouseDownPassword}
                                               onMouseUp={handleMouseUpPassword}
                                               edge="end"
                                           >
                                               {showPassword ? <VisibilityOutlined/> : <VisibilityOffOutlined/>}
                                           </IconButton>
                                       </InputAdornment>)
                                   }
                               }}
                               sx={{
                                   '& .MuiOutlinedInput-root': {
                                       borderRadius: '50px',
                                   }
                               }}
                    ></TextField>
                    <Divider/>
                    <Button type="submit" variant="contained" size="large" fullWidth
                            sx={{borderRadius: '50px'}}
                    >Update</Button>
                </Stack>
            </Box>
            <PopupAlert key={popupState.message} open={popupState.open} message={popupState.message}
                        severity={popupState.severity} onClose={() => {
                setPopupState((prevState) => {
                    return {...prevState, open: false};
                });
            }}></PopupAlert>
        </Container>
    </>)
}

export default Profile