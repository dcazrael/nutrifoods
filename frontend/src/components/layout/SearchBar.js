const SearchBar = (props) => {
    function handleChange(e) {
        props.onChange(e.target.value);
    }

    return (
        <div className='relative flex-grow inline-block p-0 mt-1 mr-1 bg-white rounded shadow-lg sm:mr-3'>
            <input
                className='relative z-20 block w-full px-2 py-1 transition duration-300 bg-transparent border border-gray-400 rounded search md:px-3 focus:outline-none focus:border-purple-500'
                type='text'
                required
                name='query'
                value={props.value}
                onChange={handleChange}
                placeholder=' '
            />
            <label
                htmlFor='query'
                className='absolute z-10 inline-block text-xs left-1.5 text-gray-500 duration-300 sm:text-sm top-1/2 transform -translate-y-1/2 tracking-tighter origin-top-left md:left-3 md:text-base focus:outline-none'
            >
                {props.children || 'Search query (e.g.: Pizza and Greek Salad)'}
                :
            </label>
        </div>
    );
};

export default SearchBar;
