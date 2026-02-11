import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {useState} from "react";
import Popover from '@mui/material/Popover';

export default function MemberCard({id, name, status}) {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (<Box sx={{
        display: 'flex', flexDirection: 'column', userSelect: 'none'
    }}>
        <Typography variant="body1" noWrap onClick={handleClick}>{name}</Typography>
        <Typography variant="body2" color="grey" noWrap onClick={handleClick}>{status || `#${id}`}</Typography>
        <Popover
            id={open ? 'simple-popover' : undefined}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom', horizontal: 'left',
            }}
        >
            <Typography>{id}</Typography>
        </Popover>
    </Box>)
}