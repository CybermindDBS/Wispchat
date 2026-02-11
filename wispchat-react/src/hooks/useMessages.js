import {register, stompClient} from "../api/stompClient.js";
import {useCallback, useEffect, useState} from "react";
import {getAll, uploadFile as uploadAttachment} from "../api/message.js";

export function useMessages(chatroomId, handleTypingEvent, setPopupState) {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingComplete, setFetchingComplete] = useState(false);
    const [stompRegisterComplete, setStompRegisterComplete] = useState(false);

    const sendMessage = (event) => {
        if (!stompClient.connected) {
            setPopupState({
                open: true,
                severity: "warn",
                message: "Connecting to chat… please wait. Refresh if it takes too long."
            })
            return;
        }
        stompClient.publish({
            destination: `/app/event/send`, body: JSON.stringify(event),
        })
    }

    const refetchMessages = useCallback(async () => {

        try {
            const messages = await getAll(chatroomId)
            setMessages(messages)
            return {ok: true}
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message
            return {ok: false, errorMessage}
        }
    }, [chatroomId])

    const handleEvent = useCallback((frame) => {
        const event = JSON.parse(frame.body)
        if (event.contentType.startsWith("EVENT_DELETE") && event.status === 'COMPLETE') refetchMessages(); else if (event.contentType.startsWith("EVENT_TYPING")) handleTypingEvent(event); else if (event.contentType.startsWith("EVENT_FILE")) {
            if (event.status === 'COMPLETE') refetchMessages();
        } else setMessages((prevMessages) => [...prevMessages, event]);

    }, [handleTypingEvent, refetchMessages])

    const deleteMessage = (event) => {
        stompClient.publish({
            destination: `/app/event/delete`, body: JSON.stringify(event),
        })
    }

    const sendTypingEvent = (event) => {
        stompClient.publish({
            destination: `/app/event/type`, body: JSON.stringify(event),
        })
    }

    const uploadFile = async (file) => {
        const response = await uploadAttachment(file, chatroomId)
        return {ok: response.status === 201};
    };

    useEffect(() => {
        setLoading(true)
        const fetchPreviousMessages = async () => {
            try {
                setFetchingComplete(false);
                const messages = await getAll(chatroomId)
                setMessages(messages)
                return {ok: true}
            } catch (err) {
                const errorMessage = err.response?.data?.error || err.message
                return {ok: false, errorMessage}
            } finally {
                setFetchingComplete(true)
            }
        }

        fetchPreviousMessages()

        let subscription
        const subscribe = () => {
            setStompRegisterComplete(false)
            if (subscription) {
                subscription.unsubscribe()
            }

            subscription = stompClient.subscribe(`/topic/chatroom/${chatroomId}`, (frame) => handleEvent(frame))
            setStompRegisterComplete(true)
        }

        if (stompClient.connected) subscribe();
        const unregister = register(subscribe)

        return () => {
            unregister()
            if (subscription) subscription.unsubscribe();
        }
    }, [chatroomId, handleEvent])

    useEffect(() => {
        if (fetchingComplete && stompRegisterComplete) setLoading(false); else setLoading(true)
    }, [fetchingComplete, stompRegisterComplete])

    return {
        messagesLoading: loading, messages, sendMessage, refetchMessages, deleteMessage, sendTypingEvent, uploadFile,
    }
}