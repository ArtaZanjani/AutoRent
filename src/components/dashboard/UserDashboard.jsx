import Spinner from "@/components/ui/Spinner";
import React, { useRef, useState } from "react";
import { formatPhoneNumber, validatePassword, phoneRegex, validateCodeMeli, persianRegex } from "@/utils/function";
import { Edit2, CloseCircle, TickCircle } from "iconsax-react";
import isEmail from "validator/lib/isEmail";
import useMediaQuery from "@/hooks/useMediaQuery";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const UserDashboard = () => {
  const { loading, userInfo, setUserInfo } = useAuth();
  const defaultValues = useRef([userInfo?.fName || "", userInfo?.lName || "", userInfo?.nationalId || "", formatPhoneNumber(userInfo?.phoneNumber) || "", userInfo?.email || "", "*********"]);
  const isSm = useMediaQuery("(min-width: 640px)");

  const [inputs, setInputs] = useState([
    { label: "نام", value: defaultValues.current[0], error: "", type: "text" },
    { label: "نام خانوادگی", value: defaultValues.current[1], error: "", type: "text" },
    { label: "کد ملی", value: defaultValues.current[2], error: "", type: "tel" },
    { label: "شماره موبایل", value: defaultValues.current[3], error: "", type: "tel" },
    { label: "ایمیل", value: defaultValues.current[4], error: "", type: "email" },
    { label: "رمز عبور", value: defaultValues.current[5], error: "", type: "password" },
  ]);

  const [activeIndex, setActiveIndex] = useState(null);

  const handleChange = (index, newValue) => {
    setInputs((prev) => {
      const updated = [...prev];

      if (updated[index].label === "شماره موبایل") {
        const onlyNumbers = newValue.replace(/\D/g, "");
        updated[index] = { ...updated[index], value: formatPhoneNumber(onlyNumbers) };
      } else if (updated[index].type === "tel") {
        const onlyNumbers = newValue.replace(/\D/g, "");
        updated[index] = { ...updated[index], value: onlyNumbers };
      } else {
        updated[index] = { ...updated[index], value: newValue };
      }

      return updated;
    });
  };

  const toggleActiveIndex = (index) => {
    setInputs((prev) => {
      const updated = prev.map((input, i) => ({
        ...input,
        error: "",
        value: i === index ? (activeIndex === index ? defaultValues.current[i] : "") : input.value,
      }));
      return updated;
    });

    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSave = async (index) => {
    const newInputs = [...inputs];
    let value = newInputs[index].value.trim();
    let error = "";

    if (newInputs[index].label === "نام") {
      if (!persianRegex.test(value)) {
        error = "نام باید فقط حروف فارسی باشد.";
      } else if (/\d/.test(value)) {
        error = "نام نمی‌تواند شامل عدد باشد.";
      }
    } else if (newInputs[index].label === "نام خانوادگی") {
      if (!persianRegex.test(value)) {
        error = "نام خانوادگی باید فقط حروف فارسی باشد.";
      } else if (/\d/.test(value)) {
        error = "نام خانوادگی نمی‌تواند شامل عدد باشد.";
      }
    } else if (newInputs[index].label === "کد ملی") {
      if (!validateCodeMeli(value)) {
        error = "کد ملی نامعتبر است.";
      }
    } else if (newInputs[index].label === "شماره موبایل") {
      value = formatPhoneNumber(value);

      const digits = value.replace(/\D/g, "").slice(-10);
      const normalized = "0" + digits;

      if (digits.length === 0) {
        error = "";
      } else if (!phoneRegex.test(normalized)) {
        error = "شماره موبایل معتبر نیست";
      } else {
        error = "";
      }
    } else if (newInputs[index].label === "ایمیل") {
      if (!isEmail(value)) {
        error = "ایمیل نامعتبر است.";
      } else if (persianRegex.test(value)) {
        error = "ایمیل نمی‌تواند شامل حروف فارسی باشد.";
      }
    } else if (newInputs[index].label === "رمز عبور") {
      const passwordErrors = validatePassword(value);
      if (passwordErrors.length > 0) {
        error = "رمز عبور باید شامل موارد زیر باشد: " + passwordErrors.join(", ");
      }
    }

    if (error) {
      newInputs[index].error = error;
      setInputs(newInputs);
      return;
    } else {
      newInputs[index].error = "";
      defaultValues.current[index] = value;
      newInputs[index].value = value;
      setInputs(newInputs);
      setActiveIndex(null);
    }

    const keysMap = {
      نام: "fName",
      "نام خانوادگی": "lName",
      "کد ملی": "nationalId",
      "شماره موبایل": "phoneNumber",
      ایمیل: "email",
      "رمز عبور": "password",
    };

    const key = keysMap[newInputs[index].label];
    if (!key) return;

    if (key === "phoneNumber") {
      value = value.replace(/\s/g, "");
    }

    const body = {};
    body[key] = value;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userInfo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        toast.error("خطا در به‌روزرسانی اطلاعات");
        return;
      }

      const data = await response.json();

      toast.success(`${data?.fName} ${data?.lName} عزیز اطلاعات با موفقیت به‌روزرسانی شد`);

      const updatedUserInfo = { ...userInfo, [key]: value };
      setUserInfo(updatedUserInfo);
    } catch (error) {
      toast.error("خطا در ارتباط با سرور:", error);
    }
  };

  return (
    <div className="w-full mt-8">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col w-full gap-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_auto] gap-6">
            {inputs.map((e, index) => (
              <React.Fragment key={index}>
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute right-2 top-1.5 flex items-center gap-x-2.5">
                      <label htmlFor={index} className="text-neutral-gray-6 text-[13px]">
                        {e.label}
                      </label>

                      {e.value.length > 0 ? <TickCircle className="size-6 stroke-success" /> : <CloseCircle className="size-6 stroke-error" />}
                    </div>

                    <input
                      onChange={(event) => handleChange(index, event.target.value)}
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
                      readOnly={activeIndex !== index}
                      dir={e.type === "tel" ? "ltr" : ""}
                      id={index}
                      value={e.value}
                      type="text"
                      minLength={e.label === "کد ملی" ? 10 : null}
                      maxLength={e.label === "کد ملی" ? 10 : null}
                      className={`w-full font-medium text-neutral-gray-10 text-right px-2 h-17 pt-8 inpBase ${activeIndex === index ? "border-neutral-gray-2" : "border-transparent"}`}
                    />

                    <div className="absolute flex -translate-y-1/2 top-1/2 left-2 gap-x-2" aria-label={activeIndex === index ? "Cancel" : "Edit"}>
                      {activeIndex === index ? (
                        <>
                          {e.value.trim() !== "" && (
                            <button onClick={() => handleSave(index)}>
                              <TickCircle className="size-7 stroke-success" />
                            </button>
                          )}

                          <button onClick={() => toggleActiveIndex(index)}>
                            <CloseCircle className="size-7 stroke-neutral-gray-4" />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => toggleActiveIndex(index)}>
                          <Edit2 className="size-7 stroke-neutral-gray-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {e.error.length > 0 && <p className="text-sm font-medium text-error">{e.error}</p>}
                </div>

                {isSm ? (index + 1) % 2 === 0 && index !== inputs.length - 1 && <hr className="border sm:col-span-2 border-neutral-gray-2" /> : index !== inputs.length - 1 && <hr className="border border-neutral-gray-2" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
