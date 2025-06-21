import Logo from "@/assets/icons/Logo.webp";

const SuspenseElement = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen px-10 bg-white">
      <img src={Logo} alt="Logo" className="object-contain h-auto w-96" />
    </div>
  );
};

export default SuspenseElement;
