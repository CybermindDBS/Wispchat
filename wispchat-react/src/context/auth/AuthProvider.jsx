import {useEffect, useState} from 'react';
import {getAuthenticatedUser, loginUser, logoutUser} from "../../api/auth.js";
import {AuthContext} from "./AuthContext";

export function AuthProvider({children}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const verifySessionAndSetUserDetails = async () => {
            try {
                const userData = await getAuthenticatedUser();
                setLoggedIn(true);
                setUser({
                    userId: userData.userId, name: userData.name, provider: userData.provider,
                });
            } catch (err) {
                console.error('Session verification failed:', err);
                setError(err.response?.data?.message || err.message);
                setLoggedIn(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifySessionAndSetUserDetails();


        function onStorageChange(event) {
            if (event.key === "logout") {
                setLoggedIn(false);
                setUser(null);
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            } else if (event.key === "userDetailsUpdate") {
                verifySessionAndSetUserDetails()
            }
        }

        window.addEventListener("storage", onStorageChange);
        return () => window.removeEventListener("storage", onStorageChange);
    }, []);

    const refreshUser = async () => {
        setError(null);
        try {
            const userData = await getAuthenticatedUser();
            setLoggedIn(true);
            setUser({
                userId: userData.userId, name: userData.name, provider: userData.provider,
            });
        } catch (err) {
            console.error('Session verification failed:', err);
            setError(err.response?.data?.message || err.message);
            setLoggedIn(false);
            setUser(null);
        }
    };

    const login = async (userId, password) => {
        setLoading(true);
        setError(null);

        try {
            await loginUser(userId, password);
            const userData = await getAuthenticatedUser();

            setLoggedIn(true);
            setUser({
                userId: userData.userId, name: userData.name, provider: userData.provider,
            });
            return {ok: true};
        } catch (err) {
            let errorMessage = "Something went wrong";
            if (err.response?.status === 401) {
                errorMessage = "Invalid Credentials";
            }
            setError(errorMessage);
            setLoggedIn(false);
            setUser(null);
            return {ok: false, error: errorMessage};
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            await logoutUser();
            setLoggedIn(false);
            setUser(null);
            localStorage.setItem("logout", Date.now().toString());
            return {ok: true};
        } catch {
            const errorMessage = "Something went wrong";
            setError(errorMessage);
            return {ok: false, error: errorMessage};
        } finally {
            setLoading(false);
        }
    };

    return (<AuthContext.Provider value={{user, login, logout, loggedIn, loading, error, refreshUser}}>
        {children}
    </AuthContext.Provider>);
}