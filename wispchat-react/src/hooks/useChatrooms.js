import {useCallback, useEffect, useState} from "react";
import {create, getAll, join, leave, remove} from "../api/chatroom.js";


export default function useChatrooms() {
    const [chatrooms, setChatrooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchChatrooms = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const chatroomData = await getAll()
            setChatrooms(chatroomData)
        } catch (err) {
            setError(err.response?.data?.message || err.message)
            console.log(err)
        } finally {
            setLoading(false)
        }

    }, [])

    const joinChatroom = async (id) => {
        setLoading(true)
        setError(null)
        try {
            await join(id)
            localStorage.setItem("chatroomsUpdate", Date.now().toString())
            return {ok: true}
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message
            setError(errorMessage)
            return {ok: false, error: errorMessage}
        } finally {
            setLoading(false)
        }
    }

    const leaveChatroom = async (id) => {
        try {
            await leave(id)
            await fetchChatrooms()
            localStorage.setItem("chatroomsUpdate", Date.now().toString())
            return {ok: true}
        } catch (err) {
            let errorMessage = err.response?.data?.message || "Something went wrong"
            return {
                ok: false, error: errorMessage
            }
        }
    }

    const createChatroom = async (name) => {
        try {
            const chatroomData = await create(name)
            await fetchChatrooms()
            localStorage.setItem("chatroomsUpdate", Date.now().toString())
            return {ok: true, data: chatroomData}
        } catch (err) {
            let errorMessage = err.response?.data?.message || "Something went wrong"
            let severity = errorMessage === "Chatroom with the given name already exists" ? "warning" : "error";
            return {
                ok: false, severity, error: errorMessage
            }
        }
    }

    const deleteChatroom = async (id) => {
        try {
            await remove(id)
            await fetchChatrooms()
            localStorage.setItem("chatroomsUpdate", Date.now().toString())
            return {ok: true}
        } catch (err) {
            let errorMessage = err.response?.data?.message || "Something went wrong"
            return {
                ok: false, error: errorMessage
            }
        }
    }

    useEffect(() => {
        fetchChatrooms()

        const onStorageChange = async (event) => {
            if (event.key === "chatroomsUpdate") fetchChatrooms()
        }

        window.addEventListener("storage", onStorageChange)

        return () => {
            window.removeEventListener("storage", onStorageChange)
        }

    }, [fetchChatrooms])

    return {
        chatrooms,
        chatroomLoading: loading,
        error,
        fetchChatrooms,
        joinChatroom,
        leaveChatroom,
        createChatroom,
        deleteChatroom
    }
}