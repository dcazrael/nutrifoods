const SearchResult = ({ items, itemType }) => {
    const isBranded = itemType === 'branded' ? true : false;
    return (
        <div className="">
            <div className="px-2 py-2 text-xl text-center capitalize border-t border-b border-gray-400">
                {itemType}
            </div>
            {items.map((item, index) => {
                return (
                    <a href={`/food/${item.food_name.replaceAll(' ', '-')}`}>
                        <div
                            className={`px-2 py-3 border-b itemlist hover:bg-purple-300 cursor-pointer ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                            }`}
                            key={index + '_' + itemType}
                        >
                            <div className="flex flex-col">
                                <div className="flex flex-row h-12">
                                    <div className="flex items-center w-2/12">
                                        <img
                                            src={item.photo.thumb}
                                            alt={item.food_name}
                                            className="object-scale-down w-12 mx-auto rounded-lg max-h-12"
                                        />
                                    </div>
                                    <div className="flex flex-col w-9/12 px-2 text-sm font-semibold text-gray-800 capitalize">
                                        {item.food_name}
                                        {isBranded && (
                                            <div className="text-xs italic text-red-400">
                                                {item.brand_name}
                                            </div>
                                        )}
                                    </div>
                                    {isBranded && (
                                        <div className="flex items-center w-1/12 text-sm text-blue-500">
                                            {item.nf_calories} kcal
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
};

export default SearchResult;
