import {useState} from "react";
import {registerUser} from '../api/auth.js';

export function useRegister() {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (user) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await registerUser(user);
            setSuccess(true);
            return {ok: true};
        } catch (err) {
            let errorMessage = "Registration failed";
            if (err.status === 409) {
                errorMessage = "User already exists";
            }
            setError(errorMessage);
            return {ok: false, error: errorMessage};
        } finally {
            setLoading(false);
        }
    };

    return {register, chatroomLoading: loading, success, error};
}