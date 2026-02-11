import {useCallback, useEffect, useRef, useState} from "react";
import {get} from "../api/chatroom.js";
import useAuth from "./useAuth.js";
import {useMessages} from "./useMessages.js";

export default function useChatroom(chatroomId, setPopupState) {
    const [chatroom, setChatroom] = useState(null);
    const [chatroomLoading, setChatroomLoading] = useState(true);
    const [error, setError] = useState(null);

    const {user} = useAuth()
    const messageOrder = useRef(10)

    const fetchChatroom = useCallback(async () => {
        if (!chatroomId || !user?.userId) return;

        setChatroomLoading(true);
        setError(null);
        try {
            const chatroomData = await get(chatroomId)
            setChatroom({
                id: chatroomId,
                name: chatroomData.name,
                ownerId: chatroomData.ownerId,
                ownerName: chatroomData.ownerName,
                members: chatroomData.members,
                isMember: chatroomData.members.some(member => member.memberId === user.userId),
                isOwner: chatroomData.ownerId === user.userId,

            });
            return {ok: true}
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message
            setChatroom(null);
            setError(errorMessage)
            return {ok: false, error: errorMessage};
        } finally {
            setChatroomLoading(false);
        }
    }, [chatroomId, user.userId]);

    const handleTypingEvent = useCallback((event) => {
        let memberIdUpdated
        setChatroom((prevState) => {
            return {
                ...prevState, members: prevState.members.map(member => {
                    if (member.memberId === event.senderId) {
                        memberIdUpdated = member.memberId
                        return {...member, status: "typing..."}
                    } else return member;
                })
            }
        })
        setTimeout(() => {
            setChatroom((prevState) => {
                return {
                    ...prevState, members: prevState.members.map(member => {
                        if (member.memberId === memberIdUpdated) {
                            return {...member, status: undefined, order: messageOrder.current++}
                        } else return member;
                    })
                };
            })
        }, 2000)

    }, [])

    const {
        messages, sendMessage, refetchMessages, messagesLoading, deleteMessage, sendTypingEvent, uploadFile,
    } = useMessages(chatroomId, handleTypingEvent, setPopupState)

    useEffect(() => {
        if (!chatroomId) return;

        fetchChatroom()

        const onStorageChange = (event) => {
            if (event.key === "chatroomsUpdate" || event.key === "userDetailsUpdate") fetchChatroom()
        }

        window.addEventListener("storage", onStorageChange)

        return () => {
            window.removeEventListener("storage", onStorageChange)
        }

    }, [chatroomId, fetchChatroom])

    return {
        chatroomLoading: chatroomLoading,
        messagesLoading,
        error,
        chatroom,
        refetch: fetchChatroom,
        messages,
        sendMessage,
        refetchMessages,
        deleteMessage,
        sendTypingEvent,
        uploadFile,
        user
    };
}