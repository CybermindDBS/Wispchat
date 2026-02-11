import React, {createContext, useEffect} from 'react';
import {stompClient} from '../../api/stompClient.js';
import useAuth from '../../hooks/useAuth';

const WebSocketContext = createContext(null);

export function WebSocketProvider({children}) {
    const {loggedIn} = useAuth();

    useEffect(() => {
        if (!loggedIn) {
            return;
        }

        console.log('User authenticated, connecting WebSocket...');
        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [loggedIn]);

    return (
        <WebSocketContext.Provider value={stompClient}>
            {children}
        </WebSocketContext.Provider>
    );
}