const TextArea = (props) => {
    function handleChange(e) {
        props.onChange(e.target.value);
    }

    return (
        <>
            <textarea
                className='relative z-20 block w-full px-2 pt-5 pb-1 transition duration-300 bg-transparent border border-gray-400 rounded no-autofill-bg md:px-3 focus:outline-none focus:border-purple-500'
                rows='6'
                cols='33'
                required={props.required}
                name={props.name}
                placeholder={props.placeholder}
                autoFocus={props.autoFocus || false}
                autoComplete={props.autoComplete}
                onChange={handleChange}
            ></textarea>
            <label
                htmlFor={props.name}
                className='absolute z-10 inline-block tracking-tighter text-gray-500 duration-300 origin-top-left transform left-3 top-4 md:text-base focus:outline-none'
            >
                {props.children}
            </label>
        </>
    );
};

export default TextArea;
