import axios, {InternalAxiosRequestConfig} from 'axios'

const baseURL = 'http://localhost:8000'

axios.defaults.withCredentials = false;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

    },
});

instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (config.url && config.url.includes('/login')) {
            await instance.get('http://localhost:8000/sanctum/csrf-cookie');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export function apiLogin(email: string, password: string) {
    return apiPost('/api/login', {
        email: email,
        password: password
    })
}

export function apiGet(url: string) {
    return instance.get(`${url}`).then(response => response)
}

export function apiPost(url: string, payload: any) {
    return instance.post(`${url}`, payload).then(response => response)
}

export function apiPut(url: string, payload: any) {
    return instance.put(`${url}`, payload).then(response => response)
}

export function apiDelete(url: string) {
    return instance.delete(`${url}`).then(response => response)
}

export function apiSearchUsers(url: string) {
    return instance.get(url).then(response => response)
}

export default instance
