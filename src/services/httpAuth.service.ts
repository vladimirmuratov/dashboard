import axios from "axios";
import {AUTH_URL, WEB_API_KEY} from "../config";

const http = axios.create({
    baseURL: AUTH_URL,
    headers: {
        "Content-Type": "application/json",
    },
    params: {
        key: WEB_API_KEY
    }
})

export const httpAuth = {
    post: http.post
}