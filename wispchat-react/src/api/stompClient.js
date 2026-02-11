import {Client} from "@stomp/stompjs"
import SockJs from "sockjs-client"
import {API_BASE_URL} from "../constants/config.js";

const connectListeners = new Set()

export function register(func) {
    connectListeners.add(func)
    return () => connectListeners.delete(func)
}

export const stompClient = new Client({
    webSocketFactory: () => new SockJs(`${API_BASE_URL}/ws`, null, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
        timeout: 10000
    }),
    reconnectDelay: 5000,

    beforeConnect: () => console.log('Connecting to WebSocket...'), connectHeaders: {},
    debug: message => console.log(message)
})

stompClient.onConnect = () => connectListeners.forEach(subscription => subscription())

stompClient.onStompError = (frame) => {
    console.error('STOMP error:', frame);
}