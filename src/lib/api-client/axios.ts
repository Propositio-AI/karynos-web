import axios from "axios"
import { getAccessToken, setAccessToken, clearToken } from "../auth/token"

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token))
    refreshSubscribers = []
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = getAccessToken()

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.request.use(
    res => res,
    async error => {
        const originalRequest = error.config


        if(error.response?.status == 401 && !originalRequest._retry){
            originalRequest._retry = true

            if(!isRefreshing){
                isRefreshing = true

                try {
                    const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
                        {},
                        {
                            withCredentials: true
                        }
                    )

                    const newAccessToken = res.data.access_token
                    
                    setAccessToken(newAccessToken)
                    onRefreshed(newAccessToken)
                }catch (e){
                    clearToken()
                    window.location.href = "/login"
                    return Promise.reject(e)
                }finally{
                    isRefreshing = false
                }
            }

            return new Promise((resolve) => {
                subscribeTokenRefresh((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    resolve(api(originalRequest))
                })
            })
        }

        if (error.response?.status >= 400) {
            console.error("API Error:", {
                url: error.config?.url,
                status: error.response.status,
                message: error.response.data?.message || error.message,
            });
        }

        return Promise.reject(error)
    }
)

export default api