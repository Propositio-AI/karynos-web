import axios from "axios"

// Token helpers (in-memory with localStorage fallback)
let accessToken: string | null = null
const getAccessToken = (): string | null => {
	// read from memory first, then localStorage on client
	if (accessToken) return accessToken
	if (typeof window !== "undefined") {
		accessToken = localStorage.getItem("access_token")
		return accessToken
	}
	return null
}
const setAccessToken = (token: string) => {
	accessToken = token
	if (typeof window !== "undefined") localStorage.setItem("access_token", token)
}
const clearToken = () => {
	accessToken = null
	if (typeof window !== "undefined") localStorage.removeItem("access_token")
}

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
	if (token) {
		config.headers = config.headers ?? {}
		;(config.headers as any).Authorization = `Bearer ${token}`
	}
	return config
})

// Handle 401 on responses and retry after refresh
api.interceptors.response.use(
	res => res,
	async (error) => {
		const originalRequest = error.config as any

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			if (!isRefreshing) {
				isRefreshing = true
				try {
					const res = await axios.post(
						`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
						{},
						{ withCredentials: true }
					)
					const newAccessToken = res.data.access_token
					setAccessToken(newAccessToken)
					onRefreshed(newAccessToken)
				} catch (e) {
					clearToken()
					if (typeof window !== "undefined") window.location.href = "/login"
					return Promise.reject(e)
				} finally {
					isRefreshing = false
				}
			}

			return new Promise((resolve) => {
				subscribeTokenRefresh((token) => {
					originalRequest.headers = originalRequest.headers ?? {}
					originalRequest.headers.Authorization = `Bearer ${token}`
					resolve(api(originalRequest))
				})
			})
		}

		return Promise.reject(error)
	}
)

export default api