import * as React from 'react';
import {useCallback, useLayoutEffect, useMemo, useRef} from 'react';
import Typography from '@mui/material/Typography'
import {useNavigate, useParams} from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from '@mui/icons-material/Send';
import {Date, JoinChatroomButton, JoinMessage, Message} from "./components";
import ElementAnchorMenu from "../../components/ElementAnchorMenu.jsx";
import PositionAnchorMenu from "../../components/PositionAnchorMenu.jsx";
import Divider from "@mui/material/Divider";
import MemberList from "./components/MemberList.jsx";
import useChatroom from "../../hooks/useChatroom.js";
import useChatrooms from "../../hooks/useChatrooms.js";
import PopupAlert from "../../components/PopupAlert.jsx";
import CircularLoader from "../../components/CircularLoader.jsx";
import Error from "../../pages/Error.jsx";
import {AnimatePresence, motion} from "framer-motion";
import {FRONTEND_BASE_URL} from "../../constants/config.js";
import {isAtLeastNextDayLocal} from "../../utils/dateUtils.js";
import Event from "./components/Event.jsx";
import AttachFileButton from "./components/AttachFileButton.jsx";

function Chatroom() {

    const {chatroomId} = useParams()

    const [popupState, setPopupState] = React.useState({open: false, severity: "success", message: ""});

    const {
        chatroom,
        chatroomLoading,
        messagesLoading,
        error,
        refetch,
        messages,
        sendMessage,
        refetchMessages,
        deleteMessage,
        sendTypingEvent,
        uploadFile,
        user
    } = useChatroom(chatroomId, setPopupState);

    const {joinChatroom, leaveChatroom, deleteChatroom} = useChatrooms();

    const navigate = useNavigate();

    const [selectedMessage, setSelectedMessage] = React.useState(null);

    const [messageMenuAnchorPosition, setMessageMenuAnchorPosition] = React.useState(null)

    const [groupMenuAnchorEl, setGroupMenuAnchorEl] = React.useState(null)

    const [sendMessageContent, setSendMessageContent] = React.useState("")

    const [initialAnimationComplete, setInitialAnimationComplete] = React.useState(false);

    const messageSectionRef = React.useRef(null);

    const messageSectionBottomRef = React.useRef(null);

    const typingEventTimeout = useRef(false)

    const memberList = useMemo(() => chatroom?.members?.map((member) => {
        return {id: member.memberId, name: member.memberName, status: member.status, order: member.order}
    }), [chatroom?.members])

    const handleOpenMessageMenu = useCallback((event, {messageId, contentType, children, senderId}) => {
        event.preventDefault()
        setMessageMenuAnchorPosition({
            top: event.clientY, left: event.clientX,
        })
        setSelectedMessage({messageId, contentType, children, senderId})
    }, [])

    const handleCloseMessageMenu = () => {
        setMessageMenuAnchorPosition(null)
        setSelectedMessage(null)
    }

    const myMessageMenuOptions = [{
        status: 'Copy', action: () => {
            navigator.clipboard.writeText(selectedMessage?.children)
        }
    }, {
        status: 'Delete', action: () => {
            deleteMessage({
                id: selectedMessage.messageId, chatroomId,
            })
        }
    }]

    const otherMessageMenuOptions = [{
        status: 'Copy', action: () => {
            navigator.clipboard.writeText(selectedMessage?.children)
        }
    }]

    const handleMessageMenuSelect = (option) => {
        option.action()
        handleCloseMessageMenu()
    }

    const handleOpenGroupMenu = (event) => {
        event.preventDefault()
        setGroupMenuAnchorEl(event.currentTarget)
    }

    const handleCloseGroupMenu = () => {
        setGroupMenuAnchorEl(null)
    }

    const handleGroupMenuSelect = (option) => {
        option.action()
        handleCloseGroupMenu()
    }

    const handleJoinChatroom = async () => {
        const result = await joinChatroom(chatroomId)
        if (result.ok) {
            await refetch()
            await refetchMessages()
            setPopupState({open: true, severity: "success", message: "Joined chatroom"});
        } else setPopupState({open: true, severity: "error", message: result.error});
    }

    const handleSendMessage = () => {
        if (sendMessageContent.trim() === "") return
        sendMessage({
            chatroomId: chatroomId, content: sendMessageContent
        })
        setSendMessageContent("")
    }

    useLayoutEffect(() => {
        const messageSectionEl = messageSectionRef.current
        const messageSectionBottomEl = messageSectionBottomRef.current
        if (!messageSectionEl || !messageSectionBottomEl) return;
        const isNearBottom = messageSectionEl.scrollHeight - (messageSectionEl.scrollTop + messageSectionEl.clientHeight) < 600
        if (isNearBottom) messageSectionBottomEl.scrollIntoView({behavior: "smooth"})

    }, [messages, initialAnimationComplete]);

    if (chatroomLoading || messagesLoading) return <CircularLoader/>
    if (!chatroomLoading && error) return <Error error={error}/>

    const groupMenuOptions = [{
        status: 'Copy Invitation Link', action: () => {
            navigator.clipboard.writeText(`${FRONTEND_BASE_URL}/chatroom/${chatroomId}`)
            setPopupState({open: true, severity: "info", message: `Copied`});
        }
    }, ...(chatroom.isMember ? [{
        status: 'Leave', action: async () => {
            const result = await leaveChatroom(chatroomId)
            if (result.ok) {
                setPopupState({open: true, severity: "info", message: "Left chatroom"});
                refetch()
            } else setPopupState({open: true, severity: "error", message: result.error});
        }
    }] : [])]

    const ownerGroupMenuOptions = [{
        status: 'Copy Invitation Link', action: () => {
            navigator.clipboard.writeText(`${FRONTEND_BASE_URL}/chatroom/${chatroomId}`)
            setPopupState({open: true, severity: "info", message: `Copied`});
        }
    }, {
        status: 'Delete', action: async () => {
            const result = await deleteChatroom(chatroomId)
            if (result.ok) {
                navigate('/')
            } else setPopupState({open: true, severity: "error", message: result.error});
        }
    }]

    const handleFileUpload = async (file) => {
        setPopupState({open: true, severity: "info", message: "Uploading..."})
        const result = await uploadFile(file, chatroomId)
        if (result.ok) setPopupState({
            open: true, severity: "success", message: "Uploaded!"
        }); else setPopupState({open: true, severity: "error", message: "Something went wrong"});
    }

    return (<Container maxWidth={"none"} disableGutters sx={{
        display: 'flex', flexDirection: 'row', height: 'calc(100vh - 64px)',
    }}>
        <Box sx={{
            display: 'flex', flexDirection: 'column', flexGrow: 1,
        }}>


            <Box>
                <Box sx={{
                    height: '60px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    userSelect: 'none',
                    padding: '10px',
                }}>
                    <Typography>Group name</Typography>
                    <IconButton onClick={handleOpenGroupMenu}><ExpandMoreIcon fontSize="small"/></IconButton>
                </Box>
                <Divider/>
            </Box>


            <Box
                sx={{
                    display: 'flex', flexDirection: 'row', flexGrow: 1, overflow: 'hidden',
                }}>

                <Box sx={{
                    display: {
                        xs: 'none', sm: 'flex',
                    }, flexDirection: 'column', paddingRight: '10px',
                }}>
                    <Box sx={{padding: '10px'}}>
                        <Typography variant="subtitle1">Members</Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            paddingX: '10px',
                            width: {
                                xs: '140px', md: '150px'
                            },
                        }}>
                        <MemberList members={memberList}/>
                    </Box>
                </Box>


                <Divider orientation="vertical" variant="middle" flexItem sx={{
                    display: {
                        xs: 'none', sm: 'flex',
                    },
                }}/>


                <Box
                    sx={{
                        display: 'flex', flexDirection: 'column', flexGrow: 1, marginY: '25px',
                    }}>


                    <Box
                        ref={messageSectionRef}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: "1",
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        }}
                    >
                        {!chatroom.isMember && <JoinMessage/>}

                        {chatroom.isMember && (<motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: initialAnimationComplete ? 1 : 0}}
                                transition={{duration: 0.2, ease: 'easeOut'}}
                            >
                                <AnimatePresence initial={true}>
                                    {messages?.map((message, index) => {

                                        let prevTimestamp = messages[(index - 1) >= 0 ? index - 1 : 0].timestamp
                                        let currentTimestamp = messages[index].timestamp

                                        return (<motion.div
                                            key={message.id}
                                            layout
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            transition={{
                                                layout: {
                                                    type: 'spring', stiffness: 500, damping: 35,
                                                }, opacity: {duration: 0.25},
                                            }}

                                            onAnimationComplete={index === messages.length - 1 ? () => {
                                                if (!initialAnimationComplete) {
                                                    setInitialAnimationComplete(true)
                                                    messageSectionBottomRef.current.scrollIntoView({behavior: "instant"})
                                                }
                                            } : undefined}
                                        >


                                            {isAtLeastNextDayLocal(prevTimestamp, currentTimestamp) &&
                                                <Date timestamp={currentTimestamp}/>}
                                            {message.contentType.startsWith("EVENT_MEMBER") && (<Event
                                                text={`${message.senderName} ${message.contentType.endsWith("JOIN") ? "joined" : "left"}`}/>)}


                                            <Message id={message.id} name={message.senderName}
                                                     senderId={message.senderId}
                                                     senderName={message.senderName}
                                                     timestamp={message.timestamp}
                                                     contentType={message.contentType}
                                                     deleted={message.deleted}
                                                     onMessageContextMenu={handleOpenMessageMenu}
                                                     selectedMessage={selectedMessage?.messageId}
                                                     content={message.contentType === "FILE" ? !message?.content ? message.content : JSON.parse(message?.content) : message?.content}
                                                     chatroomId={chatroomId}
                                            />
                                        </motion.div>)
                                    })}
                                </AnimatePresence>
                            </motion.div>

                        )}

                        <div ref={messageSectionBottomRef}/>
                    </Box>


                    <Box sx={{
                        flexBasis: '60px', margin: '5px 20px 0 20px'

                    }}>

                        {chatroom.isMember && <TextField
                            placeholder="Say something..."
                            variant="outlined"
                            multiline
                            fullWidth
                            maxRows={9}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '15px',
                                },
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (<InputAdornment position="start" sx={{
                                        alignSelf: 'flex-end', pb: 1
                                    }}>
                                        <AttachFileButton handleFileUpload={handleFileUpload}/>
                                    </InputAdornment>), endAdornment: (<InputAdornment position="end" sx={{
                                        alignSelf: 'flex-end', pb: 1
                                    }}>
                                        <IconButton onClick={handleSendMessage}><SendIcon/></IconButton>
                                    </InputAdornment>)
                                }
                            }}
                            value={sendMessageContent}
                            onChange={(e) => {
                                setSendMessageContent(e.target.value)
                                if (typingEventTimeout.current === false) {
                                    sendTypingEvent({chatroomId})
                                    typingEventTimeout.current = true
                                    setTimeout(() => typingEventTimeout.current = false, 3000)
                                }

                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage()
                                }
                            }}
                            autoFocus
                        >
                        </TextField>}

                        {!chatroom.isMember && <JoinChatroomButton handleClick={handleJoinChatroom}/>}
                    </Box>


                </Box>


            </Box>
        </Box>

        <PositionAnchorMenu anchorPosition={messageMenuAnchorPosition} onClose={handleCloseMessageMenu}
                            options={selectedMessage?.senderId === user.userId ? myMessageMenuOptions : otherMessageMenuOptions}
                            onSelect={handleMessageMenuSelect}/>

        <ElementAnchorMenu anchorEl={groupMenuAnchorEl} onClose={handleCloseGroupMenu}
                           options={chatroom.isOwner ? ownerGroupMenuOptions : groupMenuOptions}
                           onSelect={handleGroupMenuSelect}
                           orientation={{y: 'top', x: 'left'}}
        />

        <PopupAlert key={popupState.message} open={popupState.open} message={popupState.message}
                    severity={popupState.severity} onClose={() => {
            setPopupState((prevState) => {
                return {...prevState, open: false};
            });
        }}></PopupAlert>

    </Container>);
}

export default Chatroom;