import roundDecimal, { shorten } from './Helper';

const RecipeComponent = ({ recipes, name, mockdata }) => {
    return (
        <div className="w-full px-8 py-6 mt-5 mb-2 bg-gray-100 shadow rounded-t-md">
            <div className="flex flex-wrap justify-between mb-8">
                {!name && (
                    <p className="mb-2 text-4xl font-semibold text-gray-800 font-montserrat">
                        Inspiration for your next meal
                    </p>
                )}
                {name && (
                    <p className="mb-2 text-4xl font-semibold text-gray-800 font-montserrat">
                        Recipes for <span className="capitalize">{name}</span>
                    </p>
                )}
                <p className="font-light text-gray-400">
                    provided curtesy of{' '}
                    <a
                        className="font-medium"
                        href="https://spoonacular.com/food-api"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Spoontacular
                    </a>
                </p>
            </div>
            <div className="mb-2">
                <p className="text-sm text-center text-gray-600 font-montserrat">
                    Found {recipes.length} Recipes{' '}
                    {mockdata && '| This is mock data. API limit reached'}
                </p>
                {recipes.length === 0 ? (
                    <p className="text-center text-gray-600 font-montserrat">
                        Please try another search
                    </p>
                ) : (
                    <></>
                )}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-2">
                {recipes.map((recipe) => {
                    return (
                        <div
                            className="flex flex-col w-full h-full overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800"
                            key={recipe.id}
                        >
                            <div className="relative">
                                <img
                                    alt={name}
                                    src={recipe.image}
                                    className="object-cover w-full max-h-40"
                                />
                                <div className="absolute bottom-0 left-0 right-0 flex justify-around py-2 bg-black bg-opacity-50">
                                    <div className="px-4 py-1 text-xs text-center text-gray-600 transform scale-75 shadow-md lg:px-3 rounded-2xl sm:scale-100 bg-gradient-to-tr from-yellow-200 to-yellow-400">
                                        Carbs{' '}
                                        {recipe.caloricBreakdown.percentCarbs}%
                                    </div>

                                    <div className="px-4 py-1 text-xs text-center text-gray-600 transform scale-75 shadow-md lg:px-3 rounded-2xl sm:scale-100 bg-gradient-to-tr from-teal-200 to-teal-400">
                                        Fat {recipe.caloricBreakdown.percentFat}
                                        %
                                    </div>

                                    <div className="px-4 py-1 text-xs text-center text-gray-600 transform scale-75 shadow-md lg:px-3 rounded-2xl sm:scale-100 bg-gradient-to-tr from-red-200 to-red-400">
                                        Protein{' '}
                                        {recipe.caloricBreakdown.percentProtein}
                                        %
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow w-full p-4 ">
                                <div className="flex text-xl text-gray-800 dark:text-white">
                                    {recipe.title}{' '}
                                    {mockdata && (
                                        <span className="text-sm place-self-end">
                                            This is mock data. API limit reached
                                        </span>
                                    )}
                                </div>
                                <div
                                    className="block mt-4 text-sm font-normal text-gray-500 dark:text-gray-300"
                                    dangerouslySetInnerHTML={{
                                        __html: shorten(
                                            recipe.summary,
                                            550,
                                            ' ',
                                            recipe.sourceUrl
                                        ),
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-between px-4 py-1 mt-4 mb-4 ">
                                <p>
                                    Price: $
                                    {roundDecimal(
                                        recipe.pricePerServing * recipe.servings
                                    ).toFixed(2)}
                                </p>
                                <div className="flex flex-col justify-between ml-4 text-sm">
                                    <p className="text-gray-800 dark:text-white">
                                        <a
                                            className="font-semibold"
                                            href={recipe.sourceUrl}
                                        >
                                            @{recipe.sourceName}
                                        </a>
                                    </p>
                                    <div className="flex text-gray-400 dark:text-gray-300">
                                        <span className="mr-1">
                                            Servings: {recipe.servings}
                                        </span>{' '}
                                        |
                                        <span className="ml-1">
                                            <span className="hidden md:inline">
                                                Ready in:
                                            </span>
                                            <span className="md:hidden">
                                                Prep:
                                            </span>{' '}
                                            {recipe.readyInMinutes}min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecipeComponent;
