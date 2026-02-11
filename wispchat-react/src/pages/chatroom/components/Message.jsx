import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import palette from "../../../theme/palette.js";
import * as React from "react";
import {useCallback} from "react";
import {formatLocalTime24} from "../../../utils/dateUtils.js";
import {AttachmentCard} from "./index.js";

const Message = React.memo(function Message({
                                                id,
                                                name,
                                                senderId,
                                                timestamp,
                                                contentType,
                                                content,
                                                deleted,
                                                onMessageContextMenu,
                                                selectedMessage,
                                                chatroomId,
                                            }) {

    const handleContextMenu = useCallback((e) => {
        onMessageContextMenu(e, {
            messageId: id, contentType, children: contentType === "FILE" ? content.name : content, senderId
        })
    }, [id, content, contentType, senderId, onMessageContextMenu])

    if (deleted) {
        return null;
    }

    if (contentType.startsWith("EVENT_MEMBER")) {
        return
    }

    return (<Box onContextMenu={handleContextMenu}
                 sx={{
                     paddingX: '20px', paddingY: '10px', borderRadius: '5px', userSelect: 'none', '&:hover': {
                         backgroundColor: 'rgba(0,0,0,0.93)',
                     }, ...(selectedMessage === id && {
                         backgroundColor: palette.primary.main,
                     })
                 }}
    >

        {!contentType.startsWith("EVENT") && <Box sx={{
            display: 'flex', flexDirection: 'row', gap: '4px'
        }}>
            <Typography variant="h6" noWrap>{name}</Typography>
            <Typography variant="body2" color="grey" noWrap>{`#${senderId}`}</Typography>
            <Typography variant="body2" color="grey" sx={{userSelect: 'none'}}
                        noWrap>{formatLocalTime24(timestamp)}</Typography>
        </Box>}

        {contentType === "TEXT" && (<Box>
            <Typography variant="h6" sx={{
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>{content}</Typography>
        </Box>)}
        {contentType === "FILE" && <AttachmentCard content={content} chatroomId={chatroomId}/>}

    </Box>)
})

export default Message