import Error404 from "@/assets/icons/404.webp";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="mt-20 w-full flex flex-col items-center relative">
      <img src={Error404} alt="صفحه مورد نظر یافت نشد" className="w-full md:h-screen object-cover" />

      <div className="flex flex-col items-center gap-y-2 absolute bottom-4 xs:bottom-10 md:bottom-30">
        <p className="text-neutral-gray-10 text-lg xs:text-xl font-medium">صفحه مورد نظر یافت نشد</p>
        <Link to="/" className="btnBase btn-border-primary h-9">
          رفتن به صفحه اصلی
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
