import { useContext } from 'react';
import LoginContext from '../context/LoginContext';
import Alert from './Alert';
import Button from './Button';
import InputBox from './InputBox';

const LoginComponent = (props) => {
    const {
        submit,
        error,
        username,
        password,
        setUsername,
        setPassword,
    } = props;

    const { loggedIn, setLoggedIn } = useContext(LoginContext);

    return (
        <div
            className={`w-full px-8 py-16 border-gray-100 rounded-lg ${
                props.modal ? '' : 'lg:w-1/2'
            } lg:px-12 lg:rounded-l-none`}
        >
            <div className="relative z-10 text-left ">
                <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-center md:hidden purple-blue-gradient text-gradient sm:text-3xl font-montserrat">
                    Log in to your account
                </h2>
                <form className="mt-6 md:mt-0" onSubmit={submit} method="POST">
                    {error && <Alert type="danger">{error.detail}</Alert>}
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
                    <div className="relative inline-block w-full p-0 mt-1 mr-1 bg-white rounded shadow-lg sm:mr-3">
                        <InputBox
                            type="password"
                            required
                            placeholder=" "
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e)}
                        >
                            Your Password
                        </InputBox>
                    </div>
                    <div className="mt-2 text-right">
                        <a
                            href="/forgot-password"
                            className="text-sm font-semibold leading-relaxed text-gray-700 hover:text-purple-700 focus:text-purple-700"
                        >
                            Forgot Password?
                        </a>
                    </div>
                    <Button
                        borderColor="border-green-300"
                        gradientColor="green-teal-gradient"
                        className="w-full mt-6"
                        onClick={() => setLoggedIn(loggedIn)}
                    >
                        Log In
                    </Button>
                </form>
                <hr className="w-full my-6 border-gray-300" />
                <p className="mt-8 text-center lg:mb-8">
                    Need an account?{' '}
                    <a
                        href="/sign-up"
                        className="font-semibold text-purple-500 hover:text-purple-700"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginComponent;
