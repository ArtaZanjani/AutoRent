import { useState, useMemo } from "react";
import { TickCircle, Timer1, CloseCircle } from "iconsax-react";
import BaseImage from "../common/BaseImage";
import { motion } from "motion/react";
import BaseBg from "@/components/common/BaseBg";
import { capitalAirports } from "@/utils/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const MyReservations = ({ data = [], isLoading, error }) => {
  const [filter, setFilter] = useState("جاری");
  const [errorList, setErrorList] = useState([]);
  const [idDataMore, setIdDataMore] = useState(null);

  const counts = useMemo(() => {
    const result = { جاری: 0, "انجام شده": 0, "لغو شده": 0 };
    data.forEach((order) => {
      if (order?.status in result) result[order?.status]++;
    });
    return result;
  }, [data]);

  const filteredData = useMemo(() => data.filter((order) => order?.status === filter), [data, filter]);

  const fincById = data.find((e) => e.id === idDataMore);

  const dataFindById = useMemo(() => {
    if (!fincById?.id) return [];
    const findAirportName = capitalAirports.find((e) => e.code === fincById?.AirportCode);

    return [
      { title: "نام خودرو", value: fincById?.carInfo?.carName },
      { title: "محل تحویل", value: findAirportName?.airport },
      { title: "تاریخ تحویل", value: fincById?.Date?.startDate },
      { title: "تاریخ بازگشت", value: fincById?.Date?.endDate },
      { title: "ساعت تحویل", value: fincById?.Date?.startTime },
      { title: "ساعت بازگشت", value: fincById?.Date?.endTime },
      { title: "وضعیت", value: fincById?.status === "جاری" ? "در حال بررسی" : fincById?.status },
    ];
  }, [fincById]);

  const filterBtn = [
    { label: "جاری", value: counts["جاری"] },
    { label: "انجام شده", value: counts["انجام شده"] },
    { label: "لغو شده", value: counts["لغو شده"] },
  ];

  const onImageError = (id) => {
    setErrorList((prev) => [...new Set([...prev, id])]);
  };

  return (
    <>
      <div className="w-full mt-8">
        <div className="w-full flex flex-row flex-wrap justify-between items-center gap-x-9 gap-y-4">
          {filterBtn.map((e, index) => (
            <button key={index} className={`flex flex-col justify-center items-center rounded-lg gap-y-1 border border-primary-shade-3 h-20 min-w-66 flex-1 ${e.label === filter ? "bg-primary-shade-3" : ""}`} onClick={() => setFilter(e.label)}>
              <p className={`${e.label === filter ? "text-white" : "text-neutral-gray-8"} font-bold`}>{e.label}</p>
              <p className={`${e.label === filter ? "text-secondary" : "text-neutral-gray-5"} font-semibold`}>{e.value}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filteredData.map((order, index) => (
            <div className={`w-full min-h-30 rounded-lg whitespace-nowrap overflow-x-auto gap-x-10 xl:gap-x-0 border border-neutral-gray-2 flex justify-between items-center p-3`} key={index}>
              <div className="flex items-center gap-x-2">
                {order?.status === "جاری" ? (
                  <>
                    <Timer1 className="size-6 stroke-info" />
                    <p className="text-sm font-medium text-info">در حال بررسی</p>
                  </>
                ) : order?.status === "انجام شده" ? (
                  <>
                    <TickCircle className="size-6 stroke-success" />
                    <p className="text-sm font-medium text-success">انجام شده</p>
                  </>
                ) : (
                  <>
                    <CloseCircle className="size-6 stroke-error" />
                    <p className="text-sm font-medium text-error">لغو شده</p>
                  </>
                )}
              </div>

              <div className="w-40 h-24">
                <div className={`w-40 h-24 rounded-lg overflow-hidden bg-neutral-gray-1 ${errorList.includes(order?.id) ? "p-1" : ""}`}>
                  <BaseImage src={order?.carInfo?.carImage} alt={order?.carInfo?.carName} onError={() => onImageError(order?.id)} />
                </div>
              </div>

              <div className="flex flex-col gap-y-2">
                <p className="text-base font-bold text-neutral-gray-10">{order?.carInfo?.carName}</p>
                <p className="text-sm font-bold text-neutral-gray-8">
                  تاریخ تحویل:{" "}
                  <span dir="ltr" className="text-sm font-bold text-neutral-gray-8">
                    {order?.Date?.startDate}
                  </span>{" "}
                  ساعت{" "}
                  <span dir="ltr" className="text-sm font-bold text-neutral-gray-8">
                    {order?.Date?.startTime}
                  </span>
                </p>
              </div>

              <button className={`btnBase btn-border-primary`} onClick={() => setIdDataMore(order?.id)}>
                مشاهده جزئیات
              </button>
            </div>
          ))}
        </div>
      </div>
      <BaseBg isOpen={fincById?.id} onClose={() => setIdDataMore(null)}>
        {fincById?.id && (
          <motion.div className="w-[95%] xs:w-96 bg-white rounded-2xl py-3 absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center" onClick={(e) => e.stopPropagation()} initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ duration: 0.225, ease: [0.4, 0, 0.2, 1] }}>
            <div className="w-full px-3">
              <div className={`w-full h-44 rounded-lg overflow-hidden bg-neutral-gray-1 ${errorList.includes(fincById?.id) ? "p-1" : ""}`}>
                <BaseImage src={fincById?.carInfo?.carImage} alt={fincById?.carInfo?.carName} onError={() => onImageError(fincById?.id)} />
              </div>
            </div>

            <div className="w-full mt-3">
              {dataFindById.map((e, index) => (
                <div key={index} className={`w-full gap-x-3 flex h-12 justify-between items-center p-2 ${index === dataFindById.length - 1 ? "" : "border-b border-neutral-gray-3"} px-3`}>
                  <p className="text-sm">{e.title}</p>
                  <p className="truncate flex-1 text-left text-sm">{e.value}</p>
                </div>
              ))}
            </div>

            <div className="w-full h-12 mt-3 px-3">
              <button onClick={() => setIdDataMore(null)} className="btnBase btn-fill-primary w-full h-12">
                بستن
              </button>
            </div>
          </motion.div>
        )}
      </BaseBg>
    </>
  );
};

export default MyReservations;
