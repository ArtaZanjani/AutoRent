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
    <div className="flex flex-col justify-between w-full gap-6 pb-10 Padding mt-44 xl:flex-row">
      <div className="w-full space-y-5 xl:w-72">
        <div className={`w-full h-23 bg-white shadow-2xl rounded-2xl flex justify-start items-center px-6 gap-4 ${loading ? "animate-pulse" : ""}`}>
          {loading ? (
            <>
              <div className="rounded-full w-14 h-14 bg-neutral-gray-3"></div>
              <div className="space-y-2">
                <div className="w-20 h-3 rounded-full bg-neutral-gray-3"></div>
                <div className="w-32 h-2 rounded-full bg-neutral-gray-3"></div>
              </div>

              <div className="mr-auto">
                <Edit className="size-6 stroke-neutral-gray-3" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center border rounded-full w-14 h-14 border-primary">
                <User className="size-7 stroke-primary" />
              </div>
              <div className="space-y-2">
                <p className="font-bold text-right text-neutral-gray-10 line-clamp-1">
                  {userInfo?.fName} {userInfo?.lName}
                </p>
                <p dir="ltr" className="text-sm text-right text-neutral-gray-7">
                  {formatPhoneNumber(userInfo?.phoneNumber)}
                </p>
              </div>

              <Link to="/dashboard/user" className="mr-auto">
                <Edit className="size-6 stroke-primary" />
              </Link>
            </>
          )}
        </div>

        <div className="flex flex-col items-center w-full p-6 bg-white shadow-2xl gap-y-5 rounded-2xl">
          {path.map((e, index) => {
            const CustomIcon = e.icon;
            const Element = e.label === "خروج" ? "button" : Link;
            return (
              <React.Fragment key={index}>
                <Element onClick={() => (e.label === "خروج" ? handleClick() : null)} to={e.label === "خروج" ? null : e.path} className="flex items-center justify-start w-full gap-x-2 group">
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

      <div className="flex flex-col flex-1 p-6 bg-white border border-neutral-gray-3 rounded-2xl">
        <strong className="font-bold text-neutral-gray-11">{activePath?.label || null}</strong>

        <hr className="w-full mt-6 border border-neutral-gray-2" />

        {activePath?.children || null}
      </div>
    </div>
  );
};

export default Dashboard;
