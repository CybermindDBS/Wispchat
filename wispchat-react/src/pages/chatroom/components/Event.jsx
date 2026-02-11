import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function Event({text}) {

    return (<Box display="flex" flexDirection="column" sx={{
        justifyContent: 'center', alignItems: 'center', marginY: '20px',
        userSelect: 'none'
    }}>
        <Typography variant="subtitle2">{text}</Typography>
    </Box>)
}