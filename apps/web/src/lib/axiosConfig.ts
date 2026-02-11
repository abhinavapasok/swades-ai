import axios from 'axios'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
})

// Request interceptor — attach auth tokens here in the future
apiClient.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token')
        // if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor — centralized error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.response?.statusText ||
            error.message ||
            'An unexpected error occurred'

        console.error('[API Error]', {
            url: error.config?.url,
            status: error.response?.status,
            message,
        })

        return Promise.reject(new Error(message))
    }
)

export default apiClient
