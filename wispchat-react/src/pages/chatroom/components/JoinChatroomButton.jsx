import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export default function JoinChatroomButton({handleClick}) {

    return (<Box display="flex" height="100%" alignItems={"flex-end"} justifyContent={'center'}>
        <Button variant="outlined" size="large" fullWidth onClick={handleClick}>Join Chat Room</Button>
    </Box>)
}