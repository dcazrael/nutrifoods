const LoadingCube = () => {
    return (
        <div className="absolute z-50 w-24 h-24 transform -translate-x-1/2 -translate-y-1/2 bg-transparent top-1/2 left-1/2">
            <div
                id="loading-cube"
                className="absolute inset-x-0 w-24 h-24 mx-auto rounded-md sk-cube-grid bg-gradient-to-tl from-blue-400 to-purple-500"
            >
                <div className="flex w-24 h-8">
                    <div className="w-1/3 bg-white sk-cube sk-cube1 rounded-tl-md"></div>
                    <div className="w-1/3 bg-white sk-cube sk-cube2"></div>
                    <div className="w-1/3 bg-white sk-cube sk-cube3 rounded-tr-md"></div>
                </div>
                <div className="flex w-24 h-8">
                    <div className="w-1/3 bg-white sk-cube sk-cube4"></div>
                    <div className="w-1/3 bg-white sk-cube sk-cube5"></div>
                    <div className="w-1/3 bg-white sk-cube sk-cube6"></div>
                </div>
                <div className="flex w-24 h-8">
                    <div className="w-1/3 bg-white sk-cube sk-cube7 rounded-bl-md"></div>
                    <div className="w-1/3 bg-white sk-cube sk-cube8"></div>
                    <div className="w-1/3 bg-white sk-cube sk-cube9 rounded-br-md"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingCube;
