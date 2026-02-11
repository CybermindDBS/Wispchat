import * as React from 'react';
import {useCallback} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import ChatroomCard from "./components/ChatroomCard.jsx";
import Divider from '@mui/material/Divider'
import ElementAnchorMenu from "../../components/ElementAnchorMenu.jsx";
import useChatrooms from "../../hooks/useChatrooms.js";
import useAuth from "../../hooks/useAuth.js";
import groupChatrooms from "../../utils/groupChatrooms.js";
import capitalizeWords from "../../utils/capitalizeWords.js";
import PopupAlert from "../../components/PopupAlert.jsx";
import {FRONTEND_BASE_URL} from "../../constants/config.js";


function Chatrooms() {

    const {user} = useAuth()

    const {chatrooms, createChatroom, leaveChatroom, deleteChatroom} = useChatrooms()

    const [popupState, setPopupState] = React.useState({open: false, severity: "success", message: ""});

    const [selectedChatroom, setSelectedChatroom] = React.useState(null);

    const [chatroomMenuAnchorEl, setChatroomMenuAnchorEl] = React.useState(null)

    const handleOpenChatroomMenu = useCallback((event, chatroomId, name, isMyChatroom) => {
        event.preventDefault()
        setChatroomMenuAnchorEl(event.currentTarget)
        setSelectedChatroom({chatroomId, name, isMyChatroom})
    }, [])

    const handleCloseChatroomMenu = () => {
        setChatroomMenuAnchorEl(null)
    }

    const myChatroomMenuOptions = React.useMemo(() => [{
        status: 'Copy Invitation Link', action: () => {
            navigator.clipboard.writeText(`${FRONTEND_BASE_URL}/chatroom/${selectedChatroom.chatroomId}`)
            setPopupState({open: true, severity: "info", message: `Copied`});
        }
    }, {
        status: 'Delete', action: async () => {
            if (!selectedChatroom) return
            const {chatroomId, name} = selectedChatroom
            const result = await deleteChatroom(chatroomId)
            if (result.ok) {
                setPopupState({open: true, severity: "info", message: `Deleted ${name}`});
            } else setPopupState({open: true, severity: "error", message: result.error});
        }
    }], [deleteChatroom, selectedChatroom])

    const otherChatroomMenuOptions = React.useMemo(() => [{
        status: 'Copy Invitation Link', action: () => {
            navigator.clipboard.writeText(`${FRONTEND_BASE_URL}/chatroom/${selectedChatroom.chatroomId}`)
            setPopupState({open: true, severity: "info", message: `Copied`});
        }
    }, {
        status: 'Leave', action: async () => {
            if (!selectedChatroom) return
            const {chatroomId, name} = selectedChatroom
            const result = await leaveChatroom(chatroomId)
            if (result.ok) {
                setPopupState({open: true, severity: "info", message: `Left from ${name}`});
            } else setPopupState({open: true, severity: "error", message: result.error});
        }
    }], [selectedChatroom, leaveChatroom])

    const handleChatroomMenuSelect = (option) => {
        option.action()
        handleCloseChatroomMenu()
    }

    const myChatrooms = React.useMemo(() => chatrooms.filter(chatroom => chatroom.ownerId === user.userId), [chatrooms, user.userId])

    const otherChatrooms = React.useMemo(() => {
        return Array.from(groupChatrooms(chatrooms.filter(chatroom => chatroom.ownerId !== user.userId)).entries())
    }, [chatrooms, user.userId])


    return (<Container maxWidth="none" sx={{marginY: '8vh'}}>
        <Box sx={{
            display: 'flex', flexDirection: 'column', gap: '15px',
        }}>
            <Typography variant="h3" sx={{
                marginX: {
                    xs: '15px', md: '30px',
                }
            }}>Chat rooms</Typography>
            <Divider variant="middle" sx={{marginBottom: '30px'}}/>
        </Box>

        <Box sx={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
        }}>


            <ChatroomCard
                isMyChatroom={true}
                values={myChatrooms.map(chatroom => {
                    return {id: chatroom.chatroomId, name: chatroom.name}
                })}
                onChatContextMenu={handleOpenChatroomMenu} name="My Chat Rooms"
                createChatroom={createChatroom}/>

        </Box>

        <Box sx={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
        }}>
            {otherChatrooms.map(([key, value]) => (<ChatroomCard
                key={key}
                values={value.map(chatroom => {
                    return {id: chatroom.chatroomId, name: chatroom.name}
                })}
                onChatContextMenu={handleOpenChatroomMenu} name={capitalizeWords(value[0].ownerName)}
                userId={key}/>))}
        </Box>

        <ElementAnchorMenu anchorEl={chatroomMenuAnchorEl} onClose={handleCloseChatroomMenu}
                           options={selectedChatroom?.isMyChatroom ? myChatroomMenuOptions : otherChatroomMenuOptions}
                           onSelect={handleChatroomMenuSelect}
                           orientation={{y: 'top', x: 'right'}}
        />

        <PopupAlert key={popupState.message} open={popupState.open} message={popupState.message}
                    severity={popupState.severity} onClose={() => {
            setPopupState((prevState) => {
                return {...prevState, open: false};
            });
        }}></PopupAlert>
    </Container>);
}

export default Chatrooms;