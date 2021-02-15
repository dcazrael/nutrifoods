import { useEffect } from 'react';

const useOutsideClick = (ref) => {
    return useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                document
                    .querySelector('.searchResultBox')
                    .classList.add('hidden');
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);
};

export default useOutsideClick;
