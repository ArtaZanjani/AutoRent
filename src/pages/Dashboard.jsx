import { useAuth } from "@/context/AuthContext";
import { Edit, User, Reserve, MessageText, LogoutCurve, ArrowLeft2 } from "iconsax-react";
import { formatPhoneNumber } from "@/utils/function";
import { Link, useLocation, Navigate } from "react-router-dom";
import React from "react";
import { useAlertDialog } from "@/context/AlertDialogProvider";
import useFetch from "@/hooks/useFetch";
import MyReservations from "@/components/dashboard/MyReservations";
import UserDashboard from "@/components/dashboard/UserDashboard";

const Dashboard = () => {
  const { loading, userInfo, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const { openDialog } = useAlertDialog();
  const { data, isLoading, error } = useFetch(["repoData", userInfo?.id], `/orders?specifications.userId=${userInfo?.id}`);

  const path = [
    {
      icon: User,
      label: "اطلاعات حساب کاربری",
      path: "/dashboard/user",
      children: <UserDashboard />,
    },
    {
      icon: Reserve,
      label: "رزروهای من",
      path: "/dashboard/my-reservations",
      children: <MyReservations data={data} isLoading={isLoading} error={error} />,
    },
    {
      icon: LogoutCurve,
      label: "خروج",
      path: null,
      children: null,
    },
  ];

  const handleClick = () => {
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

  const activePath = path.find((p) => p.path === location.pathname);

  if (!loading && !isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="w-full Padding mt-44 pb-10 flex flex-col xl:flex-row justify-between gap-6">
      <div className="w-full xl:w-72 space-y-5">
        <div className={`w-full h-23 bg-white shadow-2xl rounded-2xl flex justify-start items-center px-6 gap-4 ${loading ? "animate-pulse" : ""}`}>
          {loading ? (
            <>
              <div className="w-14 h-14 rounded-full bg-neutral-gray-3"></div>
              <div className="space-y-2">
                <div className="bg-neutral-gray-3 w-20 h-3 rounded-full"></div>
                <div className="bg-neutral-gray-3 w-32 h-2 rounded-full"></div>
              </div>

              <div className="mr-auto">
                <Edit className="size-6 stroke-neutral-gray-3" />
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full border border-primary flex justify-center items-center">
                <User className="size-7 stroke-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-neutral-gray-10 font-bold line-clamp-1 text-right">
                  {userInfo?.fName} {userInfo?.lName}
                </p>
                <p dir="ltr" className="text-neutral-gray-7 text-sm text-right">
                  {formatPhoneNumber(userInfo?.phoneNumber)}
                </p>
              </div>

              <Link to="/dashboard/user" className="mr-auto">
                <Edit className="size-6 stroke-primary" />
              </Link>
            </>
          )}
        </div>

        <div className="w-full flex flex-col items-center gap-y-5 bg-white shadow-2xl rounded-2xl p-6">
          {path.map((e, index) => {
            const CustomIcon = e.icon;
            const Element = e.label === "خروج" ? "button" : Link;
            return (
              <React.Fragment key={index}>
                <Element onClick={() => (e.label === "خروج" ? handleClick() : null)} to={e.label === "خروج" ? null : e.path} className="flex w-full justify-start items-center gap-x-2 group">
                  <div>
                    <CustomIcon className={`size-6 ${e.label === "خروج" ? "rotate-180 stroke-error" : `${location.pathname === e.path ? "stroke-primary" : "stroke-neutral-gray-9 group-hover:stroke-primary"}`}`} />
                  </div>
                  <p className={`text-sm font-medium ${e.label === "خروج" ? "text-error" : `${location.pathname === e.path ? "text-primary" : "text-neutral-gray-9 group-hover:text-primary"}`}`}>{e.label}</p>
                  {e.label !== "خروج" && (
                    <div className="mr-auto">
                      <ArrowLeft2 className={`size-6 ${location.pathname === e.path ? "stroke-primary" : "stroke-neutral-gray-9 group-hover:stroke-primary"}`} />
                    </div>
                  )}
                </Element>

                {index !== path.length - 1 && <hr className="w-full border border-neutral-gray-2" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-neutral-gray-3 rounded-2xl flex-1 p-6 flex flex-col">
        <strong className="text-neutral-gray-11 font-bold">{activePath?.label || null}</strong>

        <hr className="w-full border border-neutral-gray-2 mt-6" />

        {activePath?.children || null}
      </div>
    </div>
  );
};

export default Dashboard;
