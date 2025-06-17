import BaseImage from "@/components/common/BaseImage";
import { Link } from "react-router-dom";

const Card = ({ car }) => {
  const { id = "", Image: imgUrl = "", brand = "", model = "", yearOfManufacture = "", price = {} } = car || {};

  const priceDetails = [
    { title: "روزانه", value: price.daily?.toLocaleString() || "-" },
    { title: "ماهانه", value: price.monthly?.toLocaleString() || "-" },
  ];

  return (
    <div className="w-full xs:w-[392px] h-[500px] bg-white border border-neutral-gray-2 rounded-2xl overflow-hidden p-3 flex flex-col justify-start items-center gap-y-3">
      <div className="w-full h-56 border border-neutral-gray-2 rounded-xl overflow-hidden relative pointer-events-none p-0">
        <BaseImage src={`${import.meta.env.VITE_API_CARS_IMAGE}${imgUrl}`} alt={`${brand} ${model}`} />
        {price.discount > 0 && <div className="absolute top-2 left-2 w-11 h-11 flex justify-center items-center rounded-md bg-primary-shade-3 text-white font-medium">%{price.discount.toLocaleString()}</div>}
      </div>

      <p className="text-black font-bold w-full truncate min-h-6">
        {brand} {model}
      </p>
      <p className="text-neutral-gray-9 w-full">سال ساخت: {yearOfManufacture}</p>

      {priceDetails.map(({ title, value }, i) => (
        <div key={i} className="w-full h-10 bg-neutral-gray-1 rounded-lg flex justify-between items-center p-2">
          <p className="text-neutral-gray-8 font-medium">{title}</p>
          <p className="text-primary font-semibold">{value}</p>
        </div>
      ))}

      <div className="w-full flex justify-between items-center px-2">
        <p className="text-neutral-gray-8 font-medium">مبلغ ضمانت</p>
        <p className="font-semibold">{price.securityDeposit?.toLocaleString() || "-"}</p>
      </div>

      <Link to={`/product-detail/${id}`} className="btnBase btn-fill-primary h-12 w-full" aria-label="درخواست رزرو">
        درخواست رزرو
      </Link>
    </div>
  );
};

export default Card;
