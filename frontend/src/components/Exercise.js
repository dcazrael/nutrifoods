const Excercise = ({ calories }) => {
    return (
        <div className="w-full px-4 py-6 mt-5 mb-3 bg-gray-100 shadow rounded-t-md">
            <div>
                <div className="title">
                    <p className="mb-4 text-3xl font-bold text-gray-800 lg:text-4xl font-montserrat">
                        <span className="capitalize">Excercise</span>
                    </p>
                </div>
                <div className="">
                    To burn {calories} kcal it will take all your life.
                </div>
            </div>
        </div>
    );
};

export default Excercise;
