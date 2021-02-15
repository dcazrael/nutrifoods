const Alert = ({ type, children, margin = null }) => {
    const typeProperties = {
        danger: {
            border: 'border-red-500',
            bg: 'bg-red-500',
            icon:
                'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z',
        },
        success: {
            border: 'border-green-500',
            bg: 'bg-green-500',
            icon:
                'M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z',
        },
    };

    return (
        <div
            className={`flex items-center justify-between shadow-md border-2 ${
                typeProperties[type].border
            } ${margin ? margin : 'mb-2'} `}
        >
            <div
                className={`flex self-stretch ${typeProperties[type].bg} mr-2`}
            >
                <svg
                    className="self-center w-4 h-4 mx-2 text-white fill-current md:w-6 lg:w-4 md:h-6 lg:h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                >
                    <path d={typeProperties[type].icon} />
                </svg>
            </div>
            <p className="self-center flex-grow px-4 py-1 text-sm text-gray-800 xl:text-xs">
                {children}
            </p>
            <div
                className={`w-1 self-stretch ${typeProperties[type].bg}`}
            ></div>
        </div>
    );
};

export default Alert;
