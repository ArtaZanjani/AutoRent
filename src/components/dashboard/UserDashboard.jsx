import Spinner from "@/components/ui/Spinner";
import React, { useEffect, useRef, useState } from "react";
import { validatePassword, validateCodeMeli, persianRegex } from "@/utils/function";
import { Edit2, CloseCircle, TickCircle } from "iconsax-react";
import isEmail from "validator/lib/isEmail";
import useMediaQuery from "@/hooks/useMediaQuery";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const UserDashboard = () => {
  const { token, loading, userInfo, setUserInfo } = useAuth();

  const isSm = useMediaQuery("(min-width: 640px)");

  const defaultValues = useRef([]);

  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    if (!userInfo) return;

    const values = [userInfo.fName || "", userInfo.lName || "", userInfo.nationalId || "", userInfo.email || "", "*********"];

    defaultValues.current = values;

    const fields = [
      { label: "نام", type: "text", index: 0 },
      { label: "نام خانوادگی", type: "text", index: 1 },
      { label: "کد ملی", type: "tel", index: 2 },
      { label: "ایمیل", type: "email", index: 3 },
      { label: "رمز عبور", type: "password", index: 4 },
    ];

    const initialInputs = fields.map(({ label, type, index }) => ({
      label,
      type,
      error: "",
      value: values[index],
    }));

    setInputs(initialInputs);
  }, [userInfo]);

  const [activeIndex, setActiveIndex] = useState(null);

  const handleChange = (index, newValue) => {
    setInputs((prev) => {
      const updated = [...prev];

      if (updated[index].type === "tel") {
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

  const updateAuth = async (field, value) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_AUTH_URL}user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [field]: value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "خطا در به‌روزرسانی اطلاعات");
        return;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      toast.error(error.message || "خطا در ارتباط با سرور");
    }
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
      ایمیل: "email",
      "رمز عبور": "password",
    };

    const key = keysMap[newInputs[index].label];
    if (!key) return;

    try {
      let updatedUserInfo = { ...userInfo, [key]: value };

      if (key === "email") {
        const authData = await updateAuth(key, value);

        const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}profiles?id=eq.${userInfo.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SERVICE_ROLE_KEY}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({ email: value }),
        });

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          toast.error(errorData.message || "خطا در به‌روزرسانی ایمیل در جدول پروفایل");
          return;
        }

        const profileData = await profileResponse.json();
        updatedUserInfo = { ...userInfo, email: authData.email || value };
        toast.success("ایمیل با موفقیت به‌روزرسانی شد. لطفاً ایمیل جدید را تأیید کنید.");
      } else if (key === "password") {
        const authData = await updateAuth(key, value);
        updatedUserInfo = { ...userInfo, [key]: authData[key] || value };
        toast.success("رمز عبور با موفقیت به‌روزرسانی شد.");
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}profiles?id=eq.${userInfo.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SERVICE_ROLE_KEY}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify(updatedUserInfo),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "خطا در به‌روزرسانی اطلاعات");
          return;
        }

        const data = await response.json();
        toast.success(`${data[0]?.fName} ${data[0]?.lName} عزیز اطلاعات با موفقیت به‌روزرسانی شد`);
      }

      setUserInfo(updatedUserInfo);
    } catch (error) {
      setInputs((prev) => {
        const reverted = [...prev];
        reverted[index].value = defaultValues.current[index];
        reverted[index].error = error.message;
        return reverted;
      });
      setActiveIndex(index);
      toast.error(`خطا در به‌روزرسانی ${newInputs[index].label}: ${error.message}`);
    }
  };

  return (
    <div className="w-full mt-8">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col w-full gap-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_auto] gap-6">
            {inputs?.map((e, index) => (
              <React.Fragment key={index}>
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute right-2 top-1.5 flex items-center gap-x-2.5">
                      <label htmlFor={index} className="text-neutral-gray-6 text-[13px]">
                        {e.label}
                      </label>

                      {e.value?.length > 0 ? <TickCircle className="size-6 stroke-success" /> : <CloseCircle className="size-6 stroke-error" />}
                    </div>

                    <input
                      onChange={(event) => handleChange(index, event.target.value)}
                      onKeyDown={(ev) => {
                        if (ev.ctrlKey || ev.metaKey) return;

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
