import Ghost from "@/assets/icons/Ghost.webp";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const FetchErrorCom = ({ refetch = null }) => {
  const isSm = useMediaQuery("(min-width: 640px)");
  const islg = useMediaQuery("(min-width: 768px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const is2Xl = useMediaQuery("(min-width: 1536px)");
  const location = useLocation();

  const imageWidth = useMemo(() => {
    if (is2Xl) return "w-[400px]";
    if (isXl) return "w-[300px]";
    if (islg) return "w-[250px]";
    if (isSm) return "w-[200px]";
    return "w-[150px]";
  }, [is2Xl, isXl, islg, isSm]);

  return (
    <div className={`w-full min-h-screen flex flex-col justify-center items-center gap-y-5 px-4 sm:px-8 2xl:px-24 xl:gap-6 2xl:gap-12 py-5 ${location.pathname === "/fetcherror" && "bg-radial from-primary-shade-3 from-10% to-primary-shade-5"}`}>
      <img src={Ghost} alt="خطا در ارتباط با سرور لطفا کمی بعد تلاش کنید" className={`${imageWidth} rounded-4xl pointer-events-none h-auto max-w-full object-contain`} />

      <div className="flex flex-col items-center gap-y-3">
        <p
          style={{
            fontSize: "clamp(32px, 5vw, 50px)",
            lineHeight: 1.8,
          }}
          className={`${location.pathname === "/fetcherror" ? "text-white border-white" : "text-neutral-gray-10 border-neutral-gray-10"} max-w-full whitespace-nowrap text-center`}
        >
          خطا در ارتباط با سرور <br /> لطفا کمی بعد تلاش کنید
        </p>

        <button onClick={refetch} className={`py-2 px-5 text-xl rounded-xl ${location.pathname === "/fetcherror" ? "text-white border-white" : "text-neutral-gray-10 border-neutral-gray-10"} border`}>
          سعی مجدد
        </button>
      </div>
    </div>
  );
};

export default FetchErrorCom;
