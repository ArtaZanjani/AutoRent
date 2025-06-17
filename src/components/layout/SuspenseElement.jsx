import Logo from "@/assets/icons/Logo.webp";

const SuspenseElement = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center px-10 bg-white">
      <img src={Logo} alt="Logo" className="w-96 h-auto object-contain" />
    </div>
  );
};

export default SuspenseElement;
