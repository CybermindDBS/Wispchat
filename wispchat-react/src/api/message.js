import axios from "axios";
import {API_BASE_URL} from "../constants/config.js";

const api = axios.create({
    baseURL: API_BASE_URL, withCredentials: true,
})


export async function getAll(chatroomId) {
    const response = await api.get(`/messages/getAll/${chatroomId}`);
    return response.data;
}

export async function uploadFile(file, chatroomId) {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post(`/chatroom/${chatroomId}/upload`, formData);
}