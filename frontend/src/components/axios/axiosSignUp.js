import axiosInstance from './axiosInstance';

const axiosSignUp = (username, email, password, setError) => {
    axiosInstance
        .post('/user/create/', {
            username: username,
            email: email,
            password: password,
        })
        .then((response) => {
            setError(() => {});
            return response.data;
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 400) {
                    setError(() => error.response.data);
                }
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
        });
    return [setError];
};

export default axiosSignUp;
