import {useContext} from 'react'
import {AuthContext} from "../context/auth/AuthContext.jsx";

export default function useAuth() {
    return useContext(AuthContext);
}