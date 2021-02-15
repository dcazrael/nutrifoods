import { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import Button from '../layout/Button';
import InputBox from '../layout/InputBox';
import Unauthorized from '../Unauthorized';
import { ReactComponent as SideImage } from '../../static/images/checklist.svg';
import TwoCol from '../layout/TwoCol';

const PersonalInformation = () => {
    const loggedIn = localStorage.getItem('access_token');
    const [birthDate, setBirthDate] = useState('');
    const [weight, setWeight] = useState('');
    const [loadProfileError, setloadProfileError] = useState(null);

    function loadProfile() {
        axiosInstance
            .get('profile')
            .then((profile) => {
                setBirthDate(
                    profile.data.birth_date ? profile.data.birth_date : ''
                );
                setWeight(profile.data.weight ? profile.data.weight : '');
            })
            .catch((err) => {
                setloadProfileError(err.response.statusText);
            });
    }

    useEffect(() => {
        loadProfile();
    }, [loggedIn]);

    function handleProfileUpdate(e) {
        e.preventDefault();

        axiosInstance
            .patch('profile/update', {
                birth_date: birthDate,
                weight: weight,
            })
            .then((response) => {
                setBirthDate(
                    response.data.birth_date ? response.data.birth_date : ''
                );
                setWeight(response.data.weight ? response.data.weight : '');
            })
            .catch((err) => {
                setloadProfileError(err.response.data);
            });
    }

    const title = 'Profile';

    return (
        <>
            {loadProfileError && <Unauthorized error={loadProfileError} />}
            {!loadProfileError && (
                <TwoCol title={title} image={<SideImage />}>
                    <form
                        className="mt-0"
                        onSubmit={handleProfileUpdate}
                        method="POST"
                    >
                        <h3 className="mb-2 text-3xl font-semibold tracking-tighter text-center text-purple-500 md:text-left md:hidden font-montserrat">
                            {title}
                        </h3>
                        <div className="relative inline-block w-full p-0 mt-6 bg-white rounded shadow-lg md:mt-0">
                            <InputBox
                                type="date"
                                name="birthDate"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e)}
                                autoComplete="on"
                            >
                                Your Birth Date
                            </InputBox>
                        </div>
                        <div className="relative inline-block w-full p-0 mt-6 bg-white rounded shadow-lg">
                            <InputBox
                                type="number"
                                name="weight"
                                value={weight}
                                onChange={(e) => setWeight(e)}
                                autoComplete="on"
                            >
                                Your Weight
                            </InputBox>
                        </div>

                        <Button
                            borderColor="border-green-300"
                            gradientColor="green-teal-gradient"
                            className="w-full mt-6"
                        >
                            Save Changes
                        </Button>
                    </form>
                </TwoCol>
            )}
        </>
    );
};

export default PersonalInformation;
