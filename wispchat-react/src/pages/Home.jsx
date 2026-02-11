import * as React from 'react';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";


function Home() {

    let textTheme = createTheme();
    textTheme = responsiveFontSizes(textTheme);


    let navigate = useNavigate();

    return (<Container maxWidth="xl">
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 150px)',
            gap: 2,
        }}>
            <Typography variant="h1" noWrap sx={{userSelect: 'none'}}>Start Chatting!</Typography>
            <Button variant="outlined" onClick={() => navigate('/register')}>Register now</Button>
        </Box>
    </Container>);
}

export default Home