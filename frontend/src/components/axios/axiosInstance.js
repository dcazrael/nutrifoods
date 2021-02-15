import axios from 'axios';
import { baseURL } from './baseURL';

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            originalRequest.url === baseURL + 'token/refresh/'
        ) {
            window.location.href = '/log-in';
            return Promise.reject(error);
        } else if (
            error.response.status === 401 &&
            error.response.data.detail === 'Token is blacklisted'
        ) {
            localStorage.clear();
            axiosInstance.defaults.headers['Authorization'] = null;
            window.location.href = '/log-in';
            return Promise.reject(error);
        }

        if (
            error.response.status === 401 &&
            error.response.data.detail ===
                'No active account found with the given credentials'
        ) {
            return Promise.reject(error);
        }
        if (
            error.response.data.code === 'token_not_valid' &&
            error.response.status === 401 &&
            error.response.statusText === 'Unauthorized'
        ) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                // exp date in token is expressed in seconds, while now() returns milliseconds:
                const now = Math.ceil(Date.now() / 1000);

                if (tokenParts.exp > now) {
                    return axiosInstance
                        .post('/token/refresh/', { refresh: refreshToken })
                        .then((response) => {
                            localStorage.setItem(
                                'access_token',
                                response.data.access
                            );
                            localStorage.setItem(
                                'refresh_token',
                                response.data.refresh
                            );

                            axiosInstance.defaults.headers['Authorization'] =
                                'Bearer ' + response.data.access;
                            originalRequest.headers['Authorization'] =
                                'Bearer ' + response.data.access;

                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    console.log(
                        'Refresh token is expired',
                        tokenParts.exp,
                        now
                    );
                    window.location.href = '/log-in/';
                }
            } else {
                console.log('Refresh token not available.');
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
