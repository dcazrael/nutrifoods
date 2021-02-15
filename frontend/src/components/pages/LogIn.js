import { ReactComponent as LoginImage } from '../../static/images/fitness_stats.svg';
import { useState, useEffect } from 'react';
import axiosLogin from '../axios/axiosLogin';
import { useHistory } from 'react-router-dom';
import LoginComponent from '../layout/LoginComponent';

const LogIn = () => {
    let history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    function handleSubmit(e) {
        setError(() => {});
        e.preventDefault();

        axiosLogin(username, password, setError, setSuccess);
    }

    useEffect(() => {
        if (success) {
            history.push('/profile');
        }
    }, [success, history]);

    return (
        <section className="flex flex-col items-center md:flex-row">
            <div className="container flex justify-center mx-auto">
                <div className="flex w-full rounded-lg xl:w-3/4 lg:w-auto lg:shadow-xl ">
                    <div className="relative hidden w-full h-auto px-8 py-8 bg-cover border-r rounded-lg rounded-l-lg md:block lg:w-1/2 lg:px-12">
                        <h1 className="mt-10 mb-2 text-2xl font-semibold tracking-tighter purple-blue-gradient text-gradient sm:text-3xl font-montserrat">
                            Log in to your account
                        </h1>
                        <div className="w-full mt-8 mb-8 text-base leading-relaxed text-gray-900">
                            <LoginImage />
                        </div>
                    </div>
                    <LoginComponent
                        submit={handleSubmit}
                        username={username}
                        password={password}
                        error={error}
                        setUsername={setUsername}
                        setPassword={setPassword}
                    />
                </div>
            </div>
        </section>
    );
};

export default LogIn;
