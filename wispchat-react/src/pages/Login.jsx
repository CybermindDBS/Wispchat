import * as React from 'react';
import {useState} from 'react';
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
import Google from '@mui/icons-material/Google'
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import useAuth from "../hooks/useAuth.js";
import {API_BASE_URL} from "../constants/config.js";

function Login({setGlobalPopup}) {

    const {login} = useAuth()

    const navigate = useNavigate()


    const {
        register, handleSubmit, formState: {errors}
    } = useForm()


    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = async (data) => {
        const result = await login(data.userId, data.password)
        if (result.ok) {
            navigate('/')
        } else {
            console.log(result)
            setGlobalPopup({
                open: true,
                severity: "error",
                message: result.error,
            })
        }
    }

    return (<>
        <Container maxWidth="xl" sx={{
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
                    <Typography variant="h4">Login</Typography>
                    <Divider/>
                    <TextField variant="outlined"
                               label="User ID"
                               fullWidth
                               slotProps={{
                                   input: {
                                       startAdornment: (<InputAdornment position="start">
                                           <PersonOutlined sx={{color: 'grey'}}/>
                                       </InputAdornment>)
                                   }
                               }}
                               {...register("userId", {
                                   required: "User ID is required", pattern: {
                                       value: /^[a-zA-Z0-9]+$/, message: "Invalid user ID format",
                                   }
                               })}
                               error={!!errors.userId}
                               helperText={errors.userId?.message}
                    ></TextField>
                    <TextField type={showPassword ? 'text' : 'password'}
                               variant="outlined"
                               label="Password"
                               fullWidth
                               {...register("password", {
                                   required: "Password is required"
                               })}
                               error={!!errors.password}
                               helperText={errors.password?.message}
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
                               }}></TextField>
                    <Divider/>
                    <Button type="submit" variant="contained" size="large" fullWidth>Login</Button>
                    <Typography>or login with</Typography>
                    <Button variant="outlined" size="large" fullWidth startIcon={<Google/>}
                            onClick={() => window.location.href = `${API_BASE_URL}/oauth2/authorization/google`}
                    >Google</Button>
                    <Divider/>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                        <Typography>not a member?</Typography>
                        <Typography component="a" onClick={() => navigate('/register')}
                                    sx={{textDecoration: 'underline', cursor: 'pointer'}}>sign up
                            now</Typography>
                    </Box>
                </Stack>
            </Box>
        </Container>
    </>)
}

export default Login