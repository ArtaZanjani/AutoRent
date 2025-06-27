import { useState, useEffect } from "react";
import BaseBg from "@/components/common/BaseBg";
import { motion } from "motion/react";
import isEmail from "validator/lib/isEmail";
import BaseImage from "@/components/common/BaseImage";
import CheckBox from "@/components/common/CheckBox";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Add, UserSquare, SecurityUser, Sms, Eye, EyeSlash } from "iconsax-react";
import { validatePassword, validateCodeMeli, persianRegex } from "@/utils/function";
import Logo from "@/assets/icons/Logo.webp";

const baseInputs = [
  { id: "email", icon: Sms, label: "ایمیل", value: "", error: "", type: "email" },
  { id: "password", icon: null, label: "رمز عبور", value: "", error: "", type: "password" },
];

const Auth = ({ isAuthOpen, onClose }) => {
  const [inputs, setInputs] = useState(baseInputs);
  const [activeIndex, setActiveIndex] = useState(null);
  const [authType, setAuthType] = useState("ورود");
  const [acceptRules, setAcceptRules] = useState(false);
  const location = useLocation();
  const { isLoggedIn, setUserToken } = useAuth();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setInputs(
      authType === "ثبت نام"
        ? [
            { icon: UserSquare, id: "fname", label: "نام", value: "", error: "", type: "text" },
            { icon: SecurityUser, id: "lname", label: "نام خانوادگی", value: "", error: "", type: "text" },
            { icon: UserSquare, id: "nationalId", label: "کد ملی", value: "", error: "", type: "tel" },
            { icon: Sms, id: "email", label: "ایمیل", value: "", error: "", type: "email" },
            { icon: null, id: "password", label: "رمز عبور", value: "", error: "", type: "password" },
            { icon: null, id: "confirmPassword", label: "تکرار رمز عبور", value: "", error: "", type: "password" },
          ]
        : baseInputs
    );
  }, [authType]);

  const handleChange = (id, value) => {
    setInputs((prev) =>
      prev.map((input) => {
        if (input.id === id) {
          let error = "";
          let isValid = false;

          if (input.type === "email") {
            if (persianRegex.test(value)) {
              error = "ایمیل نمی‌تواند شامل حروف فارسی باشد";
              isValid = false;
            } else {
              isValid = isEmail(value);
              if (value && !isValid) error = "ایمیل معتبر نیست";
            }
          }

          if (input.type === "password" && id !== "confirmPassword") {
            const errors = validatePassword(value);
            isValid = errors.length === 0;
            if (!isValid) error = "رمز عبور باید شامل: " + errors.join("، ");
          }

          if (id === "confirmPassword") {
            const password = prev.find((i) => i.id === "password")?.value || "";
            isValid = value === password;
            if (!isValid) error = "تکرار رمز عبور یکسان نیست";
          }

          if (id === "fname" || id === "lname") {
            if (/\d/.test(value)) {
              error = "عدد مجاز نیست";
              isValid = false;
            } else {
              isValid = persianRegex.test(value.trim());
              if (value && !isValid) error = "فقط حروف فارسی مجاز است";
            }
          }

          if (id === "nationalId") {
            value = value.replace(/\D/g, "");
            if (value.length > 10) value = value.slice(0, 10);

            if (value.length === 0) {
              error = "";
              isValid = false;
            } else if (!validateCodeMeli(value)) {
              error = "کدملی معتبر نیست";
              isValid = false;
            } else {
              isValid = true;
            }
          }

          return { ...input, value, error, isValid };
        }
        return input;
      })
    );
  };

  const isValid = inputs.every((e) => e.value.length > 0 && !e.error && e.isValid) && acceptRules;

  const handleLogin = async () => {
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_AUTH_URL}token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error_description || "خطا در ورود");
        return;
      }

      setUserToken(data.access_token);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("خطای اتصال به سرور");
    }
  };

  const handleRegister = async () => {
    const dataLogin = {
      fName: inputs[0].value.trim(),
      lName: inputs[1].value.trim(),
      nationalId: inputs[2].value.trim(),
      email: inputs[3].value.trim(),
      password: inputs[4].value.trim(),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_AUTH_URL}signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          email: dataLogin.email,
          password: dataLogin.password,

          data: {
            fName: dataLogin.fName,
            lName: dataLogin.lName,
            nationalId: dataLogin.nationalId,
            email: dataLogin.email,
          },
        }),
      });

      if (!response.ok) {
        toast.error(response.status);
        return;
      }

      const authData = await response.json();

      const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          id: authData.user.id,
          fName: dataLogin.fName,
          lName: dataLogin.lName,
          nationalId: dataLogin.nationalId,
          email: dataLogin.email,
        }),
      });

      if (!profileResponse.ok) {
        toast.error("خطا در ایجاد پروفایل");
        return;
      }

      toast.success("حساب و پروفایل با موفقیت ساخته شد");
      setUserToken(authData.access_token);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    if (isAuthOpen && isLoggedIn) {
      onClose();
    }

    setInputs(baseInputs);
    setAuthType("ورود");
    setAcceptRules(false);
    setIsHidden(false);
  }, [isAuthOpen, isLoggedIn, onClose]);

  return (
    <BaseBg isOpen={isAuthOpen} onClose={onClose}>
      <motion.div onClick={(e) => e.stopPropagation()} className="w-full overflow-y-auto h-full sm:w-[608px] sm:h-fit sm:min-h-fit flex flex-col items-center p-4 sm:p-8 bg-white sm:rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ duration: 0.225, ease: [0.4, 0, 0.2, 1] }}>
        <button onClick={onClose} className="w-8.5 h-8.5 xs:w-10 xs:h-10 bg-neutral-gray-2 hover:bg-neutral-gray-3 rounded-full absolute top-3 left-3 xs:top-5 xs:left-5 flex justify-center items-center">
          <Add className="rotate-45 size-full stroke-neutral-gray-9" />
        </button>

        <BaseImage src={Logo} alt="Logo" className="object-contain h-auto w-38" />
        <p className="mt-2 text-xl text-neutral-gray-9">{authType}</p>
        <div className="w-full space-y-7 sm:space-y-5 mt-7">
          {inputs.map((e) => (
            <div className="space-y-3" key={e.id}>
              <div className="relative">
                <label htmlFor={e.id} className={`pointer-events-none bg-white transition-all absolute px-2 ${e.id === activeIndex || e.value.length > 0 ? "-top-3 text-sm right-2" : "top-1/2 -translate-y-1/2 right-8"} ${e.error && e.value.length > 0 ? "text-error" : e.isValid ? "text-info-light-1" : e.id === activeIndex ? "text-neutral-gray-10" : "text-neutral-gray-4"}`}>
                  {e.label}
                </label>
                <input
                  id={e.id}
                  type={e.type === "password" ? (isHidden ? "password" : "text") : e.type}
                  className={`h-12 inpBase w-full !pr-9 border transition-all ${e.error && e.value.length > 0 ? "border-error" : e.isValid ? "border-info-light-1" : e.id === activeIndex ? "border-neutral-gray-10" : "border-neutral-gray-4"}`}
                  value={e.value}
                  onFocus={() => setActiveIndex(e.id)}
                  onBlur={() => setActiveIndex(null)}
                  onChange={(ev) => handleChange(e.id, ev.target.value)}
                  aria-label={e.label}
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

                <div onClick={() => (!e.icon ? setIsHidden((prev) => !prev) : null)} className={`absolute z-10 top-1/2 -translate-y-1/2 right-0 px-2 rounded-r-lg flex justify-center items-center h-full ${!e.icon && "cursor-pointer"}`}>
                  {e.icon ? <e.icon className={`size-6 transition-all ${e.error && e.value.length > 0 ? "stroke-error" : e.isValid ? "stroke-info-light-1" : e.id === activeIndex ? "stroke-neutral-gray-10" : "stroke-neutral-gray-4"}`} /> : isHidden ? <Eye className={`size-6 transition-all ${e.error && e.value.length > 0 ? "stroke-error" : e.isValid ? "stroke-info-light-1" : e.id === activeIndex ? "stroke-neutral-gray-10" : "stroke-neutral-gray-4"}`} /> : <EyeSlash className={`size-6 transition-all ${e.error && e.value.length > 0 ? "stroke-error" : e.isValid ? "stroke-info-light-1" : e.id === activeIndex ? "stroke-neutral-gray-10" : "stroke-neutral-gray-4"}`} />}
                </div>
              </div>

              {e.error && e.value.length > 0 && <p className="pr-1 mt-1 text-sm text-red-500">{e.error}</p>}
            </div>
          ))}
        </div>

        <button className="mt-5 ml-auto text-sm btn-none-primary" onClick={() => setAuthType(authType === "ورود" ? "ثبت نام" : "ورود")}>
          {authType === "ورود" ? "حساب ندارید؟ ثبت نام" : "ورود به حساب"}
        </button>

        <div className="flex items-center mt-5 ml-auto gap-x-2">
          <CheckBox active={acceptRules} handleChange={() => setAcceptRules((prev) => !prev)} />
          <div className="flex-1 text-xs font-medium xs:text-sm xs:font-normal">
            با ورود و ثبت‌نام در سایت، با{" "}
            <Link to="/rules" className="text-xs font-medium btn-none-primary xs:text-sm xs:font-normal">
              قوانین اتورنت
            </Link>{" "}
            موافقت می‌کنم.
          </div>
        </div>

        <div className="w-full h-12 mt-2">
          <button className={`btnBase h-12 btn-fill-primary w-full transition-all ${!isValid && "btn-fill-disabled"}`} disabled={!isValid} onClick={() => (isValid ? (authType === "ورود" ? handleLogin() : handleRegister()) : null)}>
            {authType}
          </button>
        </div>
      </motion.div>
    </BaseBg>
  );
};

export default Auth;
