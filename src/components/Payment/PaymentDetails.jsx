import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SearchContext } from "@/context/SearchProvider";
import DataShow from "./DataShow";

const PaymentDetails = () => {
  const { BookingData } = useContext(SearchContext);
  const navigate = useNavigate();

  const start = BookingData?.Date?.[0];
  const end = BookingData?.Date?.[1];

  let dayDiff = "نامشخص";
  if (start && end) {
    const startDate = new Date(start.jy, start.jm - 1, start.jd);
    const endDate = new Date(end.jy, end.jm - 1, end.jd);
    const diffTime = endDate - startDate;
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    dayDiff = days >= 0 ? days + 1 : "نامشخص";
  }

  const price = BookingData?.carInfo?.price || 0;
  const deposit = BookingData?.carInfo?.securityDeposit || 0;
  const tax = Math.round(price * 0.2);
  const pickupDelivery = 585000;
  const totalCost = price + pickupDelivery * 2 + tax + deposit;

  const priceData = [
    { label: `هزینه ${dayDiff} روز`, value: price.toLocaleString() },
    { label: "تحویل در محل مبدا", value: pickupDelivery.toLocaleString() },
    { label: "تحویل در محل بازگشت", value: pickupDelivery.toLocaleString() },
    { label: "مالیات", value: tax.toLocaleString() },
    { label: "ودیعه", value: deposit.toLocaleString() },
    { label: "مجموع هزینه", value: totalCost.toLocaleString() },
  ];

  const changeInventoryMutation = useMutation({
    mutationFn: async (carId) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}cars?id=eq.${carId}`, {
        method: "PATCH",
        headers: { apikey: import.meta.env.VITE_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ inventory: false }),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی موجودی");
    },
  });

  const orderMutation = useMutation({
    mutationFn: async () => {
      const dataSend = {
        AirportCode: BookingData?.AirportCode,
        Date: {
          startDate: `${BookingData?.Date[0]?.jy}-${BookingData?.Date[0]?.jm}-${BookingData?.Date[0]?.jd}`,
          endDate: `${BookingData?.Date[1]?.jy}-${BookingData?.Date[1]?.jm}-${BookingData?.Date[1]?.jd}`,
          startTime: BookingData?.time[0],
          endTime: BookingData?.time[1],
        },
        carInfo: {
          carId: +BookingData?.carInfo?.id,
          carName: BookingData?.carInfo?.carName,
          carImage: BookingData?.carInfo?.carImage,
        },
        insuranceType: BookingData?.insuranceOptions?.type,
        specifications: BookingData?.specifications,
        status: "جاری",
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}orders`, {
        method: "POST",
        headers: { apikey: import.meta.env.VITE_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(dataSend),
      });

      if (!res.ok) {
        throw new Error("ثبت سفارش ناموفق بود");
      }

      return BookingData?.carInfo?.id;
    },
    onSuccess: (carId) => {
      changeInventoryMutation.mutate(+carId);
      navigate("/payment/4");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="w-full mt-10 space-y-10">
      <div className="w-full p-6 space-y-3 bg-white border shadow-2xl border-neutral-gray-2 rounded-xl">
        <div className="flex flex-col gap-y-4">
          <p className="text-xl font-semibold text-neutral-gray-11 sm:text-2xl">اطلاعات رزرو</p>
          <div className="relative w-full overflow-hidden rounded-full">
            <div className="w-full border-2 border-neutral-gray-2"></div>
            <div className="absolute top-0 right-0 w-10 border-2 border-secondary"></div>
          </div>
        </div>
        <DataShow />
      </div>

      <div className="w-full pt-6 space-y-3 bg-white border shadow-2xl border-neutral-gray-2 rounded-xl">
        <div className="flex flex-col px-4 gap-y-4">
          <p className="text-xl font-semibold text-neutral-gray-11 sm:text-2xl">محاسبه قیمت</p>
          <div className="relative w-full overflow-hidden rounded-full">
            <div className="w-full border-2 border-neutral-gray-2"></div>
            <div className="absolute top-0 right-0 w-10 border-2 border-secondary"></div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          {priceData.map((e, index) => (
            <div key={index} className={`w-full flex justify-between px-3 items-center h-12 ${index === 0 || index === 2 || index === 4 ? "bg-neutral-gray-10" : ""}`}>
              <p className={`${index === 0 || index === 2 || index === 4 ? "text-white" : "text-neutral-gray-10"}`}>{e.label}</p>
              <p className={`${index === 0 || index === 2 || index === 4 ? "text-white" : "text-neutral-gray-10"}`}>{e.value}</p>
            </div>
          ))}
        </div>

        <div className="w-full p-2">
          <button onClick={() => orderMutation.mutate()} disabled={orderMutation.isLoading} className="w-full h-12 btnBase btn-fill-primary">
            {orderMutation.isLoading ? "در حال ارسال..." : "پرداخت"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
