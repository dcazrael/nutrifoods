import { ReactComponent as Logo } from '../../static/images/diet.svg';
const Footer = () => {
    return (
        <footer className="text-gray-600 bg-gray-100 body-font">
            <div className="container flex flex-col items-center px-5 py-4 mx-auto sm:flex-row">
                <a
                    className="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start"
                    href="/"
                >
                    <Logo className="w-10 h-10 text-gradient bg-gradient-to-b from-teal-400 to-green-500" />
                    <span className="ml-3 text-xl text-teal-400">nutri</span>
                    <span className="text-xl text-green-500">food</span>
                </a>
                <p className="mt-4 text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0">
                    © 2021 nutrifood —
                    <a
                        href={process.env.REACT_APP_LinkedIn_URL}
                        className="ml-1 text-gray-600"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        @Michael Sachdev
                    </a>
                </p>
                <span className="inline-flex justify-center mt-4 sm:ml-auto sm:mt-0 sm:justify-start">
                    {process.env.REACT_APP_Github_URL && (
                        <a
                            className="ml-3 text-gray-500"
                            href={process.env.REACT_APP_Github_URL}
                        >
                            <svg
                                fill="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                    )}
                    {process.env.REACT_APP_Twitter_URL && (
                        <a
                            className="ml-3 text-gray-500"
                            href={process.env.REACT_APP_Twitter_URL}
                        >
                            <svg
                                fill="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                        </a>
                    )}
                    {process.env.REACT_APP_Instagram_URL && (
                        <a
                            className="ml-3 text-gray-500"
                            href={process.env.REACT_APP_Instagram_URL}
                        >
                            <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <rect
                                    width="20"
                                    height="20"
                                    x="2"
                                    y="2"
                                    rx="5"
                                    ry="5"
                                ></rect>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                            </svg>
                        </a>
                    )}
                    {process.env.REACT_APP_LinkedIn_URL && (
                        <a
                            className="ml-3 text-gray-500"
                            href={process.env.REACT_APP_LinkedIn_URL}
                        >
                            <svg
                                fill="currentColor"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="0"
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="none"
                                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                                ></path>
                                <circle
                                    cx="4"
                                    cy="4"
                                    r="2"
                                    stroke="none"
                                ></circle>
                            </svg>
                        </a>
                    )}
                </span>
            </div>
        </footer>
    );
};

export default Footer;
