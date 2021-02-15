import { useEffect, useState } from 'react';
import { ReactComponent as ContactImage } from '../../static/images/nutrition_data.svg';
import Alert from '../layout/Alert';
import { baseURL } from '../axios/baseURL';
import Button from '../layout/Button';
import InputBox from '../layout/InputBox';
import StyledTextArea from '../layout/TextArea';
import axios from 'axios';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState({});
    const [mailSent, setMailSent] = useState(false);

    function handleSubmit(e) {
        setMailSent(() => false);
        setError({});
        e.preventDefault();

        axios
            .post(baseURL + 'contact', {
                name: name,
                email: email,
                comment: comment,
            })
            .then((response) => {
                setMailSent(true);
            })
            .catch((err) => {
                setError(() => {
                    return {
                        msg:
                            'There was an error sending an email.\nPlease try again later.',
                    };
                });
            });
    }

    useEffect(() => {
        if (!error) {
            setMailSent(true);
        }
    }, [error]);

    return (
        <section className="flex flex-col items-center md:flex-row">
            <div className="container flex justify-center mx-auto">
                <div className="flex w-full rounded-lg xl:w-3/4 lg:w-11/12 lg:shadow-xl ">
                    <div className="relative hidden w-full h-auto px-8 py-16 bg-cover border-r rounded-lg rounded-l-lg bg-purple-1300 md:block lg:w-1/2 lg:px-12">
                        <h2 className="mt-2 mb-2 text-2xl font-semibold tracking-tighter purple-blue-gradient text-gradient sm:text-3xl font-montserrat">
                            Contact
                        </h2>
                        <div className="w-full mt-4 leading-relaxed text-gray-900 text-1xl">
                            <p className="mb-4 text-lg">
                                Have suggestion? Ran into trouble?
                                <br />
                                Just want to say hi?
                                <br />
                                <br />
                                Drop a message and we will get back to you.
                            </p>
                            <ContactImage />
                        </div>
                    </div>
                    <div className="w-full px-8 py-16 border-gray-100 rounded-lg bg-purple-1300 lg:w-1/2 lg:px-12 lg:rounded-l-none">
                        <div className="relative z-10 text-left ">
                            <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-center md:hidden purple-blue-gradient text-gradient sm:text-3xl font-montserrat">
                                Contact
                            </h2>
                            <form
                                className="mt-6 md:mt-0"
                                onSubmit={handleSubmit}
                                method="POST"
                            >
                                {error &&
                                    Object.keys(error).map((field) =>
                                        Array.isArray(error[field]) ? (
                                            error[field].map((line) => {
                                                return (
                                                    <Alert
                                                        type="danger"
                                                        key={`${line}`}
                                                    >
                                                        {line}
                                                    </Alert>
                                                );
                                            })
                                        ) : (
                                            <Alert
                                                type="danger"
                                                key={`${field}`}
                                            >
                                                {error[field]}
                                            </Alert>
                                        )
                                    )}
                                {mailSent && (
                                    <Alert type="success">
                                        Your email was sent.
                                    </Alert>
                                )}
                                <div className="relative inline-block w-full p-0 mt-6 mr-1 bg-white rounded shadow-lg sm:mr-3">
                                    <InputBox
                                        type="email"
                                        required
                                        placeholder=" "
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e)}
                                        autoComplete="on"
                                    >
                                        Your Email
                                    </InputBox>
                                </div>
                                <div className="relative inline-block w-full p-0 mt-1 mr-1 bg-white rounded shadow-lg sm:mr-3">
                                    <InputBox
                                        type="text"
                                        placeholder=" "
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e)}
                                        autoComplete="on"
                                    >
                                        Your Name
                                    </InputBox>
                                </div>

                                <div className="relative inline-block w-full p-0 mt-1 mr-1 bg-white rounded shadow-lg sm:mr-3">
                                    <StyledTextArea
                                        placeholder=" "
                                        name="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e)}
                                    >
                                        Tell us your story
                                    </StyledTextArea>
                                </div>

                                <Button
                                    borderColor="border-green-300"
                                    gradientColor="green-teal-gradient"
                                    className="w-full mt-6"
                                >
                                    Send on it's way
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
