import Breadcrumbs from "@/components/common/Breadcrumbs";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { SearchContext } from "@/context/SearchProvider";
import { Personalcard, DocumentText1, Card, Car } from "iconsax-react";
import Specifications from "@/components/Payment/Specifications";
import Rules from "@/components/Payment/Rules";
import PaymentDetails from "@/components/Payment/PaymentDetails";
import Delivery from "@/components/Payment/Delivery";

const Payment = () => {
  const { step } = useParams();
  const { BookingData } = useContext(SearchContext);
  const stepNumber = parseInt(step, 5);
  const location = useLocation();

  const allStep = [
    {
      Label: "انتخاب خودرو",
      icon: null,
      children: null,
    },
    {
      Label: "مشخصات",
      icon: Personalcard,
      children: <Specifications />,
    },
    {
      Label: "تائید اطلاعات",
      icon: DocumentText1,
      children: <Rules />,
    },
    {
      Label: "پرداخت",
      icon: Card,
      children: <PaymentDetails />,
    },
    {
      Label: "تحویل خودرو",
      icon: Car,
      children: <Delivery />,
    },
  ];

  const missingSpecs = !BookingData?.specifications?.email || !BookingData?.specifications?.firstName || !BookingData?.specifications?.lastName || !BookingData?.specifications?.nationalId || !BookingData?.specifications?.phoneNumber || !BookingData?.specifications?.userId;
  const pathsNeedSpecs = ["/payment/2", "/payment/3", "/payment/4"];
  if (!BookingData || !BookingData?.AirportCode || BookingData?.Date.length !== 2 || BookingData?.time.length !== 2 || !BookingData.carInfo?.carName || !BookingData.carInfo?.id || !BookingData.carInfo?.price || !BookingData.carInfo?.securityDeposit || !BookingData.insuranceOptions) {
    return <Navigate to="/product-list" />;
  }

  if (missingSpecs && pathsNeedSpecs.includes(location.pathname)) {
    return <Navigate to="/payment/1" />;
  }

  return (
    <div className="w-full min-h-screen">
      <Breadcrumbs
        title="جزئیات محصول"
        crumbs={[
          { path: `/product-detail/`, title: "جزئیات محصول" },
          { path: null, title: "ثبت درخواست رزرو" },
        ]}
      />

      <div className="w-full Padding">
        <div className="w-full flex items-center gap-x-3">
          {allStep.map((e, index) => {
            const Icon = e.icon;
            return (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center gap-y-2">
                  <div className={`w-13 h-13 rounded-full flex justify-center items-center p-1 ${stepNumber > index ? "bg-primary" : stepNumber === index ? "bg-secondary" : "bg-neutral-gray-1 border border-neutral-gray-4"}`}>
                    {stepNumber > index ? (
                      <div className="w-full h-full bg-primary border-2 border-white rounded-full flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2 fill-white size-7 translate-y-px" viewBox="0 0 16 16">
                          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                        </svg>
                      </div>
                    ) : (
                      <Icon className={`size-8 ${stepNumber === index ? "stroke-black" : "stroke-neutral-gray-6"}`} />
                    )}
                  </div>

                  <p className="w-fit text-neutral-gray-7">{e.Label}</p>
                </div>

                {index !== allStep.length - 1 && <hr className="border border-neutral-gray-4 flex-1 -translate-y-3.5" />}
              </React.Fragment>
            );
          })}
        </div>

        {allStep[stepNumber]?.children}
      </div>
    </div>
  );
};

export default Payment;
