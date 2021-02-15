import { useEffect, useState } from 'react';
import { ReactComponent as SignUpImage } from '../../static/images/diet_stats.svg';
import Alert from '../layout/Alert';
import axiosSignUp from '../axios/axiosSignUp';
import Button from '../layout/Button';
import InputBox from '../layout/InputBox';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({});
    const [created, setCreated] = useState(false);

    function handleSubmit(e) {
        setCreated(false);
        setError({});
        e.preventDefault();

        if (password !== confirmPassword) {
            setError({ password: "The passwords don't match" });
            return;
        }

        axiosSignUp(username, email, password, setError);
    }

    useEffect(() => {
        if (!error) {
            setCreated(true);
        }
    }, [error]);

    return (
        <section className="flex flex-col items-center md:flex-row">
            <div className="container flex justify-center mx-auto">
                <div className="flex w-full rounded-lg xl:w-3/4 lg:w-11/12 lg:shadow-xl ">
                    <div className="relative hidden w-full h-auto px-8 py-16 bg-cover border-r rounded-lg rounded-l-lg bg-purple-1300 md:block lg:w-1/2 lg:px-12">
                        <h2 className="mt-2 mb-2 text-2xl font-semibold tracking-tighter purple-blue-gradient text-gradient sm:text-3xl font-montserrat">
                            Create an account
                        </h2>
                        <div className="w-full mt-4 leading-relaxed text-gray-900 text-1xl">
                            <p className="mb-4 text-lg">
                                Having your own account comes with benefits
                            </p>
                            <SignUpImage />
                        </div>
                    </div>
                    <div className="w-full px-8 py-16 border-gray-100 rounded-lg bg-purple-1300 lg:w-1/2 lg:px-12 lg:rounded-l-none">
                        <div className="relative z-10 text-left ">
                            <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-center md:hidden purple-blue-gradient text-gradient sm:text-3xl font-montserrat">
                                Create an account
                            </h2>
                            <form
                                className="mt-6 md:mt-0"
                                onSubmit={handleSubmit}
                                method="POST"
                            >
                                {error &&
                                    Object.keys(error).map((field) =>
                                        Array.isArray(error[field]) ? (
                                            error[field].map((line) => {
                                                return (
                                                    <Alert
                                                        type="danger"
                                                        key={`${line}`}
                                                    >
                                                        {line}
                                                    </Alert>
                                                );
                                            })
                                        ) : (
                                            <Alert
                                                type="danger"
                                                key={`${field}`}
                                            >
                                                {error[field]}
                                            </Alert>
                                        )
                                    )}
                                {created && (
                                    <Alert type="success">
                                        Your account was created
                                    </Alert>
                                )}
                                <div className="relative inline-block w-full p-0 mt-1 mr-1 bg-white rounded shadow-lg sm:mr-3">
                                    <InputBox
                                        type="text"
                                        required
                                        placeholder=" "
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e)}
                                        autoComplete="on"
                                    >
                                        Your Username
                                    </InputBox>
                                </div>
                                <div className="relative inline-block w-full p-0 mt-6 mr-1 bg-white rounded shadow-lg sm:mr-3">
                                    <InputBox
                                        type="email"
                                        required
                                        placeholder=" "
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e)}
                                        autoComplete="on"
                                    >
                                        Your Email
                                    </InputBox>
                                </div>

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
                                    Sign up
                                </Button>
                            </form>
                            <hr className="w-full my-6 border-gray-300" />
                            <p className="mt-8 text-center lg:mb-8">
                                Already have an account?{' '}
                                <a
                                    href="/sign-in"
                                    className="font-semibold text-purple-500 hover:text-purple-700"
                                >
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignUp;
