import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Location, Call, Sms } from "iconsax-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import isEmail from "validator/lib/isEmail";
import { useAuth } from "@/context/AuthContext";
import { formatPhoneNumber } from "@/utils/function";
import { toast } from "sonner";

const persianRegex = /^[\u0600-\u06FF\s]+$/;
const phoneRegex = /^09[0-9]{9}$/;
const persianWithNumbersRegex = /^[\u0600-\u06FF\s\d۰-۹]+$/;

const ContactUs = () => {
  const { userInfo } = useAuth();

  const isFilled = (input) => {
    return input.value;
  };

  const dataContact = [
    {
      icon: <Location className="size-6 stroke-neutral-gray-8" />,
      description: "تهران، میدان آزادی، خیابان آزادی، خیابان شادمان، پلاک 23",
    },
    {
      icon: <Call className="size-6 stroke-neutral-gray-8" />,
      description: "02166552589",
    },
    {
      icon: <Sms className="size-6 stroke-neutral-gray-8" />,
      description: "info@AutoRent.com",
    },
  ];

  const inputsArray = useMemo(
    () => [
      {
        label: "نام و نام خانوادگی",
        type: "text",
        value: userInfo ? `${userInfo?.fName} ${userInfo?.lName}` : "",
        error: "",
      },
      {
        label: "ایمیل",
        type: "email",
        value: userInfo?.email || "",
        error: "",
      },
      {
        label: "پیام",
        type: "textarea",
        value: "",
        error: "",
        maxLength: 20,
      },
    ],
    [userInfo]
  );

  const [inputs, setInputs] = useState(inputsArray);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleChange = (index, value) => {
    setInputs((prev) =>
      prev.map((input, i) => {
        if (i !== index) return input;

        let error = "";
        let newValue = value;

        if (input.label === "نام و نام خانوادگی") {
          if (value && !persianRegex.test(value)) {
            error = "فقط حروف پارسی مجاز است";
          }
          if (/\d/.test(value)) {
            error = "اعداد مجاز نیست";
          }
        } else if (input.label === "ایمیل") {
          if (value && persianRegex.test(value)) {
            error = "ایمیل نمی‌تواند حروف فارسی داشته باشد";
          } else if (value && !isEmail(value)) {
            error = "ایمیل معتبر نیست";
          }
        } else if (input.label === "پیام") {
          if (value && !persianWithNumbersRegex.test(value)) {
            error = "فقط حروف پارسی و عدد مجاز است";
          }
        }

        return { ...input, value: newValue, error };
      })
    );
  };

  useEffect(() => {
    setInputs(inputsArray);
  }, [inputsArray]);

  const checkValue = inputs.every((e) => e.value.length > 0);

  const SendData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}contact_us`, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userData: inputs[0].value.trim(),
          email: inputs[1].value.trim(),
          message: inputs[2].value.trim(),
        }),
      });

      if (!response.ok) {
        toast.error(response.status);
        return;
      }

      toast.success(`${inputs[0].value} عزیز پیام شما با موفقیت ارسال شد`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <main className="w-full min-h-screen">
      <Breadcrumbs title="تماس با ما" crumbs={[{ path: null, title: "تماس با ما" }]} />

      <div className="flex flex-col items-center w-full Padding gap-y-14">
        <section className="w-full min-h-[394px] bg-white shadow-2xl border border-neutral-gray-2 rounded-2xl p-8 space-y-7.5">
          <h2 className="text-2xl font-medium text-neutral-gray-9">ارتباط با دفتر مرکزی اتورنت</h2>

          <div className="flex flex-col items-start justify-between w-full gap-y-10 lg:flex-row">
            <div className="flex flex-col gap-y-8">
              {dataContact.map((item, index) => (
                <div className="flex items-center gap-x-2.5" key={index}>
                  <div>{item.icon}</div>
                  <p className="text-neutral-gray-8">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-[320px] !z-10 h-[320px] rounded-2xl overflow-hidden shadow-2xl">
              <MapContainer center={[35.7006, 51.337]} minZoom={10} maxZoom={18} zoom={13} scrollWheelZoom={true} zoomControl={false} className="w-full h-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' />
                <Marker position={[35.7006, 51.337]}>
                  <Popup>دفتر مرکزی اتورنت</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </section>

        <section className="w-full bg-white shadow-2xl border border-neutral-gray-2 rounded-2xl p-8 space-y-7.5">
          <h2 className="text-2xl font-medium text-neutral-gray-9">ارسال پیام شما به مجموعه اتورنت</h2>

          <div className="flex flex-col items-start justify-between w-full gap-10 xl:flex-row">
            <div className="flex flex-col justify-between gap-y-6 w-full  xl:w-fit xl:min-h-[227px]">
              {inputs.slice(0, 2).map((input, index) => {
                const filled = isFilled(input);

                return (
                  <div className="space-y-2 w-full xl:w-[533px]" key={index}>
                    <div className="relative">
                      <label htmlFor={index} className={`pointer-events-none right-2 bg-white z-10 transition-all absolute px-2 ${input.error ? "text-error" : filled ? "text-info-light-1" : index === activeIndex ? "text-neutral-gray-10" : "text-neutral-gray-4"} ${index === activeIndex || filled ? "-top-3 text-sm" : "top-1/2 -translate-y-1/2"}`}>
                        {input.label}
                      </label>

                      <input
                        type={input.type}
                        className={`inpBase h-12 w-full border ${input.error ? "border-error" : filled ? "border-info-light-1" : "border-neutral-gray-4"}`}
                        value={input.value}
                        onFocus={() => setActiveIndex(index)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(ev) => handleChange(index, ev.target.value)}
                        onKeyDown={(ev) => {
                          if (ev.ctrlKey || ev.metaKey) return;
                        }}
                      />
                    </div>

                    {input.error && input.value.length > 0 ? <p className="mt-1 mr-2 text-xs text-red-500">{input.error}</p> : ""}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col flex-1 w-full xl:w-fit">
              {inputs.slice(2).map((input, index) => (
                <div key={index} className="w-full">
                  <div className="relative">
                    <label htmlFor={`textarea-${index}`} className={`pointer-events-none right-2 bg-white z-10 transition-all absolute px-2 ${input.error ? "text-error" : input.value ? "text-info-light-1" : "text-neutral-gray-4"} ${input.value ? "-top-3 text-sm" : "top-3"}`}>
                      {input.label}
                    </label>
                    <textarea id={`textarea-${index}`} className={`w-full min-h-34 border inpBase pt-2 ${input.error ? "border-error" : input.value ? "border-info-light-1" : "border-neutral-gray-4"}`} value={input.value} onChange={(e) => handleChange(index + 2, e.target.value)} maxLength={input.maxLength} />
                  </div>

                  {input.error && input.value.length > 0 && <p className="mt-1 mr-2 text-xs text-red-500">{input.error}</p>}

                  <p className="mt-2 text-sm font-medium text-left text-neutral-gray-5">
                    {input.value.length}/{input.maxLength}
                  </p>
                </div>
              ))}

              <button onClick={() => (checkValue ? SendData() : null)} className={`w-full h-12 btnBase ${checkValue ? "btn-fill-primary" : "btn-fill-disabled"} mt-4`}>
                ارسال
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactUs;
