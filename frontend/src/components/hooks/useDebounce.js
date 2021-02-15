import debounce from 'lodash.debounce';
import { useMemo } from 'react';

const useDebounce = (callback, delay) => {
    const debouncedFn = useMemo(
        () => debounce((...args) => callback(...args), delay),
        [delay, callback]
    );
    return debouncedFn;
};

export default useDebounce;
