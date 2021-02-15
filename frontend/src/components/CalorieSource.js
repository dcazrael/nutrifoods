import RadialChart from './RadialChart';

const CalorieSource = (props) => {
    const { carbs, fat, protein, calories } = props;
    const carbPercentage = Math.round(((carbs * 4) / calories) * 100);
    const fatPercentage = Math.round(((fat * 9) / calories) * 100);
    const proteinPercentage = Math.round(((protein * 4) / calories) * 100);

    return (
        <div className="w-full px-4 py-6 mt-5 mb-3 bg-gray-100 shadow rounded-t-md">
            <h2 className="mb-2 text-3xl font-bold text-gray-800 lg:text-4xl font-montserrat">
                <span className="capitalize">calorie sources</span>
            </h2>
            <div className="flex flex-wrap transform scale-110 md:scale-100 lg:flex-nowrap justify-evenly">
                <RadialChart
                    title="Carbohydrate"
                    percentage={carbPercentage}
                    height="180"
                    variant="1"
                />
                <RadialChart
                    title="Fat"
                    percentage={fatPercentage}
                    height="180"
                    variant="2"
                />
                <RadialChart
                    title="Protein"
                    percentage={proteinPercentage}
                    height="180"
                    variant="3"
                />
            </div>
        </div>
    );
};

export default CalorieSource;
