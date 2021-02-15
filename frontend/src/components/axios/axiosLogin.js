import axiosInstance from './axiosInstance';

const axiosLogin = async (username, password, setError, setSuccess = null) => {
    try {
        const response = await axiosInstance.post('token/obtain/', {
            username: username,
            password: password,
        });
        axiosInstance.defaults.headers['Authorization'] =
            'Bearer ' + response.data.access;
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setSuccess && setSuccess(() => 'successful');
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                setError(() => error.response.data);
            }
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
    }
    return [setError, setSuccess];
};

export default axiosLogin;
