import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../axios/axiosInstance';
import LoginContext from '../context/LoginContext';

const LogOut = () => {
    let history = useHistory();
    const { setLoggedIn } = useContext(LoginContext);

    async function loggingOut() {
        await axiosInstance.post('/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        localStorage.clear();
        axiosInstance.defaults.headers['Authorization'] = null;

        setLoggedIn(false);
        history.push('/');
    }

    useEffect(() => {
        loggingOut();
    });

    return (
        <section className="flex flex-col items-center md:flex-row">
            <div className="container flex justify-center mx-auto">
                <div className="flex w-full rounded-lg xl:w-3/4 lg:w-auto lg:shadow-xl ">
                    <div className="w-full px-8 py-16 border-gray-100 rounded-lg lg:w-1/2 lg:px-12 lg:rounded-l-none">
                        <div className="relative z-10 text-left ">
                            <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-center md:hidden purple-blue-gradient text-gradient sm:text-3xl font-montserrat">
                                Loggin out
                            </h2>
                            <p>
                                You are being logged out and redirected to the
                                front page.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LogOut;
