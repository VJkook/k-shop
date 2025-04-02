import axios from 'axios'

const baseURL = 'http://localhost:8000'

const instance = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers':
			'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
		'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
	},
})

instance.interceptors.request.use(config => {
	const auth = localStorage.getItem('auth')
	config.headers['Bearer'] = auth

	return config
})

instance.interceptors.response.use(
	response => {
		return response
	},
	error => {
		// if (error.response.status === 401 && window.location.pathname !== '/auth') {
		// 	localStorage.removeItem('auth')
		// 	//window.location.replace('/auth')
		// }
		// console.error(error.response)

		return error.response
	},
)

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
