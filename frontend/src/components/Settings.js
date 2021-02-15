import { useEffect, useState } from 'react';
import Alert from './layout/Alert';
import axiosInstance from './axios/axiosInstance';
import Button from './layout/Button';
import InputBox from './layout/InputBox';
import Unauthorized from './Unauthorized';
import { ReactComponent as SideImage } from '../static/images/checklist.svg';
import TwoCol from './layout/TwoCol';

const PersonalInformation = () => {
    const loggedIn = localStorage.getItem('access_token');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loadProfileError, setloadProfileError] = useState(null);
    const [error, setError] = useState(null);
    const [userData, setUserDataChanged] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);

    function loadProfile() {
        axiosInstance
            .get('profile')
            .then((profile) => {
                setUsername(() => profile.data.username);
                setEmail(() => profile.data.email);
            })
            .catch((err) => {
                setloadProfileError(err.response.statusText);
            });
    }

    useEffect(() => {
        loadProfile();
    }, [loggedIn]);

    function handleUserUpdate(e) {
        e.preventDefault();
        setError(() => null);
        setUserDataChanged(false);
        setPasswordChanged(false);
        if (password !== confirmPassword) {
            setError({ password: "The passwords don't match" });
            return;
        }
        axiosInstance
            .patch('user/update', {
                username: username,
                email: email,
                password: password,
            })
            .then((response) => {
                setUserDataChanged(true);
                setUsername(response.data.username);
                setEmail(response.data.email);
                if (response.data.password) {
                    setPasswordChanged(true);
                }
            })
            .catch((err) => {
                setError(() => err.response.data.username);
            });
    }

    const title = 'Personal information';

    return (
        <>
            {loadProfileError && <Unauthorized error={loadProfileError} />}
            {!loadProfileError && (
                <TwoCol title={title} image={<SideImage />}>
                    <form
                        className="mt-0"
                        onSubmit={handleUserUpdate}
                        method="POST"
                    >
                        <h3 className="mb-2 text-3xl font-semibold tracking-tighter text-center text-purple-500 md:hidden md:text-left font-montserrat">
                            {title}
                        </h3>
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
                                    <Alert type="danger" key={`${field}`}>
                                        {error[field]}
                                    </Alert>
                                )
                            )}
                        {userData && (
                            <Alert type="success">
                                Your userdata has been updated
                            </Alert>
                        )}
                        {passwordChanged && (
                            <Alert type="success">
                                Your password has been updated
                            </Alert>
                        )}
                        <div className="relative inline-block w-full p-0 mt-6 bg-white rounded shadow-lg md:mt-0">
                            <InputBox
                                type="text"
                                required
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e)}
                                autoComplete="on"
                            >
                                Your Username
                            </InputBox>
                        </div>
                        <div className="relative inline-block w-full p-0 mt-6 bg-white rounded shadow-lg">
                            <InputBox
                                type="email"
                                required
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e)}
                                autoComplete="on"
                            >
                                Your Email
                            </InputBox>
                        </div>

                        <div className="relative inline-block w-full p-0 mt-6 bg-white rounded shadow-lg">
                            <InputBox
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e)}
                                autoComplete="on"
                            >
                                Your Password
                            </InputBox>
                        </div>
                        <div className="relative inline-block w-full p-0 mt-6 bg-white rounded shadow-lg">
                            <InputBox
                                type="password"
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
                            Save Changes
                        </Button>
                    </form>
                </TwoCol>
            )}
        </>
    );
};

export default PersonalInformation;
