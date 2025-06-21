import { useNavigate, useParams } from "react-router-dom";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ProductDetailSkeleton from "@/components/skeleton/ProductDetailSkeleton";
import { Star1, TickSquare, ArrowSwapVertical, Location, Calendar, Clock, Add, ArrowDown2 } from "iconsax-react";
import BaseImage from "@/components/common/BaseImage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { capitalAirports, times } from "@/utils/utils";
import { AnimatePresence, motion } from "motion/react";
import useMediaQuery from "@/hooks/useMediaQuery";
import useScrollBody from "@/hooks/useScrollBody";
import PersianDatePicker from "@/components/ui/PersianDatePicker";
import jalaliMoment from "jalali-moment";
import scrollToElement from "@/utils/scrollToElement";
import RadioBtn from "@/components/common/RadioBtn";
import useFetch from "@/hooks/useFetch";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";
import { SearchContext } from "@/context/SearchProvider";

const ProductDetail = ({ setAuthOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width:640px)");
  const { setIsScrolling } = useScrollBody();
  const { isLoggedIn } = useAuth();
  const { setBookingData } = useContext(SearchContext);

  const { data: dataCars, isLoading: loadingCars, error: errorCars } = useFetch(["repoData", id], `/cars/${id}`);
  const { data: commentsCars, isLoading: loadingCommentsCars, error: errorCommentsCars } = useFetch(["car-comments", id], `/car-comments?carId=${id}&_expand=user`);

  const brandName = dataCars ? `${dataCars?.brand} ${dataCars?.model}` : id;
  const rating = Math.round(dataCars?.rating || 0);

  const specifications = [
    { label: "مسافت پیموده", icon: <Star1 className="size-6 stroke-neutral-gray-8" />, value: `${dataCars?.specifications?.mileage} کیلومتر` },
    { label: "نوع دنده", icon: <Star1 className="size-6 stroke-neutral-gray-8" />, value: dataCars?.specifications?.transmission },
    { label: "سوخت", icon: <Star1 className="size-6 stroke-neutral-gray-8" />, value: dataCars?.specifications?.fuelType },
    { label: "ظرفیت", icon: <Star1 className="size-6 stroke-neutral-gray-8" />, value: `${dataCars?.specifications?.seatingCapacity} نفر` },
    { label: "فرمان", icon: <Star1 className="size-6 stroke-neutral-gray-8" />, value: dataCars?.specifications?.steering },
    { label: "مدل", icon: <Star1 className="size-6 stroke-neutral-gray-8" />, value: dataCars?.yearOfManufacture },
  ];

  const getRow = (label, getValue) => (
    <div className="grid items-center w-full grid-cols-3 py-2 text-sm border-b whitespace-nowrap md:text-base border-b-neutral-gray-2 last:border-b-0">
      <div className="col-start-1 row-start-1 text-sm font-semibold text-black">{label}</div>
      {dataCars?.insuranceOptions?.map((item, index) => (
        <div key={item.type} className={`text-xs font-medium text-black row-start-1 ${index === 0 ? "col-start-3 text-end" : index === 1 ? "col-start-2 text-center" : ""}`}>
          {getValue(item)}
        </div>
      ))}
    </div>
  );

  const priceDetails = [
    { title: "روزانه", value: dataCars?.price?.daily?.toLocaleString() || "-" },
    { title: "ماهانه", value: dataCars?.price?.monthly?.toLocaleString() || "-" },
  ];

  const [focus, setFocus] = useState(null);

  const [inputs, setInputs] = useState([
    { icon: <Location className="size-6 stroke-neutral-gray-6" />, Label: "محل تحویل خودرو", value: "", filterValue: "" },
    { icon: <Calendar className="size-6 stroke-neutral-gray-6" />, Label: "تاریخ تحویل / بازگشت", value: [], filterValue: "" },
    { icon: <Clock className="size-6 stroke-neutral-gray-6" />, Label: "ساعت تحویل", value: "", filterValue: "" },
    { icon: <Clock className="size-6 stroke-neutral-gray-6" />, Label: "ساعت برگشت", value: "", filterValue: "" },
  ]);

  const calculateDays = () => {
    const dateRange = inputs[1]?.value;
    if (!dateRange || !Array.isArray(dateRange) || dateRange.length !== 2) return 0;
    const [start, end] = dateRange;
    if (!start?.jy || !end?.jy) return 0;
    const startDate = jalaliMoment().jYear(start.jy).jMonth(start.jm).jDate(start.jd);
    const endDate = jalaliMoment().jYear(end.jy).jMonth(end.jm).jDate(end.jd);
    return endDate.diff(startDate, "days") + 1;
  };

  const calculateTotalPrice = () => {
    const days = calculateDays();
    const dailyPrice = dataCars?.price?.daily || 0;
    return days * dailyPrice;
  };

  useEffect(() => {
    const handleClose = () => setFocus(null);
    document.addEventListener("click", handleClose);
    return () => document.removeEventListener("click", handleClose);
  }, []);

  const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return "";
    if (Array.isArray(dateValue)) {
      return dateValue
        .map((date) => (date && typeof date === "object" && date.jy ? jalaliMoment().jYear(date.jy).jMonth(date.jm).jDate(date.jd).format("jYYYY-jMM-jDD") : ""))
        .filter(Boolean)
        .join(" - ");
    } else if (typeof dateValue === "object" && dateValue.jy) {
      return jalaliMoment().jYear(dateValue.jy).jMonth(dateValue.jm).jDate(dateValue.jd).format("jYYYY-jMM-jDD");
    }
    return dateValue;
  };

  const handleChange = (index, value) => {
    setInputs((prev) =>
      prev.map((input, i) => {
        if (i === index) {
          return { ...input, value: value, displayValue: index === 1 ? formatDateForDisplay(value) : input.displayValue };
        }
        return input;
      })
    );
    if (index !== 1) setFocus(null);
  };

  const timeToMinutes = useCallback((time) => (time ? time.split(":").reduce((h, m) => +h * 60 + +m, 0) : null), []);
  const isSameDay = useCallback((dateRange) => dateRange && Array.isArray(dateRange) && dateRange.length === 2 && dateRange[0]?.jy === dateRange[1]?.jy && dateRange[0]?.jm === dateRange[1]?.jm && dateRange[0]?.jd === dateRange[1]?.jd, []);

  useEffect(() => {
    const dateRange = inputs[1]?.value;
    const deliveryTime = inputs[2]?.value;

    if (isSameDay(dateRange) && deliveryTime) {
      const deliveryMinutes = timeToMinutes(deliveryTime);
      const nextValidTime = times.find((t) => timeToMinutes(t) > deliveryMinutes) || "";

      setInputs((prevInputs) => {
        const currentReturnTime = prevInputs[3].value;
        if (currentReturnTime !== nextValidTime) {
          return prevInputs.map((input, index) => (index === 3 ? { ...input, value: nextValidTime } : input));
        }
        return prevInputs;
      });
    }
  }, [inputs, isSameDay, timeToMinutes]);

  const handleFilterChange = (index, filterValue) => setInputs((prev) => prev.map((input, i) => (i === index ? { ...input, filterValue } : input)));

  const inputRef = useRef([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setInputs((prev) => prev.map((input) => ({ ...input, filterValue: "" })));
      setIsScrolling(focus === null || matches);
      if (focus !== null && focus !== 1 && inputRef.current) scrollToElement(inputRef, focus);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [focus, matches, setIsScrolling]);

  const [InsuranceType, setInsuranceType] = useState("بیمه پایه");
  const checkValue = inputs.every((e, i) => (i === 1 ? Array.isArray(e.value) && e.value.length === 2 && e.value.every((v) => v?.jy) : e.value?.length > 0));

  const handlePayment = () => {
    if (isLoggedIn) {
      const selectedAirport = capitalAirports.find((airport) => `${airport.city} - ${airport.airport}` === inputs[0].value);

      const formattedDateRange = inputs[1].value.map((dateObj) => ({
        ...dateObj,
        jm: dateObj.jm + 1,
      }));

      setBookingData({
        AirportCode: selectedAirport?.code || null,
        Date: formattedDateRange,
        time: [inputs[2].value, inputs[3].value],
        carInfo: {
          id: id,
          carName: brandName,
          carImage: `${import.meta.env.VITE_API_CARS_IMAGE}${dataCars?.Image}`,
          price: +calculateTotalPrice(),
          securityDeposit: dataCars?.price?.securityDeposit,
        },
        insuranceOptions: dataCars?.insuranceOptions?.find((option) => option.type === InsuranceType) || null,
      });

      navigate("/payment/1");
    } else {
      setAuthOpen();
    }
  };

  if (loadingCars || errorCars || loadingCommentsCars || errorCommentsCars) {
    return (
      <main className="w-full min-h-screen">
        <Breadcrumbs
          title="جزئیات محصول"
          crumbs={[
            { path: `/product-detail/${id}`, title: "جزئیات محصول" },
            { path: null, title: brandName },
          ]}
        />
        <ProductDetailSkeleton />
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen">
      <Breadcrumbs
        title="جزئیات محصول"
        crumbs={[
          { path: `/product-detail/${id}`, title: "جزئیات محصول" },
          { path: null, title: brandName },
        ]}
      />

      <div className="flex flex-col-reverse items-center w-full gap-6 xl:flex-row xl:items-start Padding">
        <div className="flex flex-col flex-1 gap-y-5">
          <div className="w-full p-6 pb-3 space-y-3 bg-white border min-h-32 rounded-2xl border-neutral-gray-2">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl font-bold text-neutral-gray-10">
                {dataCars?.brand} {dataCars?.model}
              </h1>
              <div className="flex flex-row-reverse items-center gap-x-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star1 key={index} size="24" color="#F4B740" variant={index < rating ? "Bold" : "Outline"} />
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-full">
              <div className="absolute right-0 w-10 -translate-y-1/2 border-2 border-secondary top-1/2"></div>
              <div className="w-full border-2 border-neutral-gray-2"></div>
            </div>
            <Swiper className="w-full" slidesPerView="auto" spaceBetween="8">
              {[`حداقل سن راننده: ${dataCars?.specifications?.minimumDriverAge}`, `تعداد سرنشین: ${dataCars?.specifications?.seatingCapacity}`, `چمدان: ${dataCars?.specifications?.luggageCapacity}`].map((e, index) => (
                <SwiperSlide className="min-h-8 !w-fit py-2 px-2 rounded-lg bg-neutral-gray-2/60 !flex items-center gap-x-1" key={index}>
                  <TickSquare className="size-5 fill-neutral-gray-9" variant="Outline" />
                  <span className="text-sm font-medium">{e}</span>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="w-full h-[503px] bg-white border border-neutral-gray-2 rounded-2xl">
            <BaseImage src={`${import.meta.env.VITE_API_CARS_IMAGE}${dataCars?.Image}`} alt={`${dataCars?.brand} ${dataCars?.model}`} />
          </div>

          <div className="w-full p-6 pb-3 space-y-3 bg-white border min-h-32 rounded-2xl border-neutral-gray-2">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-2xl font-bold text-neutral-gray-10">پوشش‌ها</h2>
            </div>
            <div className="relative overflow-hidden rounded-full">
              <div className="absolute right-0 w-10 -translate-y-1/2 border-2 border-secondary top-1/2"></div>
              <div className="w-full border-2 border-neutral-gray-2"></div>
            </div>
            <div className="w-full relative min-h-[calc(40px_*_6)] overflow-y-hidden md:min-h-fit overflow-x-auto">
              <div className="w-[700px] top-0 right-0 absolute md:relative md:w-full">
                {getRow("قیمت", (item) => (item.price ? item.price.toLocaleString() + " تومان" : "۰"))}
                {getRow("ودیعه", (item) => (item.deposit ? item.deposit.toLocaleString() + " تومان" : "۰"))}
                {getRow("حداکثر تعهد خسارت جزئی", (item) => item.partialDamageCommitment.toLocaleString() + " تومان")}
                {getRow("حداکثر تعهد خسارت کلی", (item) => item.totalDamageCommitment.toLocaleString() + " تومان")}
                {getRow("اخذ افت خودرو در زمان تصادف", (item) => item.depreciationInAccident)}
                {getRow("خواب خودرو", (item) => item.carResting)}
              </div>
            </div>
          </div>

          <div className="w-full p-6 pb-3 space-y-3 bg-white border min-h-32 rounded-2xl border-neutral-gray-2">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-2xl font-bold text-neutral-gray-10">مشخصات</h3>
            </div>
            <div className="relative overflow-hidden rounded-full">
              <div className="absolute right-0 w-10 -translate-y-1/2 border-2 border-secondary top-1/2"></div>
              <div className="w-full border-2 border-neutral-gray-2"></div>
            </div>
            <div className="flex flex-col flex-wrap justify-start w-full gap-5 sm:flex-row sm:items-center">
              {specifications.map((e, index) => (
                <div className="flex min-h-10 items-center gap-x-2.5" key={index}>
                  <div className="flex items-center justify-center w-8 h-8 border rounded-md border-neutral-gray-2">{e.icon}</div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-neutral-gray-10">{e.label}</p>
                    <p className="text-xs font-medium text-neutral-gray-7">{e.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full p-6 pb-3 space-y-3 bg-white border min-h-32 rounded-2xl border-neutral-gray-2">
            <div className="flex items-center justify-between w-full">
              <h4 className="text-2xl font-bold text-neutral-gray-10">امکانات</h4>
            </div>
            <div className="relative overflow-hidden rounded-full">
              <div className="absolute right-0 w-10 -translate-y-1/2 border-2 border-secondary top-1/2"></div>
              <div className="w-full border-2 border-neutral-gray-2"></div>
            </div>
            <div className="flex flex-col flex-wrap justify-start w-full gap-5 sm:flex-row sm:items-center">
              {dataCars?.features?.map((e, index) => (
                <div className="flex items-center gap-x-2.5" key={index}>
                  <div className="flex items-center justify-center w-8 h-8 border rounded-md border-neutral-gray-2">
                    <ArrowSwapVertical className="size-6 stroke-neutral-gray-8" />
                  </div>
                  <p>{e}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full p-6 pb-3 space-y-3 bg-white border min-h-32 rounded-2xl border-neutral-gray-2">
            <div className="flex items-center justify-between w-full">
              <h5 className="text-2xl font-bold text-neutral-gray-10">درباره خودرو</h5>
            </div>
            <div className="relative overflow-hidden rounded-full">
              <div className="absolute right-0 w-10 -translate-y-1/2 border-2 border-secondary top-1/2"></div>
              <div className="w-full border-2 border-neutral-gray-2"></div>
            </div>
            <strong className="text-neutral-gray-11">
              اجاره خودرو {dataCars?.brand} {dataCars?.model}
            </strong>
            <p className="text-sm text-neutral-gray-11 leading-relaxed mt-2.5">{dataCars?.about}</p>
          </div>

          <div className="w-full p-6 pb-3 space-y-3 bg-white border min-h-32 rounded-2xl border-neutral-gray-2">
            <div className="flex items-center justify-between w-full">
              <h6 className="text-2xl font-bold text-neutral-gray-10">نظرات</h6>
            </div>
            <div className="relative overflow-hidden rounded-full">
              <div className="absolute right-0 w-10 -translate-y-1/2 border-2 border-secondary top-1/2"></div>
              <div className="w-full border-2 border-neutral-gray-2"></div>
            </div>
            {commentsCars?.length > 0 ? (
              commentsCars?.map((e, index) => (
                <div className="flex flex-col w-full p-3 border gap-y-4 border-neutral-gray-2 rounded-xl" key={index}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-x-3">
                      <div className="w-10 h-10 overflow-hidden border rounded-xl border-neutral-gray-2">
                        <BaseImage src={`${import.meta.env.VITE_API_PROFILE_IMAGE}${e?.user?.avatar_url}`} alt={`${e?.user?.fName} ${e?.user?.lName}`} className="object-contain w-full h-full" />
                      </div>
                      <p className="w-fit">تاریخ: {new Date(e.publish_date).toLocaleDateString("fa-IR")}</p>
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="text-sm font-medium">{e?.rate}</span>
                      <Star1 color="#F4B740" size="20" variant="Bold" />
                    </div>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{e?.comment}</p>
                </div>
              ))
            ) : (
              <p>کامنتی وجود ندارد</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center w-full p-6 bg-white border xl:w-fit xl:flex-1 min-h-20 rounded-2xl gap-y-6 border-neutral-gray-2">
          <div className="flex flex-col sm:flex-row w-full items-center gap-2.5">
            {priceDetails.map((e, index) => (
              <div className="flex items-center justify-between flex-1 w-full h-12 p-2 rounded-lg sm:w-fit bg-neutral-gray-1" key={index}>
                <p className="text-neutral-gray-8">{e.title}</p>
                <p className="font-semibold text-primary">{e.value}</p>
              </div>
            ))}
          </div>

          {inputs.map((e, index) => (
            <div key={index} onClick={(e) => e.stopPropagation()} className="relative w-full">
              <div className="absolute z-10 -translate-y-1/2 top-1/2 right-2">{e.icon}</div>
              <label htmlFor={index} className={`pointer-events-none bg-white transition-all absolute px-2 ${index === focus || (index === 1 ? formatDateForDisplay(e.value) : e.value).length > 0 ? "-top-3 text-sm right-2 text-neutral-gray-10" : "top-1/2 -translate-y-1/2 right-7 text-neutral-gray-4"}`}>
                {e.Label}
              </label>
              <input ref={(el) => (inputRef.current[index] = el)} id={index} className={`h-12 inpBase w-full !pr-9 border transition-all ${index === focus || (index === 1 ? formatDateForDisplay(e.value) : e.value).length > 0 ? "border-neutral-gray-10" : "border-neutral-gray-4"}`} value={focus === index ? e.filterValue : index === 1 ? formatDateForDisplay(e.value) : e.value} onFocus={() => setFocus(index)} onChange={(ev) => (matches ? handleFilterChange(index, ev.target.value) : null)} readOnly={index === 1 ? true : !matches} aria-label={e.Label} />
              <div onClick={() => setFocus(focus === index ? null : index)} className="absolute left-0 flex items-center justify-center h-full px-2 -translate-y-1/2 rounded-l-lg cursor-pointer top-1/2">
                <ArrowDown2 className={`size-6 stroke-neutral-gray-4 customTransition ${focus === index ? "rotate-180" : "rotate-0"}`} />
              </div>
              {index === 1 ? (
                <PersianDatePicker label="تاریخ تحویل" value={e.value} onChange={(dateValue) => handleChange(index, dateValue)} isRange={true} isOpen={focus === index} onClose={() => setFocus(null)} />
              ) : (
                <AnimatePresence>
                  {focus === index && (
                    <motion.div className="w-full h-screen sm:h-fit z-[999] bg-white border border-neutral-gray-4 fixed top-0 sm:absolute sm:top-14 sm:rounded-xl overflow-y-auto left-0 sm:z-20" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.255, ease: [0.4, 0, 0.2, 1] }}>
                      {!matches && (
                        <div className="sticky top-0 left-0 flex flex-col w-full px-3 py-5 bg-white border-b border-neutral-gray-4">
                          <div className="flex items-center justify-between w-full">
                            {e.Label}
                            <div onClick={() => setFocus(null)} className="p-2 rounded-full hover:bg-neutral-gray-3">
                              <Add className="rotate-45 size-7 stroke-black" />
                            </div>
                          </div>
                          {index !== 1 && index !== 3 && <input type="text" placeholder="جستجو" className={`h-12 w-full border rounded-xl px-3 text-sm transition-colors border-neutral-gray-3 focus:border-primary`} value={e.filterValue} onChange={(ev) => handleFilterChange(index, ev.target.value)} />}
                        </div>
                      )}

                      {index === 0 && (
                        <div className="w-full h-full sm:max-h-80">
                          {(() => {
                            const filteredAirports = capitalAirports.filter((airport) => Array.isArray(dataCars?.deliveryAirportCode) && dataCars.deliveryAirportCode.includes(airport.code) && (airport.city.toLowerCase().includes(e.filterValue.toLowerCase()) || airport.airport.toLowerCase().includes(e.filterValue.toLowerCase()) || airport.code.toLowerCase().includes(e.filterValue.toLowerCase())));

                            if (filteredAirports.length === 0) {
                              return <div className="p-4 text-start text-neutral-gray-7">هیچ فرودگاهی با این نام یافت نشد.</div>;
                            }

                            return filteredAirports.map((airport, idx) => (
                              <button key={idx} onClick={() => handleChange(index, `${airport.city} - ${airport.airport}`)} className={`w-full text-right p-2 border-b border-neutral-gray-2 ${e.value === `${airport.city} - ${airport.airport}` ? "bg-primary" : "hover:bg-primary/10 group"} ${idx === filteredAirports.length - 1 && "mb-28 sm:mb-0"}`}>
                                <div className="flex justify-between">
                                  <div className="space-y-1">
                                    <p className={`${e.value === `${airport.city} - ${airport.airport}` ? "text-white" : "group-hover:text-primary"}`}>{airport.city}</p>
                                    <p className={`${e.value === `${airport.city} - ${airport.airport}` ? "text-white" : "group-hover:text-primary"}`}>{airport.airport}</p>
                                  </div>
                                  <p className={`${e.value === `${airport.city} - ${airport.airport}` ? "text-white" : "group-hover:text-primary"}`}>{airport.code}</p>
                                </div>
                              </button>
                            ));
                          })()}
                        </div>
                      )}

                      {index === 2 && (
                        <div className="w-full h-full sm:max-h-80">
                          {(() => {
                            const filteredTimes = times.filter((t) => t.includes(inputs[index].filterValue));

                            if (filteredTimes.length === 0) {
                              return <div className="p-4 text-start text-neutral-gray-7">هیچ ساعتی یافت نشد.</div>;
                            }

                            return filteredTimes.map((time, i) => (
                              <button onClick={() => handleChange(index, time)} key={i} className={`w-full text-right p-2 border-b border-neutral-gray-2 ${e.value === time ? "bg-primary" : "hover:bg-primary/10 group"} ${i === filteredTimes.length - 1 && "mb-28 sm:mb-0"}`}>
                                <span className={`${e.value === time ? "text-white" : "group-hover:text-primary"}`}>{time}</span>
                              </button>
                            ));
                          })()}
                        </div>
                      )}

                      {index === 3 && (
                        <div className="w-full h-full sm:max-h-80">
                          {(() => {
                            const dateRange = inputs[1]?.value;
                            const deliveryTime = inputs[2]?.value;

                            const filteredTimes = times.filter((t) => {
                              if (!isSameDay(dateRange)) return t.includes(inputs[index].filterValue);
                              if (!deliveryTime) return t.includes(inputs[index].filterValue);
                              return timeToMinutes(t) > timeToMinutes(deliveryTime) && t.includes(inputs[index].filterValue);
                            });

                            if (filteredTimes.length === 0) {
                              return <div className="p-4 text-center text-neutral-gray-7">هیچ ساعتی یافت نشد.</div>;
                            }

                            return filteredTimes.map((time, i) => (
                              <button onClick={() => handleChange(index, time)} key={i} className={`w-full text-right p-2 border-b border-neutral-gray-2 ${e.value === time ? "bg-primary" : "hover:bg-primary/10 group"} ${i === filteredTimes.length - 1 && "mb-28 sm:mb-0"}`}>
                                <span className={`${e.value === time ? "text-white" : "group-hover:text-primary"}`}>{time}</span>
                              </button>
                            ));
                          })()}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-neutral-gray-10">نوع بیمه:</p>
            <div className="flex items-center gap-x-6">
              {["بیمه پایه", "بیمه کامل"].map((e, index) => (
                <button className="text-sm text-neutral-gray-11 flex items-center gap-x-2.5" key={index} onClick={() => setInsuranceType(e)}>
                  <RadioBtn active={InsuranceType === e} />
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className={`w-full bg-neutral-gray-1 rounded-lg flex justify-between items-center px-2 customTransition overflow-hidden ${checkValue && focus === null ? "py-2" : ""}`} style={{ maxHeight: checkValue && focus === null ? "48px" : "0" }}>
            <p className="text-neutral-gray-8">{calculateDays()} روز:</p>
            <p className="font-semibold text-primary">{calculateTotalPrice().toLocaleString()}</p>
          </div>

          <button onClick={() => (checkValue && focus === null ? handlePayment() : null)} className={`btnBase w-full h-12 ${checkValue && focus === null ? "btn-fill-primary" : "btn-fill-disabled"}`} disabled={!(checkValue && focus === null)}>
            ثبت درخواست
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
