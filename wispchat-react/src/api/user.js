import axios from "axios";
import {API_BASE_URL} from "../constants/config.js";


const api = axios.create({
    baseURL: API_BASE_URL, withCredentials: true,
})

export async function update(name, password) {
    const response = await api.post('/user/update', {name, password})
    return response.status

}