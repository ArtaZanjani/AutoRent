const CheckBox = ({ active, handleChange = null, size = "size-6" }) => {
  return (
    <div onClick={handleChange} className={`border-2 cursor-pointer rounded-lg flex justify-center items-center p-px ${size} ${active ? "border-primary bg-primary" : "border-neutral-gray-4 bg-transparent"}`}>
      {active && (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check size-5 fill-white" viewBox="0 0 16 16">
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
        </svg>
      )}
    </div>
  );
};

export default CheckBox;
