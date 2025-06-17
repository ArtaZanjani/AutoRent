import { TickCircle } from "iconsax-react";
import DataShow from "./DataShow";
import { Link } from "react-router-dom";

const Delivery = () => {
  return (
    <>
      <div className="w-full mt-14 flex flex-col gap-y-6 items-center bg-white shadow-2xl rounded-2xl overflow-hidden border border-neutral-gray-2">
        <div className="w-full h-14 bg-success-light-4 flex justify-center items-center gap-x-2 sm:gap-x-4">
          <TickCircle className="size-7 sm:size-10 stroke-success-dark-1" />
          <p className="text-success-dark-1 text-base sm:text-xl">پرداخت شما با موفقیت انجام شد.</p>
        </div>

        <p className="text-sm xs:text-base sm:text-xl  text-center font-bold text-neutral-gray-10 px-6 leading-relaxed">خودروی شما آماده تحویل می‌باشد، کارشناسان ما در سریعترین زمان ممکن جهت پیگیری سفارش با شما تماس خواهند گرفت.</p>

        <div className="w-full bg-white flex flex-col items-center p-6 rounded-2xl gap-y-4">
          <p className="text-xl font-bold text-neutral-gray-10">جزئیات شفارش</p>
          <DataShow />
        </div>
      </div>
      <Link to="/dashboard/my-reservations" className="btnBase h-12 btn-fill-primary w-full xs:w-80 mx-auto mt-10">
        پیگیری سفارش
      </Link>
    </>
  );
};

export default Delivery;
