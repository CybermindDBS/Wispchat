import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextsmsIcon from '@mui/icons-material/Textsms';
import AddIcon from "@mui/icons-material/Add";
import PopupAlert from "../../../components/PopupAlert.jsx";
import {FRONTEND_BASE_URL} from "../../../constants/config.js";

export default function CreateChatroomDialogButton({createChatroom}) {

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const [created, setCreated] = React.useState(false);

    const [chatroom, setChatroom] = React.useState(null);

    const handleClickOpen = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
        setCreated(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const name = formJson.name;
        const result = await createChatroom(name);
        if (result.ok) {
            setCreated(true);
            setChatroom(result.data);
            setPopupState({open: true, severity: "success", message: "Chat room is created"});
        } else {
            setPopupState({open: true, severity: result.severity, message: result.error});
        }
    };


    const [popupState, setPopupState] = React.useState({open: false, severity: "success", message: ""});

    const handleClickCopy = () => {
        navigator.clipboard.writeText(`${FRONTEND_BASE_URL}/chatroom/${chatroom.chatroomId}`);
        setPopupState({open: true, severity: "info", message: "Copied!"});
    }

    return (<React.Fragment>
        <Button
            variant="outlined"
            onClick={handleClickOpen}
            startIcon={<TextsmsIcon/>}
            endIcon={<AddIcon/>}
            sx={{
                borderRadius: '10px'
            }}
            size="large"
        >Create New
        </Button>
        <Dialog
            open={dialogOpen}
            onClose={handleClose}
            fullWidth={true}
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "20px"
                }
            }}
        >
            <DialogTitle sx={{paddingTop: 3, paddingBottom: 1, paddingX: 4}}>Create a chat room</DialogTitle>
            <DialogContent sx={{paddingX: 4}}>

                <form onSubmit={handleSubmit} id="create-chatroom-form">
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        size="medium"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '9px',
                            }
                        }}
                        onChange={() => setCreated(false)}
                    />
                </form>
            </DialogContent>
            <DialogActions sx={{paddingTop: 1, paddingBottom: 2, paddingX: 4}}>
                <Button onClick={handleClose} size="small">Close</Button>
                {created && <Button onClick={handleClickCopy}
                                    sx={{
                                        fontSize: {
                                            xs: "0.675rem", sm: "0.875rem",
                                        }
                                    }}>Copy Invitation Link</Button>}
                <Button disabled={created} type="submit" form="create-chatroom-form" variant="contained" size="small">
                    {created ? "Created" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>

        <PopupAlert message={popupState.message} severity={popupState.severity} key={popupState.message}
                    open={popupState.open}
                    onClose={() => setPopupState(prevState => {
                        return {...prevState, open: false};
                    })}></PopupAlert>
    </React.Fragment>);
}