import { Link, useLocation } from "react-router-dom";
import { SearchNormal1, UserOctagon, ArrowDown2, LogoutCurve, User, Car } from "iconsax-react";
import useMediaQuery from "@/hooks/useMediaQuery";
import BaseImage from "@/components/common/BaseImage";
import { navHeader } from "@/utils/utils";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAlertDialog } from "@/context/AlertDialogProvider";
import Logo from "@/assets/icons/Logo.webp";

const Header = ({ onMenuClick, onSearchBarClick, setAuthOpen }) => {
  const location = useLocation();
  const matches = useMediaQuery("(min-width:1000px)");
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const { isLoggedIn, userInfo, logout } = useAuth();
  const { openDialog } = useAlertDialog();

  useEffect(() => {
    setOpenUserInfo(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClose = () => {
      setOpenUserInfo(false);
    };

    document.addEventListener("click", handleClose);

    return () => {
      document.removeEventListener("click", handleClose);
    };
  });

  const handleClick = () => {
    setOpenUserInfo(false);
    openDialog({
      title: "حذف کاربر",
      description: "آیا مطمئن هستید که می‌خواهید کاربر را حذف کنید؟",
      confirmText: "تایید",
      cancelText: "انصراف",
      onConfirm: () => {
        logout();
      },
      onCancel: () => {
        null;
      },
    });
  };

  const menuItems = [
    {
      to: "/dashboard/user",
      icon: <User className="size-6 fill-primary" variant="Outline" />,
      label: `${userInfo?.fName} ${userInfo?.lName}`,
      bgColor: "bg-primary/20",
      isButton: false,
    },
    {
      to: "/dashboard/my-reservations",
      icon: <Car className="size-6 fill-primary" variant="Outline" />,
      label: "سفارشات",
      bgColor: "bg-primary/20",
      isButton: false,
    },
    {
      onClick: handleClick,
      icon: <LogoutCurve className="size-6 fill-error -translate-x-0.5" variant="Outline" />,
      label: "خروج",
      bgColor: "bg-error/20",
      isButton: true,
      labelClass: "text-error",
    },
  ];

  if (location.pathname === "/fetcherror") {
    return null;
  }
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="h-24 rounded-b-2xl flex justify-between items-center px-4 xl:px-8 mx-auto">
          <Link to="/" className={`${!matches && "order-2"}`} aria-label="بازگشت به صفحه اصلی">
            <BaseImage src={Logo} alt="لوگوی رزرو خودرو" className="object-contain w-28 sm:w-32 2xl:w-auto h-[59px]" lazyLoad={false} />
          </Link>

          {matches ? (
            <>
              <nav className="flex items-center gap-x-10" aria-label="منوی اصلی">
                {navHeader.map((e, index) => (
                  <Link key={index} to={e.path} className={`text-neutral-gray-10 font-medium relative transition-all ${location.pathname === e.path ? "text-primary" : "hover:text-primary group"}`}>
                    {e.title}
                    <div className={`w-0 h-0.5 bg-primary absolute -bottom-2 left-0 ${location.pathname === e.path ? "w-full right-0" : "group-hover:w-full group-hover:right-0 right-auto"} transition-all`} />
                  </Link>
                ))}
                <button onClick={onSearchBarClick} className="group" aria-label="جستجو">
                  <SearchNormal1 className="size-6 stroke-neutral-gray-10 group-hover:stroke-primary transition-all" />
                </button>
              </nav>
              {isLoggedIn ? (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setOpenUserInfo((prev) => !prev)} className="group bg-primary/20 py-2 px-3 rounded-full flex items-center gap-x-2">
                    <UserOctagon className="size-6 fill-primary" variant="Bold" />
                    <ArrowDown2 className={`size-6 stroke-primary customTransition ${openUserInfo ? "rotate-180" : "rotate-0"}`} />
                  </button>
                  <AnimatePresence>
                    {openUserInfo && (
                      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.225, ease: [0.4, 0, 0.2, 1] }} className="absolute overflow-hidden top-18 left-0 w-[182px] bg-white shadow-2xl border border-neutral-gray-2 rounded-2xl flex flex-col">
                        {menuItems.map(({ to, onClick, icon, label, bgColor, isButton, labelClass }, index) => {
                          const content = (
                            <>
                              <div className={`p-1.5 rounded-xl ${bgColor} flex justify-center items-center`}>{icon}</div>
                              <p className={`${labelClass || ""}`}>{label}</p>
                            </>
                          );

                          if (isButton) {
                            return (
                              <button key={index} onClick={onClick} className="flex items-center gap-x-2 hover:bg-error/20 p-2">
                                {content}
                              </button>
                            );
                          } else {
                            return (
                              <Link key={index} to={to} className="flex items-center gap-x-2 hover:bg-primary/20 p-2">
                                {content}
                              </Link>
                            );
                          }
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button onClick={setAuthOpen} className="btnBase h-10 btn-fill-primary" aria-label="ورود / ثبت‌نام">
                  ورود / ثبت‌نام
                </button>
              )}
            </>
          ) : (
            <>
              <button className="group order-1" aria-label="باز کردن منو" onClick={() => onMenuClick(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960" fill="currentColor" className="size-7 fill-neutral-gray-10 group-hover:fill-primary transition-all">
                  <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                </svg>
              </button>
              <button onClick={onSearchBarClick} className="group order-3" aria-label="جستجو">
                <SearchNormal1 className="size-7 stroke-neutral-gray-10 group-hover:stroke-primary transition-all" />
              </button>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
