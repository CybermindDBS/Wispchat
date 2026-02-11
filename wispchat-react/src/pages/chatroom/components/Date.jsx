import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import {formatLocalDate} from '../../../utils/dateUtils.js'

export default function Date({timestamp}) {

    return (<Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        marginY: '10px',
        userSelect: 'none',
    }}>
        <Divider variant="middle" flexItem>
            <Typography paddingX="15px">{formatLocalDate(timestamp)}</Typography>
        </Divider>
    </Box>)
}