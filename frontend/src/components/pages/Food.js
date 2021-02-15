import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getLabelData from '../getLabelData';
import getRecipeData from '../getRecipeData';
import LoadingCube from '../layout/LoadingCube';
import NutrientLabel from '../NutrientLabel';
import RecipeComponent from '../RecipeComponent';

const Food = () => {
    const url = '/api/nutrients';
    const { name } = useParams();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState('');

    const [label, setLabel] = useState('');
    const [recipeData, setRecipeData] = useState([]);
    const query = name.replaceAll('-', ' ');

    useEffect(() => {
        getLabelData(url, query, setIsPending, setError, setLabel);
    }, [query]);

    useEffect(() => {
        getRecipeData(query, setRecipeData, setError);
    }, [query]);
    return (
        <>
            {error && (
                <div className="font-medium text-center text-red-500">
                    {error}
                </div>
            )}
            {isPending && <LoadingCube />}
            {label && (
                <div className="flex flex-wrap mx-4 mt-10 lg:flex-nowrap">
                    <div className="max-w-full lg:w-96">
                        <NutrientLabel labelData={label} single />
                    </div>
                    <div className="flex flex-col w-full">
                        {recipeData && (
                            <RecipeComponent
                                recipes={recipeData}
                                name={name.replaceAll('-', ' ')}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Food;
