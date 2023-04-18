const InputField = ({ id, inputType, placeholder, label, handleChange }) => {
  return (
    <div className="form-group mb-6">
      <label htmlFor={id} className="form-label inline-block mb-2 text-gray-700">
        {label}
      </label>
      <input
        type={inputType}
        className="form-control
            block
            w-full
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-gray-900 focus:outline-none"
        id={id}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
};

export default InputField;
