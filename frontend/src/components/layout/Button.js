const Button = ({
    disabled,
    children,
    borderColor,
    gradientColor,
    className,
    onClick = null,
}) => {
    return (
        <div className={`z-10 relative ${className}`}>
            <button
                disabled={disabled}
                className={`group relative w-full inline-flex items-center pl-3 pr-2 pt-1 pb-0 font-bold text-center text-white border-2 ${borderColor} disabled:border-gray-500 border-solid rounded shadow outline-none cursor-pointer hover:top-0.5 hover:left-0.5 bg-none focus:outline-none`}
                onClick={onClick}
            >
                <span className="relative -top-0.5 z-20 w-full block">
                    {children}
                </span>
                <span
                    aria-hidden
                    className={`absolute w-full pr-1 box-content h-8 group-hover:to-purple-700 ${
                        !disabled ? gradientColor : 'bg-gray-500'
                    } rounded shadow -z-1 top-0.5 left-0.5`}
                >
                    {' '}
                </span>
            </button>
        </div>
    );
};

export default Button;
