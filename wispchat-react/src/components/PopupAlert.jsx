import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';

export default function PopupAlert({message, severity, open, onClose}) {

    return (<div>
        <Snackbar
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top', horizontal: 'center',
            }}
            slots={{transition: Slide}}
            slotProps={{
                transition: {
                    direction: 'down',
                }
            }}
            autoHideDuration={2000}
        >
            <Alert severity={severity} sx={{fontSize: '1rem', mt: '2rem'}}>
                {message}
            </Alert>
        </Snackbar>
    </div>);
}