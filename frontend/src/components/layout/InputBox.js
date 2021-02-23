const InputBox = (props) => {
    function handleChange(e) {
        props.onChange(e.target.value);
    }

    return (
        <>
            <input
                className='relative z-20 block w-full px-2 pt-5 pb-1 transition duration-300 bg-transparent border border-gray-400 rounded no-autofill-bg md:px-3 focus:outline-none focus:border-purple-500'
                type={props.type}
                required={props.required}
                name={props.name}
                placeholder={props.placeholder}
                value={props.value || ''}
                autoFocus={props.autoFocus || false}
                autoComplete={props.autoComplete}
                onChange={handleChange}
            />
            <label
                htmlFor={props.name}
                className='absolute z-10 inline-block tracking-tighter text-gray-500 duration-300 origin-top-left transform -translate-y-1/2 left-3 top-1/2 md:text-base focus:outline-none'>
                {props.children}
            </label>
        </>
    );
};

export default InputBox;
