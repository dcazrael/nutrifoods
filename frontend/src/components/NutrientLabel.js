import { useEffect, useState } from 'react';
import { ReactComponent as Arrow } from '../static/images/arrow.svg';
import roundDecimal from './Helper';

const NutrientLabel = ({ labelData, single }) => {
    const label = labelData;
    const defaultServing = single ? 100 : 1;
    const [serving, setServing] = useState(defaultServing);
    const defaultFactor = single
        ? 1 / (defaultServing / label.serving_weight_grams)
        : 1;
    const [factor, setFactor] = useState(defaultFactor);

    useEffect(() => {
        if (single) {
            if (serving !== '' && parseInt(serving) >= 1) {
                setFactor(1 / (parseInt(serving) / label.serving_weight_grams));
                return;
            }
        }
        if (
            serving !== '' &&
            parseInt(serving) <= 10 &&
            parseInt(serving) >= 1
        ) {
            setFactor(parseInt(serving));
        }
    }, [serving, single, label.serving_weight_grams]);

    return (
        <div className="px-1 py-6 my-5 bg-gray-100 shadow-lg md:mr-4 rounded-t-md">
            <div className="px-3 pt-1 pb-5 mx-auto">
                <section className="capitalize top">
                    <div className="text-3xl font-bold xl:text-3xl font-montserrat">
                        Nutrition Facts
                    </div>
                </section>
                <hr className="my-2 border-t-4 border-b-4 border-gray-800" />
                <div className="flex items-center justify-between my-1">
                    <label htmlFor="servings" className="mr-2 capitalize">
                        {!single && 'servings'}
                        {single && 'serving size'}
                    </label>
                    {!single && (
                        <>
                            <Arrow
                                className="w-4 h-4 text-purple-500 transform rotate-180 cursor-pointer fill-current hover:text-purple-700"
                                onClick={() =>
                                    setServing(parseInt(serving - 1))
                                }
                            />
                            <Arrow
                                className="w-4 h-4 text-purple-500 transform cursor-pointer fill-current hover:text-purple-700"
                                onClick={() =>
                                    setServing(parseInt(serving + 1))
                                }
                            />
                            <input
                                className="p-0 mx-0.5 text-center text-gray-800 border border-gray-400 appearance-none no-spinner focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-30"
                                type="number"
                                name="servings"
                                id="servings"
                                min="1"
                                max="10"
                                value={serving}
                                onChange={(e) =>
                                    setServing(parseInt(e.target.value))
                                }
                            />
                        </>
                    )}
                    {single && (
                        <>
                            <input
                                className="p-0 mx-0.5 text-center w-1/2 text-gray-800 border border-gray-400 appearance-none focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-30"
                                type="number"
                                name="servings"
                                id="servings"
                                value={serving}
                                min="1"
                                onChange={(e) => setServing(e.target.value)}
                            />
                            g
                        </>
                    )}
                </div>
                <hr className="my-2 border-t-4 border-b-4 border-gray-800" />
                <section className="capitalize calories">
                    <div className="flex justify-between text-sm">
                        <div>amount per serving</div>
                        <div>
                            <small className="font-light">
                                ({Math.round(label.calories.kJ.value / factor)}
                                {label.calories.kJ.unit})
                            </small>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <strong className="self-end text-2xl">calories</strong>
                        <div className="text-3xl font-extrabold">
                            {Math.round(label.calories.kcal.value / factor)}
                        </div>
                    </div>
                    <div className="flex justify-between text-sm">
                        <div>calories from fat</div>
                        <div>
                            {Math.round(
                                (label.fat.total_fat.value * 9) / factor
                            )}
                        </div>
                    </div>
                </section>
                <hr className="my-2 border-t-4 border-b-2 border-gray-800" />
                <section className="text-sm capitalize nutrients">
                    <section className="food-components">
                        <div className="flex justify-end border-b border-gray-400">
                            <strong>
                                <small>% daily value*</small>
                            </strong>
                        </div>
                        <div className="flex justify-between border-b border-gray-400">
                            <div>
                                <strong>total fat</strong>{' '}
                                {roundDecimal(
                                    label.fat.total_fat.value / factor
                                )}
                                <span className="lowercase">
                                    {label.fat.total_fat.unit}
                                </span>
                            </div>
                            <div>
                                <strong>
                                    {roundDecimal(
                                        label.fat.total_fat.daily_value / factor
                                    )}
                                    %
                                </strong>
                            </div>
                        </div>
                        {Object.keys(label.fat.sub).map((key) => {
                            const fat = label.fat.sub[key];

                            return (
                                <div
                                    className="flex justify-between text-xs leading-relaxed border-b border-gray-400"
                                    key={key}
                                >
                                    <div className="pl-4">
                                        {key.substr(2).replace('_', ' ')}{' '}
                                        {roundDecimal(fat.value / factor)}
                                        <span className="lowercase">
                                            {fat.unit}
                                        </span>
                                    </div>
                                    {fat.daily_value && (
                                        <div>
                                            <strong>
                                                {roundDecimal(
                                                    fat.daily_value / factor
                                                )}
                                                %
                                            </strong>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div className="flex justify-between border-b border-gray-400">
                            <div>
                                <strong>cholesterol</strong>{' '}
                                {label.cholesterol.value}
                                <span className="lowercase">
                                    {label.cholesterol.unit}
                                </span>
                            </div>
                            <div>
                                <strong>
                                    {roundDecimal(
                                        label.cholesterol.daily_value / factor
                                    )}
                                    %
                                </strong>
                            </div>
                        </div>
                        <div className="flex justify-between border-b border-gray-400">
                            <div>
                                <strong>sodium</strong> {label.sodium.value}
                                <span className="lowercase">
                                    {label.sodium.unit}
                                </span>
                            </div>
                            <div>
                                <strong>
                                    {roundDecimal(
                                        label.sodium.daily_value / factor
                                    )}
                                    %
                                </strong>
                            </div>
                        </div>
                        <div className="flex justify-between border-b border-gray-400">
                            <div>
                                <strong>total carbohydrate</strong>{' '}
                                {roundDecimal(
                                    label.carbohydrate.total_carbohydrate
                                        .value / factor
                                )}
                                <span className="lowercase">
                                    {label.carbohydrate.total_carbohydrate.unit}
                                </span>
                            </div>
                            <div>
                                <strong>
                                    {roundDecimal(
                                        label.carbohydrate.total_carbohydrate
                                            .daily_value / factor
                                    )}
                                    %
                                </strong>
                            </div>
                        </div>
                        {Object.keys(label.carbohydrate.sub).map((key) => {
                            const carbs = label.carbohydrate.sub[key];

                            return (
                                <div
                                    className="flex justify-between text-xs leading-relaxed border-b border-gray-400"
                                    key={key}
                                >
                                    <div className="pl-4">
                                        {key.substr(2).replace('_', ' ')}{' '}
                                        {roundDecimal(carbs.value / factor)}
                                        <span className="lowercase">
                                            {carbs.unit}
                                        </span>
                                    </div>
                                    {carbs.daily_value && (
                                        <div>
                                            <strong>
                                                {roundDecimal(
                                                    carbs.daily_value / factor
                                                )}
                                                %
                                            </strong>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div className="flex justify-start">
                            <div>
                                <strong>protein</strong>{' '}
                                {roundDecimal(label.protein.value / factor)}
                                <span className="lowercase">
                                    {label.protein.unit}
                                </span>
                            </div>
                        </div>
                    </section>
                    <hr className="my-2 border-t-4 border-b-4 border-gray-800" />
                    <div className="flex justify-between border-b border-gray-400">
                        <div>
                            vitamin d{' '}
                            {roundDecimal(label.vitamin_d.value / factor)}
                            <span className="lowercase">
                                {label.vitamin_d.unit}
                            </span>
                        </div>
                        <div>
                            <strong>
                                {roundDecimal(
                                    label.vitamin_d.daily_value / factor
                                )}
                                %
                            </strong>
                        </div>
                    </div>
                    <div className="flex justify-between border-b border-gray-400">
                        <div>
                            calcium {roundDecimal(label.calcium.value / factor)}
                            <span className="lowercase">
                                {label.calcium.unit}
                            </span>
                        </div>
                        <div>
                            <strong>
                                {roundDecimal(
                                    label.calcium.daily_value / factor
                                )}
                                %
                            </strong>
                        </div>
                    </div>
                    <div className="flex justify-between border-b border-gray-400">
                        <div>
                            iron {roundDecimal(label.iron.value / factor)}
                            <span className="lowercase">{label.iron.unit}</span>
                        </div>
                        <div>
                            <strong>
                                {roundDecimal(label.iron.daily_value / factor)}%
                            </strong>
                        </div>
                    </div>
                    <div className="flex justify-between border-b border-gray-400">
                        <div>
                            potassium{' '}
                            {roundDecimal(label.potassium.value / factor)}
                            <span className="lowercase">
                                {label.potassium.unit}
                            </span>
                        </div>
                        <div>
                            <strong>
                                {roundDecimal(
                                    label.potassium.daily_value / factor
                                )}
                                %
                            </strong>
                        </div>
                    </div>
                </section>
                <div className="flex mt-2 text-xs">
                    <div className="mr-2">*</div>
                    <div>
                        The % Daily Value (DV) tells you how much a nutrient in
                        a serving of food contributes to a daily diet. 2,000
                        calories a day is used for general nutrition advice.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NutrientLabel;
