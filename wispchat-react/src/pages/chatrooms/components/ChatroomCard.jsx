import * as React from 'react';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CreateChatroomDialogButton from "./CreateChatroomDialogButton.jsx";
import {useNavigate} from "react-router-dom";
import TextsmsIcon from "@mui/icons-material/Textsms";


function ChatroomCard({name, userId, values, isMyChatroom, onChatContextMenu, createChatroom}) {

    const navigate = useNavigate();

    return (<>
        <Box sx={{
            margin: {
                xs: '15px', md: '30px'
            }
        }}>
            <Box display="flex" flexDirection="row" gap="5px">
                <Typography variant="h6">{name}</Typography>
                <Typography display={isMyChatroom ? 'none' : 'block'} variant="body2"
                            color="grey">{`#${userId}`}</Typography>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                <Box sx={{
                    marginTop: '15px', display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap',
                }}>
                    {values.map(({id, name}) => (<Button
                        key={id}
                        variant="outlined"
                        onContextMenu={(e) => onChatContextMenu(e, id, name, Boolean(isMyChatroom))}
                        onClick={() => navigate('/chatroom/' + id)}
                        startIcon={<TextsmsIcon/>}
                        endIcon={<KeyboardArrowRightIcon/>}
                        sx={{
                            borderRadius: '10px',
                        }}
                        size="large"
                    >
                        {name}
                    </Button>))}

                    {isMyChatroom && (<Box>
                        <CreateChatroomDialogButton createChatroom={createChatroom}/>
                    </Box>)}
                </Box>
            </Box>
        </Box>
    </>);
}

export default ChatroomCard;