import axios from 'axios';
import { baseURL } from '../axios/baseURL';
import { useRef, useState } from 'react';
import SearchResult from './SearchResults';
import useDebounce from '../hooks/useDebounce';
import useOutsideClick from '../hooks/useOutsideClick';

const SearchForm = () => {
    const [value, setValue] = useState('');
    const [branded, setBranded] = useState('');
    const [common, setCommon] = useState('');
    const searchResultBox = useRef(null);

    useOutsideClick(searchResultBox);

    const handleChange = (event) => {
        const { value: nextValue } = event.target;
        setValue(nextValue);
        debouncedSave(nextValue);
    };

    const debouncedSave = useDebounce(
        (searchQuery) =>
            axios.get(baseURL + 'instant?query=' + searchQuery).then((res) => {
                setBranded(res.data.data.branded);
                setCommon(res.data.data.common);
                document
                    .querySelector('.searchResultBox')
                    .classList.remove('hidden');
            }),
        400
    );

    return (
        <div className="relative flex w-full mt-1 md:mr-4 md:w-96">
            <input
                type="search"
                name="search"
                id="search"
                value={value}
                onChange={handleChange}
                onFocus={() => {
                    if (!common) {
                        return;
                    }
                    document
                        .querySelector('.searchResultBox')
                        .classList.remove('hidden');
                }}
                placeholder="Search food items"
                className="block w-full px-2 py-1 transition duration-300 bg-white border border-gray-400 rounded-tl rounded-bl group focus:outline-none focus:border-purple-500 focus:border-opacity-30"
            />
            <span className="absolute top-0 right-0 block px-2 py-1 bg-white border border-gray-400">
                <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </span>
            <div
                ref={searchResultBox}
                className="absolute z-50 hidden w-full overflow-y-auto bg-white rounded-b-md searchResultBox md:w-96 h-80 top-9"
            >
                {common && <SearchResult items={common} itemType="common" />}
                {branded && <SearchResult items={branded} itemType="branded" />}
            </div>
        </div>
    );
};

export default SearchForm;
