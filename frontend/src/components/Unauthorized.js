import Link from './layout/Link';

import { ReactComponent as AccessDeniedImage } from '../static/images/access_denied.svg';

const Unauthorized = ({ error }) => {
    return (
        <div className="container flex items-center justify-center mt-10 text-gray-600">
            <div className="container flex flex-wrap items-center p-4 mx-auto">
                <div className="w-full p-4 md:w-1/2">
                    <AccessDeniedImage className="mx-auto h-1/2 max-h-80 lg:max-h-full" />
                </div>
                <div className="w-full p-4 text-center md:w-1/2">
                    <div className="text-6xl font-medium">403</div>
                    <div className="mb-4 text-xl font-medium md:text-3xl">
                        {error}
                    </div>
                    <div className="mb-8 text-lg">
                        You must be logged in to view this page.
                    </div>
                    <Link
                        borderColor="border-green-300"
                        gradientColor="green-teal-gradient"
                        link="/log-in"
                        className="mr-4"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
