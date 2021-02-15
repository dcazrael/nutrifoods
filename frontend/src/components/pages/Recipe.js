import { useState, useEffect, useCallback } from 'react';
import SearchBar from '../layout/SearchBar';
import Button from '../layout/Button';
import getRecipeData from '../getRecipeData';
import RecipeComponent from '../RecipeComponent';
import LoadingCube from '../layout/LoadingCube';

const Recipe = () => {
    const [query, setQuery] = useState('');
    const [name, setName] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [recipeData, setRecipeData] = useState(null);
    const [mockdata, setMockdata] = useState(false);

    const retrieveRecipes = useCallback(() => {
        getRecipeData(
            query,
            setRecipeData,
            setError,
            setIsPending,
            setMockdata,
            30
        );
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsPending(true);
        setRecipeData(null);

        retrieveRecipes();

        setName(query);
    };

    useEffect(() => {
        setIsPending(true);
        getRecipeData(
            '',
            setRecipeData,
            setError,
            setIsPending,
            setMockdata,
            10
        );
    }, []);

    const handleChange = (newValue) => {
        setQuery(() => newValue);
    };

    return (
        <div className="flex flex-col items-center px-5 pt-16 pb-2 mb-4 text-left lg:flex-grow lg:px-20 md:pb-6 md:px-8 md:items-start md:mb-0">
            <h1 className="mb-2 text-2xl font-semibold tracking-tighter text-center purple-blue-gradient text-gradient sm:text-3xl font-montserrat lg:text-left lg:text-3xl">
                What kind of food do you want to make?
            </h1>

            <div className="w-full mx-auto mt-10">
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center text-center"
                >
                    <SearchBar value={query} onChange={handleChange}>
                        Search query: (e.g: Greek Salad)
                    </SearchBar>
                    <Button
                        borderColor="border-white"
                        gradientColor="green-teal-gradient"
                        disabled={isPending}
                    >
                        Search
                    </Button>
                </form>
                {error && (
                    <div className="font-medium text-center text-red-500">
                        {error}
                    </div>
                )}
            </div>
            {isPending && <LoadingCube />}
            {recipeData && (
                <RecipeComponent
                    recipes={recipeData}
                    name={name}
                    mockdata={mockdata}
                    className="w-full mx-auto mt-10"
                />
            )}
        </div>
    );
};

export default Recipe;
