import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../static/css/App.css';
import Button from '../layout/Button';
import CalorieSource from '../CalorieSource';
import Excercise from '../Exercise';
import getLabelData from '../getLabelData';
import LoadingCube from '../layout/LoadingCube';
import MealInformation from '../MealInformation';
import NutrientLabel from '../NutrientLabel';
import SearchBar from '../layout/SearchBar';
import useWindowSize from '../hooks/useWindowSize';

const Nutrient = ({ search }) => {
    const [query, setQuery] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState('');

    const [data, setData] = useState('');
    const [label, setLabel] = useState('');

    const [macros, setMacros] = useState(null);

    const [width] = useWindowSize();
    let isSmallDevice = width < 1024 ? true : false;

    let history = useHistory();

    function handleChange(newValue) {
        setQuery(() => newValue);
    }

    const labelData = useCallback(() => {
        getLabelData(
            search !== null ? search : query,
            setIsPending,
            setError,
            setLabel,
            setData,
            setMacros
        );
    }, [query, search]);

    const handleSubmit = (e) => {
        setIsPending(true);
        e.preventDefault();

        labelData();
    };

    useEffect(() => {
        if (search !== null) {
            setIsPending(true);
            labelData();
            history.push('/nutrient');
        }
    }, [search, history, labelData]);

    return (
        <>
            <div className="flex flex-col items-center px-5 pt-16 pb-2 mb-4 text-left lg:flex-grow lg:px-20 md:pb-6 md:px-8 md:items-start md:mb-0">
                <h1 className="mb-2 text-2xl font-semibold tracking-tighter text-center purple-blue-gradient text-gradient sm:text-3xl font-montserrat lg:text-left lg:text-3xl">
                    What nutrients are in the foods you eat?
                </h1>

                <div className="w-full mx-auto mt-10">
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center text-center"
                    >
                        <SearchBar value={query} onChange={handleChange} />
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
            </div>
            {isPending && <LoadingCube />}
            <div className="flex flex-col items-center px-5 mb-4 text-left lg:flex-grow lg:px-20 md:px-8 md:items-start lg:flex-row">
                {label && data && (
                    <>
                        <div className="flex flex-col flex-wrap w-full md:flex-row">
                            {!isSmallDevice && (
                                <div className="w-2/3 xl:w-3/4">
                                    <MealInformation
                                        data={data}
                                        className="flex-shrink w-full px-4 py-6 mt-5 mb-3 bg-gray-100 shadow rounded-t-md"
                                    />
                                    <div className="w-full">
                                        {macros && (
                                            <>
                                                <CalorieSource
                                                    carbs={macros.carbs}
                                                    fat={macros.fat}
                                                    protein={macros.protein}
                                                    calories={macros.calories}
                                                />
                                                <Excercise
                                                    calories={macros.calories}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                            {isSmallDevice && (
                                <>
                                    <MealInformation
                                        data={data}
                                        className="flex-shrink w-full px-4 py-6 mt-5 mb-3 bg-gray-100 shadow rounded-t-md"
                                    />
                                    <div className="order-3 w-full md:w-1/2">
                                        {macros && (
                                            <>
                                                <CalorieSource
                                                    carbs={macros.carbs}
                                                    fat={macros.fat}
                                                    protein={macros.protein}
                                                    calories={macros.calories}
                                                />
                                                <Excercise
                                                    calories={macros.calories}
                                                />
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                            <div className="order-2 lg:w-1/3 xl:w-1/4 md:w-1/2 lg:order-first">
                                <NutrientLabel labelData={label} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Nutrient;
