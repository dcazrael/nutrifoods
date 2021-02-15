const TwoCol = ({ title, image, children, largeRight }) => {
    return (
        <section className="flex flex-col items-center md:flex-row">
            <div className="container flex justify-center mx-auto">
                <div className="flex w-full rounded-lg lg:w-11/12">
                    <div
                        className={`relative hidden h-auto px-8 py-8 bg-cover border-r rounded-lg rounded-l-lg ${
                            largeRight
                                ? 'lg:w-1/3 lg:block'
                                : 'md:w-1/2 md:block'
                        } lg:px-12`}
                    >
                        <h1 className="mt-10 mb-2 text-2xl font-semibold tracking-tighter purple-blue-gradient text-gradient sm:text-3xl font-montserrat">
                            {title}
                        </h1>
                        <div className="w-full mt-8 mb-8 text-base leading-relaxed text-gray-900">
                            {image}
                        </div>
                    </div>
                    <div
                        className={`w-full px-8 py-4 lg:py-16 rounded-lg md:flex-row lg:px-12 ${
                            largeRight ? 'lg:w-2/3' : 'md:w-1/2'
                        } lg:rounded-l-none md:ml-4`}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TwoCol;
