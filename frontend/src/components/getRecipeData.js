import axios from 'axios';
import { baseURL } from './axios/baseURL';

const getRecipeData = (
    query,
    setRecipeData,
    setError,
    setIsPending = null,
    setMockdata = null,
    number = 10
) => {
    axios
        .get(
            baseURL +
                'recipes?query=' +
                encodeURIComponent(query) +
                '&number=' +
                number
        )
        .then((res) => {
            let recipes = res.data.data;
            setRecipeData(recipes);
            if (setMockdata !== null) {
                setMockdata(res.data.mockdata);
            }
            if (setIsPending !== null) {
                setIsPending(false);
            }
        })
        .catch((error) => {
            console.log(error);
            setError(error.response);
        });

    return [setRecipeData, setError, setIsPending, setMockdata];
};

export default getRecipeData;
