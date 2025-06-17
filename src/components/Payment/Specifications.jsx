import { Message, UserSquare, SecurityUser, Call, Sms } from "iconsax-react";
import Car from "@/assets/icons/Car.webp";
import BaseImage from "../common/BaseImage";
import { useContext, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import isEmail from "validator/lib/isEmail";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "@/context/SearchProvider";
import { formatPhoneNumber } from "@/utils/function";

const Specifications = () => {
  const { userInfo } = useAuth();
  const { setBookingData } = useContext(SearchContext);

  const [inputs, setInputs] = useState([
    { icon: UserSquare, enLabel: "firstName", label: "نام", type: "text", value: userInfo?.fName || "", error: "" },
    { icon: SecurityUser, enLabel: "lastName", label: "نام خانوادگی", type: "text", value: userInfo?.lName || "", error: "" },
    { icon: UserSquare, enLabel: "nationalId", label: "کد ملی", type: "tel", value: userInfo?.nationalId || "", error: "" },
    { icon: Call, enLabel: "phoneNumber", label: "شماره موبایل", type: "tel", value: formatPhoneNumber(userInfo?.phoneNumber) || "+98", error: "" },
    { icon: Sms, enLabel: "email", label: "ایمیل", type: "email", value: userInfo?.email || "", error: "" },
  ]);

  const [activeIndex, setActiveIndex] = useState(null);
  const matches = useMediaQuery("(min-width:1190px)");
  const persianRegex = /^[\u0600-\u06FF\s]+$/;
  const phoneRegex = /^09[0-9]{9}$/;
  const codeMeliRegex = /^\d{10}$/;
  const navigate = useNavigate();

  const validateCodeMeli = (value) => {
    if (!codeMeliRegex.test(value)) return false;
    const digits = value.split("").map(Number);
    const check = digits.pop();
    const sum = digits.reduce((acc, digit, i) => acc + digit * (10 - i), 0);
    const remainder = sum % 11;
    return remainder < 2 ? check === remainder : check === 11 - remainder;
  };

  const handleChange = (index, value) => {
    setInputs((prev) =>
      prev.map((input, i) => {
        if (i !== index) return input;

        let error = "";
        let newValue = value;

        if (input.label === "نام" || input.label === "نام خانوادگی") {
          if (!persianRegex.test(value) && value) {
            error = "فقط حروف پارسی مجاز است";
          }
        } else if (input.label === "شماره موبایل") {
          newValue = formatPhoneNumber(value);

          const normalized = "0" + newValue.replace(/\D/g, "").slice(-10);
          if (normalized.length === 1) {
            error = "";
          } else if (!phoneRegex.test(normalized)) {
            error = "شماره موبایل معتبر نیست";
          }
        } else if (input.label === "کد ملی") {
          newValue = value.replace(/\D/g, "");
          if (newValue.length > 10) newValue = newValue.slice(0, 10);
          if (newValue && !validateCodeMeli(newValue)) {
            error = "کدملی معتبر نیست";
          }
        } else if (input.label === "ایمیل") {
          if (value && !isEmail(value)) {
            error = "ایمیل معتبر نیست";
          }
        }

        return { ...input, value: newValue, error };
      })
    );
  };

  const isFilled = (input) => {
    if (input.label === "شماره موبایل") {
      return input.value && input.value !== "+98";
    }
    return input.value;
  };

  const checkValue = inputs.every((e) => e.value.length > 0 && !e.error);

  const handleNavigate = () => {
    const specs = inputs.reduce((acc, cur) => {
      let cleanValue = cur.value;

      if (cur.enLabel === "phoneNumber") {
        cleanValue = cleanValue.replace(/\s+/g, "");
      }
      if (cur.enLabel === "nationalId") {
        cleanValue = cleanValue.replace(/\D/g, "");
      }

      acc[cur.enLabel] = cleanValue;
      return acc;
    }, {});

    setBookingData((prev) => ({
      ...prev,
      specifications: {
        ...specs,
        userId: +userInfo?.id,
      },
    }));

    navigate("/payment/2");
  };

  return (
    <div className="mt-18.5">
      <div className="w-full bg-primary/10 rounded-lg min-h-14 flex items-center p-3 gap-x-4">
        <Message className="size-8 stroke-primary" />
        <p className="text-sm text-primary leading-relaxed flex-1">برای اعتبارسنجی قبل از تحویل خودرو، مستنداتی از شما درخواست می گردد، عدم ارائه این مستندات باعث لغو این رزرو خواهد شد.</p>
      </div>

      <div className="mt-14 w-full overflow-hidden rounded-lg border border-neutral-gray-1 bg-white shadow-2xl relative flex flex-col py-6">
        <p className="text-neutral-gray-8 pb-4 px-6 border-b border-neutral-gray-8 font-medium">مشخصات کاربر</p>
        {matches && <BaseImage src={Car} alt="Car" className="w-[596px] h-auto object-contain absolute bottom-0 left-0" />}

        <div className={`w-full gap-x-12 gap-y-6.5 px-6 mt-8 grid ${matches ? "pl-80 grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
          {inputs.map((e, index) => {
            const IconComponent = e.icon;
            const filled = isFilled(e);

            return (
              <div className="space-y-2" key={index}>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 right-2">
                    <IconComponent className={`size-6 transition-all ${e.error ? "stroke-error" : filled ? "stroke-info-light-1" : index === activeIndex ? "stroke-neutral-gray-10" : "stroke-neutral-gray-4"}`} />
                  </div>

                  <label htmlFor={index} className={`pointer-events-none bg-white z-10 transition-all absolute px-2 ${e.error ? "text-error" : filled ? "text-info-light-1" : index === activeIndex ? "text-neutral-gray-10" : "text-neutral-gray-4"} ${index === activeIndex || filled ? "-top-3 right-2 text-sm" : "right-8 top-1/2 -translate-y-1/2"}`}>
                    {e.label}
                  </label>

                  <input
                    type={e.type}
                    className={`inpBase h-12 ${matches ? "w-[528px]" : "w-full"} border ${e.error ? "border-error" : filled ? "border-info-light-1" : "border-neutral-gray-4"} !pr-10`}
                    value={e.value}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(null)}
                    onChange={(ev) => handleChange(index, ev.target.value)}
                    onKeyDown={(ev) => {
                      if (ev.ctrlKey || ev.metaKey) return;

                      if (e.label === "شماره موبایل") {
                        if ((ev.key === "Backspace" || ev.key === "Delete") && ev.target.selectionStart <= 3) {
                          ev.preventDefault();
                        }
                        if (!/[0-9]/.test(ev.key) && !["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(ev.key)) {
                          ev.preventDefault();
                        }
                      }

                      if (e.label === "کد ملی") {
                        if (!/[0-9]/.test(ev.key) && !["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(ev.key)) {
                          ev.preventDefault();
                        }
                      }
                    }}
                  />
                </div>

                {e.error && <p className="text-red-500 text-xs mt-1 mr-2">{e.error}</p>}
              </div>
            );
          })}

          <button onClick={() => (checkValue ? handleNavigate() : null)} className={`btnBase ${checkValue ? "btn-fill-primary" : "btn-fill-disabled"} h-12 ${matches ? "w-[528px]" : "w-full"}`} disabled={!checkValue}>
            ادامه رزرو
          </button>
        </div>
      </div>
    </div>
  );
};

export default Specifications;
