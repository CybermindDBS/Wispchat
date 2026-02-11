import axios from "axios";
import {API_BASE_URL} from "../constants/config.js";


const api = axios.create({
    baseURL: API_BASE_URL, withCredentials: true,
})

export async function getAll() {
    const response = await api.get('/chatroom/list');
    return response.data;
}

export async function create(name) {
    const response = await api.post(`/chatroom/create`, new URLSearchParams({name}), {"Content-Type": "application/x-www-form-urlencoded"});
    return response.data;
}

export async function remove(id) {
    const response = await api.delete(`/chatroom/${id}/delete`);
    return response.data;
}

export async function join(id) {
    const response = await api.post(`/chatroom/${id}/join`)
    return response.data;
}

export async function leave(id) {
    const response = await api.delete(`/chatroom/${id}/leave`)
    return response.data;
}

export async function get(id) {
    const response = await api.get(`/chatroom/${id}/get`);
    return response.data;
}