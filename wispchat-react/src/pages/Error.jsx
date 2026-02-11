import * as React from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


function Error({error}) {

    return (<Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
    }}>
        <Typography variant="h4">{error}</Typography>
    </Box>);
}

export default Error;