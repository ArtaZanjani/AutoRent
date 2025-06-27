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
      <div className="relative w-full h-56 p-0 overflow-hidden border pointer-events-none border-neutral-gray-2 rounded-xl">
        <BaseImage src={imgUrl} alt={`${brand} ${model}`} />
        {price.discount > 0 && <div className="absolute flex items-center justify-center font-medium text-white rounded-md top-2 left-2 w-11 h-11 bg-primary-shade-3">%{price.discount.toLocaleString()}</div>}
      </div>

      <p className="w-full font-bold text-black truncate min-h-6">
        {brand} {model}
      </p>
      <p className="w-full text-neutral-gray-9">سال ساخت: {yearOfManufacture}</p>

      {priceDetails.map(({ title, value }, i) => (
        <div key={i} className="flex items-center justify-between w-full h-10 p-2 rounded-lg bg-neutral-gray-1">
          <p className="font-medium text-neutral-gray-8">{title}</p>
          <p className="font-semibold text-primary">{value}</p>
        </div>
      ))}

      <div className="flex items-center justify-between w-full px-2">
        <p className="font-medium text-neutral-gray-8">مبلغ ضمانت</p>
        <p className="font-semibold">{price.securityDeposit?.toLocaleString() || "-"}</p>
      </div>

      <Link to={`/product-detail/${id}`} className="w-full h-12 btnBase btn-fill-primary" aria-label="درخواست رزرو">
        درخواست رزرو
      </Link>
    </div>
  );
};

export default Card;
