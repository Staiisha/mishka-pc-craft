import axios, {AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {jwtDecode} from 'jwt-decode';

declare module 'axios' {
    interface InternalAxiosRequestConfig {
            _retry?: boolean;
        }
    }


const api = axios.create({
    baseURL:  '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface Tokens {
    access: string;
    refresh: string;
}

interface RefreshResponse {
    access: string;
    refresh: string;
}

const isTokenExpired = (token: string): boolean => {
    try {
        const {exp} = jwtDecode<{exp: number }>(token);
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
};

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('access');

    if (accessToken) {
        if (isTokenExpired(accessToken)) {
            try {
              const refreshToken = localStorage.getItem('refresh');
              if (!refreshToken) throw new Error('No refresh token');
              
              const { data } = await api.post<RefreshResponse>(
                '/refresh/', // Путь относительно baseURL
                { refresh: refreshToken }
              );
              
              localStorage.setItem('access', data.access);
              localStorage.setItem('refresh', data.refresh);
              config.headers = config.headers || {};
              config.headers.Authorization = `Bearer ${data.access}`;
            } catch (error) {
              // Если не удалось обновить - очищаем хранилище
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              window.location.href = '/login';
              return Promise.reject(error);
            }
          } else {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
        
        return config;
      });


      api.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = localStorage.getItem('refresh');
                    if (!refreshToken) throw new Error('No refresh token');

                    const { data } = await api.post<RefreshResponse>('/refresh/', { 
                        refresh: refreshToken 
                      });
                      
                      localStorage.setItem('access', data.access);
                      localStorage.setItem('refresh', data.refresh);
                      
                      if (originalRequest.headers) {
                        originalRequest.headers.Authorization = 'Bearer ${data.access}';
                      }
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
      );

      export default api;