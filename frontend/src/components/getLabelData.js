import axios from 'axios';
import { baseURL } from './axios/baseURL';

const getLabelData = (
    query,
    setIsPending,
    setError,
    setLabel,
    setData = null,
    setMacros = null
) => {
    axios
        .get(baseURL + 'nutrients?query=' + query)
        .then((res) => {
            let label = res.data.label;
            let macroData = {
                fat: label.fat.total_fat.value,
                carbs: label.carbohydrate.total_carbohydrate.value,
                protein: label.protein.value,
                calories: label.calories.kcal.value,
            };

            setIsPending(false);
            setError(null);
            setLabel(label);
            if (setData) {
                setData(res.data);
                setMacros(macroData);
            }
        })
        .catch((error) => {
            console.log(error);
            console.log('hello');
            if (error.response) {
                // The request was made and the server responded with a status code 404
                if (error.response.status === 404) {
                    setIsPending(false);
                    setError("Item couldn't be found.");
                    return;
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            setIsPending(false);
            setError(error.message);
        });

    return [setIsPending, setError, setData, setLabel, setMacros];
};

export default getLabelData;
