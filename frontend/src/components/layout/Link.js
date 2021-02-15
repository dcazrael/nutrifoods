import { Link } from 'react-router-dom';

const styledLink = ({
    link,
    children,
    borderColor,
    gradientColor,
    className,
}) => {
    return (
        <div className={`z-10 relative inline ${className}`}>
            <Link
                to={link}
                className={`group relative w-auto inline-flex items-center pl-3 pr-2 pt-1 pb-0 font-bold text-center text-white border-2 ${borderColor} disabled:border-gray-500 border-solid rounded shadow outline-none cursor-pointer hover:top-0.5 hover:left-0.5 bg-none focus:outline-none`}
            >
                <span className="relative -top-0.5 z-20 w-full inline-flex items-center">
                    {children}
                </span>
                <span
                    aria-hidden
                    className={`absolute w-full pr-1 box-content h-8 group-hover:to-purple-700 ${gradientColor} rounded shadow -z-1 top-0.5 left-0.5`}
                >
                    {' '}
                </span>
            </Link>
        </div>
    );
};

export default styledLink;
