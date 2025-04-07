import axios from 'axios';

const api = axios.create({
    baseURL: 'https://mishka-pc-craft-backend.ru/api/auth/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;