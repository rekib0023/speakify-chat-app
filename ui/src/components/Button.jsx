const Button = ({ label }) => {
  return (
    <button
      type="submit"
      className="
        w-full
        px-6
        py-5
        bg-neutral-800
        text-white
        font-medium
        text-xs
        leading-tight
        uppercase
        rounded
        shadow-md
        hover:bg-neutral-900 hover:shadow-lg
        focus:bg-neutral-900 focus:shadow-lg focus:outline-none focus:ring-0
        active:bg-neutral-900 active:shadow-lg
        transition
        duration-150
        ease-in-out"
    >
      {label}
    </button>
  );
};

export default Button;
