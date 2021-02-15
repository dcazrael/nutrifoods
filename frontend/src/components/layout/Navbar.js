import { ReactComponent as Logo } from '../../static/images/diet.svg';
import { default as ButtonLink } from './Link';
import { Link } from 'react-router-dom';
import SearchForm from './SearchForm';
import LoginContext from '../context/LoginContext';
import { useContext, useEffect } from 'react';

const Navbar = () => {
    const { loggedIn, setLoggedIn } = useContext(LoginContext);
    const access_token = localStorage.getItem('access_token');

    useEffect(() => {
        if (!access_token) {
            return;
        }
        setLoggedIn(access_token === null ? false : true);
    }, [access_token, setLoggedIn]);

    return (
        <header className="bg-gray-100">
            <div className="container flex flex-col flex-wrap items-center justify-center p-5 mx-auto md:flex-row">
                <Link
                    to="/"
                    className="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0"
                >
                    <Logo className="w-10 h-10 text-gradient bg-gradient-to-b from-teal-400 to-green-500" />
                    <span className="ml-3 text-xl text-teal-400">nutri</span>
                    <span className="text-xl text-green-500">food</span>
                </Link>
                <nav className="flex flex-wrap items-center justify-center text-base lg:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400">
                    <Link className="mr-5 hover:text-gray-900" to="/nutrient">
                        Nutrients
                    </Link>
                    <Link className="mr-5 hover:text-gray-900" to="/recipe">
                        Recipes
                    </Link>
                    <Link className="mr-5 hover:text-gray-900" to="/contact">
                        Contact
                    </Link>
                </nav>
                <div className="flex flex-wrap mt-4 lg:mt-0 md:flex-nowrap">
                    <SearchForm />
                    <div className="flex w-full mt-6 md:w-auto justify-evenly md:justify-start md:mt-0">
                        {loggedIn && (
                            <>
                                <ButtonLink
                                    borderColor="border-green-300"
                                    gradientColor="green-teal-gradient"
                                    link="/profile"
                                    className="mr-4"
                                >
                                    Profile
                                </ButtonLink>
                                <ButtonLink
                                    borderColor="border-purple-500"
                                    gradientColor="purple-blue-gradient"
                                    link="/log-out"
                                    className="mr-4"
                                >
                                    Log out
                                </ButtonLink>
                            </>
                        )}
                        {!loggedIn && (
                            <>
                                <ButtonLink
                                    borderColor="border-green-300"
                                    gradientColor="green-teal-gradient"
                                    link="/log-in"
                                    className="mr-4"
                                >
                                    Log in
                                </ButtonLink>
                                <ButtonLink
                                    borderColor="border-purple-500"
                                    gradientColor="purple-blue-gradient"
                                    link="/sign-up"
                                    className=""
                                >
                                    Sign up
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="w-4 h-4 ml-1"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                                    </svg>
                                </ButtonLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
