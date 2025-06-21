import Error404 from "@/assets/icons/404.webp";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="relative flex flex-col items-center w-full mt-20">
      <img src={Error404} alt="صفحه مورد نظر یافت نشد" className="object-cover w-full md:h-screen" />

      <div className="absolute flex flex-col items-center gap-y-2 bottom-4 xs:bottom-10 md:bottom-30">
        <p className="text-lg font-medium text-neutral-gray-10 xs:text-xl">صفحه مورد نظر یافت نشد</p>
        <Link to="/" className="btnBase btn-border-primary h-9">
          رفتن به صفحه اصلی
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
