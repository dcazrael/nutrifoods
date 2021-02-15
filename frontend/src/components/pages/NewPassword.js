import Alert from '../layout/Alert';
import Button from '../layout/Button';
import InputBox from '../layout/InputBox';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../axios/baseURL';
import { useHistory } from 'react-router-dom';

const NewPassword = (query) => {
    let history = useHistory();
    const { username, token } = query;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    function handleSubmit(e) {
        setSuccess(false);
        setError(false);
        e.preventDefault();

        if (password !== confirmPassword) {
            setError({ password: "The passwords don't match" });
            return;
        }

        axios
            .post(baseURL + 'user/new-password', {
                username: username,
                password: password,
                token: token,
            })
            .then((result) => {
                setSuccess(result.data.message);
            })
            .catch((error) => {
                setError(error.response.data.error);
            });
    }

    useEffect(() => {
        if (success) {
            setInterval(() => {
                history.push('/log-in');
            }, 5000);
        }
    }, [error, success, history]);

    return (
        <section className="flex flex-col items-center md:flex-row">
            <div className="container flex justify-center mx-auto">
                <div className="flex w-full rounded-lg xl:w-3/4 lg:w-11/12 lg:shadow-xl ">
                    <div className="relative hidden w-full h-auto px-8 py-16 bg-cover border-r rounded-lg rounded-l-lg bg-purple-1300 md:block lg:w-1/2 lg:px-12">
                        <h2 className="mt-2 mb-2 text-2xl font-semibold tracking-tighter purple-blue-gradient text-gradient sm:text-3xl font-montserrat">
                            Set new password
                        </h2>
                        <div className="w-full mt-4 leading-relaxed text-gray-900 text-1xl">
                            <p className="mb-4 text-lg">
                                While your token is valid, you can set a new
                                password.
                            </p>
                        </div>
                    </div>
                    <div className="w-full px-8 py-16 border-gray-100 rounded-lg bg-purple-1300 lg:w-1/2 lg:px-12 lg:rounded-l-none">
                        <div className="relative z-10 text-left ">
                            <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-center md:hidden purple-blue-gradient text-gradient sm:text-3xl font-montserrat">
                                Set new password
                            </h2>
                            <form
                                className="mt-6 md:mt-0"
                                onSubmit={handleSubmit}
                                method="POST"
                            >
                                {success && (
                                    <Alert type="success">{success}</Alert>
                                )}
                                {error && (
                                    <Alert type="danger">
                                        {error}. <br />
                                        Please send a new{' '}
                                        <strong>"Forgot Password"</strong>{' '}
                                        request.
                                    </Alert>
                                )}
                                <div className="relative inline-block w-full p-0 mt-6 mr-1 bg-white rounded shadow-lg sm:mr-3">
                                    <InputBox
                                        type="password"
                                        required
                                        placeholder=" "
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e)}
                                        autoComplete="on"
                                    >
                                        Your Password
                                    </InputBox>
                                </div>
                                <div className="relative inline-block w-full p-0 mt-6 mr-1 bg-white rounded shadow-lg sm:mr-3">
                                    <InputBox
                                        type="password"
                                        required
                                        placeholder=" "
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e)}
                                        autoComplete="on"
                                    >
                                        Password Confirmation
                                    </InputBox>
                                </div>

                                <Button
                                    borderColor="border-green-300"
                                    gradientColor="green-teal-gradient"
                                    className="w-full mt-6"
                                >
                                    Set password
                                </Button>
                            </form>
                            <hr className="w-full my-6 border-gray-300" />
                            {error && (
                                <p className="mt-8 text-center lg:mb-8">
                                    Token not valid?{' '}
                                    <a
                                        href="/forgot-password"
                                        className="font-semibold text-purple-500 hover:text-purple-700"
                                    >
                                        Request again
                                    </a>
                                    !
                                </p>
                            )}
                            {!error && (
                                <p className="mt-8 text-center lg:mb-8">
                                    Remembered your password?{' '}
                                    <a
                                        href="/log-in"
                                        className="font-semibold text-purple-500 hover:text-purple-700"
                                    >
                                        Log in
                                    </a>
                                    !
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewPassword;
