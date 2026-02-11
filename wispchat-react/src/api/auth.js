import {API_BASE_URL} from "../constants/config.js";
import axios from "axios";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export async function loginUser(userId, password) {
    const response = await api.post(
        "/login",
        new URLSearchParams({username: userId, password}),
        {
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        }
    );
    return response.data;
}

export async function getAuthenticatedUser() {
    const response = await api.get("/user/me");
    return response.data;
}

export async function logoutUser() {
    const response = await api.post("/logout");
    return response.data;
}

export async function registerUser(user) {
    const response = await api.post("/user/register", user);
    return response.data;
}