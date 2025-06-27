import BaseBg from "@/components/common/BaseBg";
import { motion } from "motion/react";
import { SearchNormal1, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useLocation, useNavigate } from "react-router-dom";
import { GetData } from "@/utils/AsyncFunction";
import useScrollBody from "@/hooks/useScrollBody";
import Spinner from "@/components/ui/Spinner";

const SearchSwiper = ({ items, onClick, getLabel }) => (
  <Swiper className="w-full !px-3" slidesPerView="auto" spaceBetween={10}>
    {items?.map((e) => (
      <SwiperSlide onClick={() => onClick(e)} key={e.id} className="!w-fit cursor-pointer h-10 rounded-full border text-neutral-gray-8 text-sm border-neutral-gray-8 hover:bg-neutral-gray-8 hover:text-white bg-white flex justify-center items-center px-3.5 py-1.5 gap-x-2">
        {getLabel ? getLabel(e) : e.name}
      </SwiperSlide>
    ))}
  </Swiper>
);

const SearchBar = ({ isOpen, onClose }) => {
  const [value, setValue] = useState("");
  const [localSearch, setLocalSearch] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setIsScrolling } = useScrollBody();

  useEffect(() => {
    try {
      const history = localStorage.getItem("searchHistory");
      setLocalSearch(history ? JSON.parse(history) : []);
    } catch (err) {
      console.error("Failed to parse searchHistory:", err);
      setLocalSearch([]);
    }
  }, []);

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    setIsScrolling(!isOpen);
    setValue("");
  }, [isOpen, setIsScrolling]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!value.trim()) {
        setData([]);
        return;
      }

      const term = encodeURIComponent(value.trim());
      const query = `${import.meta.env.VITE_API_URL}cars?and=(inventory.eq.true,or(brand.ilike.*${term}*,model.ilike.*${term}*))`;
      GetData(setData, setIsLoading, setError, query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  const handleClear = () => {
    localStorage.setItem("searchHistory", JSON.stringify([]));
    setLocalSearch([]);
  };

  const handleNavigate = (id, name) => {
    const newEntry = { id, name };

    let updatedHistory = [];
    try {
      const existing = localStorage.getItem("searchHistory");
      updatedHistory = existing ? JSON.parse(existing) : [];
    } catch {
      updatedHistory = [];
    }

    if (updatedHistory.length > 0 && updatedHistory[0].id === id) {
      navigate(`/product-detail/${id}`);
      return;
    }

    updatedHistory = updatedHistory.filter((item) => item.id !== id);

    updatedHistory.unshift(newEntry);

    if (updatedHistory.length > 20) {
      updatedHistory = updatedHistory.slice(0, 20);
    }

    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setLocalSearch(updatedHistory);

    navigate(`/product-detail/${id}`);
  };

  if (location.pathname === "/fetcherror") {
    return null;
  }

  return (
    <BaseBg isOpen={isOpen} onClose={onClose}>
      {isOpen && (
        <motion.div onClick={(e) => e.stopPropagation()} className={`w-full absolute top-0 left-0 py-6 bg-white space-y-6`} initial={{ y: -150 }} animate={{ y: -0 }} exit={{ y: -150 }} transition={{ duration: 0.225, ease: [0.4, 0, 0.2, 1] }}>
          <div className="relative px-3">
            {value.length < 1 && (
              <div className="absolute flex items-center -translate-y-1/2 pointer-events-none top-1/2 right-3 gap-x-2">
                <SearchNormal1 className="size-6 stroke-neutral-gray-5" />
                <span className="font-medium text-neutral-gray-5">جستجو</span>
              </div>
            )}

            <input type="text" className="w-full h-10 bg-white" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>

          <hr className="w-full border border-neutral-gray-2" />

          {localSearch && localSearch?.length > 0 && value.length < 1 && (
            <div className="flex flex-col w-full gap-y-6">
              <div className="flex items-center justify-between w-full px-3">
                <p className="font-medium text-neutral-gray-9">تاریخچه جستجوهای شما</p>

                <button onClick={handleClear}>
                  <Trash className="size-7 stroke-neutral-gray-7" />
                </button>
              </div>

              <SearchSwiper items={localSearch} onClick={(e) => handleNavigate(e.id, e.name)} />
            </div>
          )}

          {isLoading ? (
            <div className="px-3">
              <Spinner />
            </div>
          ) : (
            <>
              {data?.length > 0 && value.length > 0 && (
                <div className="flex flex-col w-full gap-y-6">
                  <p className="px-3 font-medium text-neutral-gray-9">نتایج جستجو</p>
                  <SearchSwiper items={data} onClick={(e) => handleNavigate(e.id, `${e.brand} ${e.model}`)} getLabel={(e) => `${e.brand} ${e.model}`} />
                </div>
              )}

              {data?.length < 1 && value.length > 0 && (
                <div className="px-3">
                  <p className="text-neutral-gray-7">{!error && data?.length < 1 && value.length > 0 ? "نتیجه‌ای برای جستجوی شما یافت نشد" : error}</p>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </BaseBg>
  );
};

export default SearchBar;
