import axios from "axios";
import {ACCESS_TOKEN, API_URL} from "./constants";

let instance = axios.create()
instance.defaults.withCredentials = true;

instance.defaults.baseURL = API_URL
instance.defaults.headers = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
    "Content-Type": "application/json",
    "Accept": " */*",
    "Host": "apialfa.apoint.uz",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Content-Length": 71,
    "Access-Control-Allow-Origin":"*"
} as any;

const onRequestSuccess = (config: any) => {
    let token = localStorage.getItem(ACCESS_TOKEN)
    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    }
    return config
}

const onRequestError = (config: any) => {
    return Promise.reject(config)
}

const onResponseSuccess = (config: any) => {
    return config
}

const onResponseError = (error: any) => {
    return Promise.reject(error)
}

instance.interceptors.request.use(onRequestSuccess, onRequestError)

instance.interceptors.response.use(onResponseSuccess, onResponseError)

export default instance