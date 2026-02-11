import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function JoinMessage() {

    return (<Box display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'center'}>
        <Typography paddingX={3} textAlign={"center"}>
            Join to send & view messages in this chat room.
        </Typography>
    </Box>)
}