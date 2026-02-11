import useAuth from "../hooks/useAuth.js";
import {Navigate} from "react-router-dom";
import CircularLoader from "../components/CircularLoader.jsx";


export default function ProtectedRoute({children}) {

    const {loggedIn, loading} = useAuth()

    if (loading) {
        return <CircularLoader/>
    }

    if (!loggedIn) {
        return <Navigate to='/login' replace/>
    }

    return children;
}