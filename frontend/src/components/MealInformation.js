import Button from './layout/Button';
import axiosInstance from './axios/axiosInstance';
import Alert from './layout/Alert';
import { useContext, useState } from 'react';
import Modal from './layout/Modal';
import LoginComponent from './layout/LoginComponent';
import axiosLogin from './axios/axiosLogin';
import LoginContext from './context/LoginContext';

const MealInformation = ({ data, className }) => {
    const foodData = data.data;
    const [addedToLog, setaddedToLog] = useState(false);
    const [opacity, setOpacity] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showModal, setModal] = useState(false);
    const { setLoggedIn } = useContext(LoginContext);

    async function handleSubmit(e) {
        setError(() => null);
        e.preventDefault();

        await axiosLogin(username, password, setError);
        setLoggedIn(true);
        handleHide();
        addToLog();
    }

    const addToLog = () => {
        axiosInstance
            .post('add-to-log', { data: foodData })
            .then((response) => {
                setaddedToLog(true);
                setTimeout(() => {
                    setOpacity(true);
                }, 100);
                setTimeout(() => {
                    setOpacity(false);
                }, 3000);
                setTimeout(() => {
                    setaddedToLog(false);
                }, 3500);
            })
            .catch((err) => handleShow());
    };

    const handleShow = () => setModal(true);
    const handleHide = () => setModal(false);

    const modal = showModal ? (
        <Modal>
            <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="container relative flex flex-col bg-white h-fit-content w-96">
                    <LoginComponent
                        submit={handleSubmit}
                        username={username}
                        password={password}
                        error={error}
                        setUsername={setUsername}
                        setPassword={setPassword}
                        modal
                    />
                    <button
                        onClick={handleHide}
                        className="absolute top-4 right-8"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-purple-500 fill-current hover:text-purple-700"
                            viewBox="0 0 24 24"
                        >
                            <title>Close</title>
                            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z" />
                        </svg>
                    </button>
                </div>
            </div>
        </Modal>
    ) : null;

    return (
        <div className={className}>
            <div className="title">
                <p className="mb-4 text-3xl font-bold text-gray-800 xl:text-4xl font-montserrat">
                    <span className="capitalize">food overview</span>
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-center table-auto">
                    <thead>
                        <tr>
                            <th className="hidden p-3 text-sm leading-4 tracking-wider text-purple-700 border-b-2 border-gray-300 lg:table-cell"></th>
                            <th className="p-3 text-sm leading-4 tracking-wider text-purple-700 border-b-2 border-gray-300">
                                Quantity
                            </th>
                            <th className="p-3 text-sm leading-4 tracking-wider text-purple-700 border-b-2 border-gray-300">
                                Unit
                            </th>
                            <th className="p-3 text-sm leading-4 tracking-wider text-purple-700 border-b-2 border-gray-300">
                                Food
                            </th>
                            <th className="p-3 text-sm leading-4 tracking-wider text-purple-700 border-b-2 border-gray-300">
                                Calories
                            </th>
                            <th className="p-3 text-sm leading-4 tracking-wider text-purple-700 border-b-2 border-gray-300">
                                Weight
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {foodData.map((item, i) => {
                            return (
                                <tr className="" key={i}>
                                    <td className="hidden px-6 py-4 text-sm leading-5 text-purple-900 whitespace-no-wrap border-b border-gray-500 lg:table-cell">
                                        <img
                                            src={item.photo.thumb}
                                            alt={item.name}
                                            className="object-scale-down w-20 mx-auto rounded-lg max-h-20"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm leading-5 text-purple-900 whitespace-no-wrap border-b border-gray-500">
                                        {item.serving_qty}
                                    </td>
                                    <td className="px-6 py-4 text-sm leading-5 text-purple-900 whitespace-no-wrap border-b border-gray-500">
                                        {item.serving_unit}
                                    </td>
                                    <td className="px-6 py-4 text-sm leading-5 text-purple-900 capitalize whitespace-no-wrap border-b border-gray-500">
                                        <a
                                            className="font-bold"
                                            href={`food/${item.name.replaceAll(
                                                ' ',
                                                '-'
                                            )}`}
                                        >
                                            {item.name}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-sm leading-5 text-purple-900 whitespace-no-wrap border-b border-gray-500">
                                        {Math.round(
                                            item.full_nutrients[
                                                item.full_nutrients.findIndex(
                                                    (e) => e.name === 'Energy'
                                                )
                                            ].value
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm leading-5 text-purple-900 whitespace-no-wrap border-b border-gray-500">
                                        {item.serving_weight_grams}g
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center h-10 mt-4">
                <div className="w-0 mr-auto md:w-1/4"></div>
                {addedToLog && (
                    <div
                        className={`mt-0.5 mr-5 ${
                            opacity ? 'opacity-1' : 'opacity-0'
                        } transition duration-500`}
                    >
                        <Alert type="success" margin="mb-0">
                            Added food to your log
                        </Alert>
                    </div>
                )}
                <div className="w-1/3 md:w-1/4 place-self-end">
                    <Button
                        borderColor="border-green-300"
                        gradientColor="green-teal-gradient"
                        onClick={addToLog}
                    >
                        Add to Log
                    </Button>
                    {modal}
                </div>
            </div>
        </div>
    );
};

export default MealInformation;
