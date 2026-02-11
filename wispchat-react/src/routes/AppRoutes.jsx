import {Navigate, Route, Routes} from "react-router-dom";
import Home from "../pages/Home.jsx"
import Chatrooms from "../pages/chatrooms/Chatrooms.jsx";
import Chatroom from "../pages/chatroom/Chatroom.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Profile from "../pages/Profile.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import useAuth from "../hooks/useAuth.js";
import CircularLoader from "../components/CircularLoader.jsx";

export default function AppRoutes({setGlobalPopup}) {
    const {loggedIn, loading} = useAuth()

    if (loading) return <CircularLoader/>

    return (<Routes>
        <Route path="/" element={loggedIn ? <Chatrooms/> : <Home/>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path="/login"
               element={loggedIn ? <Navigate to={'/'} replace/> : <Login setGlobalPopup={setGlobalPopup}/>}/>
        <Route path="/register" element={<Register setGlobalPopup={setGlobalPopup}/>}/>
        <Route path="/chatroom/:chatroomId" element={<ProtectedRoute><Chatroom/></ProtectedRoute>}/>
    </Routes>)
}

