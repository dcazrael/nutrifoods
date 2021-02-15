import Link from '../layout/Link';

const NotFoundPage = () => {
    return (
        <div className="flex items-center mt-10 text-gray-600">
            <div className="container flex flex-wrap items-center p-4 mx-auto">
                <div className="w-full p-4 text-center md:w-5/12">
                    <img
                        src="https://themichailov.com/img/not-found.svg"
                        alt="Not Found"
                    />
                </div>
                <div className="w-full p-4 text-center md:w-7/12 md:text-left">
                    <div className="text-6xl font-medium">404</div>
                    <div className="mb-4 text-xl font-medium md:text-3xl">
                        Oops. This page has gone missing.
                    </div>
                    <div className="mb-8 text-lg">
                        You may have mistyped the address or the page may have
                        moved.
                    </div>
                    <Link
                        borderColor="border-purple-500"
                        gradientColor="purple-blue-gradient"
                        link="/"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
