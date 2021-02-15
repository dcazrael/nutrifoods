import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as NutritionImage } from '../../static/images/nutrition_data.svg';
import Link from '../layout/Link';
import SearchBar from '../layout/SearchBar';

const Home = () => {
    const [query, setQuery] = useState('');

    let history = useHistory();

    function handleChange(newValue) {
        setQuery(() => newValue);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        history.push('/nutrient?query=' + query);
    };

    return (
        <section className="text-gray-700 body-font">
            <div className="container flex flex-col items-center px-5 py-6 mx-auto lg:px-20 md:py-12 md:px-8 md:flex-row">
                <div className="flex flex-col items-center w-full pt-0 mb-8 text-left lg:flex-grow md:w-3/5 lg:pr-4 md:pr-4 md:items-start md:text-left md:mb-0 lg:text-center">
                    <h1 className="mt-10 mb-2 text-2xl font-semibold tracking-tighter text-center purple-blue-gradient text-gradient sm:text-3xl font-montserrat lg:text-left lg:text-3xl">
                        What nutrients are in the foods you eat?
                    </h1>
                    <p className="mt-4 mb-8 text-base leading-relaxed text-center text-gray-700 md:text-left lg:text-1xl">
                        Quickly discover nutritional information for the meals
                        you consume. Simply type in the meal you want to analyze
                        and get all the information you need.
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center w-full text-center border-green-400"
                    >
                        <SearchBar value={query} onChange={handleChange} />
                        <Link
                            borderColor="border-green-300"
                            gradientColor="green-teal-gradient"
                            link={`/nutrient?query=${query}`}
                        >
                            Search
                        </Link>
                    </form>
                </div>
                <div className="w-full lg:max-w-lg lg:w-1/2 md:w-2/5">
                    <NutritionImage />
                </div>
            </div>
        </section>
    );
};

export default Home;
