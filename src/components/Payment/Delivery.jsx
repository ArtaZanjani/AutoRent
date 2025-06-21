import { TickCircle } from "iconsax-react";
import DataShow from "./DataShow";
import { Link } from "react-router-dom";

const Delivery = () => {
  return (
    <>
      <div className="flex flex-col items-center w-full overflow-hidden bg-white border shadow-2xl mt-14 gap-y-6 rounded-2xl border-neutral-gray-2">
        <div className="flex items-center justify-center w-full h-14 bg-success-light-4 gap-x-2 sm:gap-x-4">
          <TickCircle className="size-7 sm:size-10 stroke-success-dark-1" />
          <p className="text-base text-success-dark-1 sm:text-xl">پرداخت شما با موفقیت انجام شد.</p>
        </div>

        <p className="px-6 text-sm font-bold leading-relaxed text-center xs:text-base sm:text-xl text-neutral-gray-10">خودروی شما آماده تحویل می‌باشد، کارشناسان ما در سریعترین زمان ممکن جهت پیگیری سفارش با شما تماس خواهند گرفت.</p>

        <div className="flex flex-col items-center w-full p-6 bg-white rounded-2xl gap-y-4">
          <p className="text-xl font-bold text-neutral-gray-10">جزئیات شفارش</p>
          <DataShow />
        </div>
      </div>
      <Link to="/dashboard/my-reservations" className="w-full h-12 mx-auto mt-10 btnBase btn-fill-primary xs:w-80">
        پیگیری سفارش
      </Link>
    </>
  );
};

export default Delivery;
