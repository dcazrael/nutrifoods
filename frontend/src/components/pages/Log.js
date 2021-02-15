import { useState, useEffect } from 'react';
import { ReactComponent as SideImage } from '../../static/images/checklist.svg';
import Alert from '../layout/Alert';
import axiosInstance from '../axios/axiosInstance';
import TwoCol from '../layout/TwoCol';

const Log = () => {
    const title = 'Log';
    const [log, setLog] = useState({});
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const loadLog = () => {
        axiosInstance
            .get('log')
            .then((response) => {
                setLog(response.data);
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    useEffect(() => loadLog(), [error, success]);

    const calorySum = (day) => {
        let calSum = 0;
        log[day].map((item) => {
            return (calSum += item.calories);
        });
        return calSum;
    };

    function handleDelete(e) {
        setError(false);
        setSuccess(false);
        axiosInstance
            .post('delete-log-item', { id: e.target.value })
            .then((result) => {
                setSuccess(true);
            })
            .catch((err) => {
                setError(err.response.data.status);
            });
    }

    return (
        <TwoCol title={title} image={<SideImage />} largeRight>
            <h3 className="mb-2 text-3xl font-semibold tracking-tighter text-center text-purple-500 lg:text-left lg:hidden font-montserrat">
                {title}
            </h3>
            {log &&
                Object.keys(log).map((day) => {
                    return (
                        <div className="my-6" key={day}>
                            <div className="p-2 mt-6 text-xl font-bold text-purple-700 bg-purple-200 border border-b-0 border-purple-300">
                                {day}
                            </div>
                            <div className="overflow-x-auto border border-t-0 border-purple-300 shadow-lg rounded-b-md">
                                <table className="w-full mx-0 table-auto">
                                    <thead>
                                        <tr className="capitalize">
                                            <th className="px-4 py-3"></th>
                                            <th className="px-4 py-3">food</th>
                                            <th className="px-4 py-3">unit</th>
                                            <th className="px-4 py-3">
                                                quantity
                                            </th>
                                            <th className="px-4 py-3">
                                                calories
                                            </th>
                                            <th className="px-4 py-3">
                                                weight
                                            </th>
                                            <th className="px-4 py-3">
                                                meal time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {log[day].map((item, index) => {
                                            return (
                                                <tr
                                                    className={`${
                                                        index % 2 === 0
                                                            ? 'bg-purple-100 text-purple-900'
                                                            : 'text-gray-900'
                                                    } text-center capitalize hover:bg-purple-200`}
                                                    key={`${day}-${index}`}
                                                >
                                                    <td className="flex items-center justify-center px-4 py-3">
                                                        <button
                                                            onClick={
                                                                handleDelete
                                                            }
                                                            value={item.id}
                                                            className="focus:outline-none"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-6 h-6 text-purple-400 pointer-events-none fill-current icon focus:outline-none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M18.5 15c-2.483 0-4.5 2.015-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.017-4.5-4.5-4.5zm2.5 5h-5v-1h5v1zm-7.18 4h-12.82v-24h10.189c3.163 0 9.811 7.223 9.811 9.614v3.887c-.623-.261-1.297-.422-2-.476v-2.569c0-4.106-6-2.456-6-2.456s1.518-6-2.638-6h-7.362v20h9.502c.312.749.764 1.424 1.318 2z" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        {item.food}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.unit}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.calories}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.weight}g
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.meal_time}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-4 py-3 font-semibold text-center text-purple-900"
                                            >
                                                Total calories: {calorySum(day)}
                                                kcal
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-4 py-3 font-semibold text-center text-purple-900"
                                            >
                                                {success && (
                                                    <Alert type="success">
                                                        Success: Item was
                                                        deleted from Log
                                                    </Alert>
                                                )}
                                                {error && (
                                                    <Alert type="danger">
                                                        Item couldn't be
                                                        deleted: {error}
                                                    </Alert>
                                                )}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    );
                })}
            {Object.entries(log).length === 0 ? (
                <div className="p-4 mt-6 text-xl font-bold text-gray-700 bg-purple-200 border border-purple-300 rounded-lg">
                    You don't have any items in your log yet. Consider adding
                    some.
                </div>
            ) : null}
        </TwoCol>
    );
};

export default Log;
