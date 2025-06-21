import { useLocation, Link } from "react-router-dom";
import { ArrowLeft2 } from "iconsax-react";
import { useState, useEffect, useRef } from "react";
import Card from "@/components/widget/Card";
import BaseSection from "@/components/common/BaseSection";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import useMediaQuery from "@/hooks/useMediaQuery";
import useGetData from "@/hooks/useGetData";
import CardSkeleton from "@/components/skeleton/CardSkeleton";

const Tags = ["پرطرفدار", "لوکس", "اقتصادی"];

const CarReservationHome = () => {
  const [activeTag, setActiveTag] = useState(Tags[0]);
  const [groupedData, setGroupedData] = useState([]);
  const { data, isLoading } = useGetData(`${import.meta.env.VITE_API_URL}/cars?inventory=true&_limit=50&_sort=publishDate&_order=desc`);

  const filteredData = groupedData.filter((car) => car.tags?.includes(activeTag));

  const location = useLocation();
  const stickyRef = useRef(null);
  const dataCardRef = useRef(null);

  const [isSticky, setIsSticky] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const matches = useMediaQuery("(min-width:450px)");
  const matches2 = useMediaQuery("(min-width:768px)");

  useEffect(() => {
    const allowedTags = ["اقتصادی", "لوکس", "پرطرفدار"];
    if (Array.isArray(data)) {
      const grouped = {
        اقتصادی: [],
        لوکس: [],
        پرطرفدار: [],
      };

      data.forEach((car) => {
        for (const tag of car.tags || []) {
          if (allowedTags.includes(tag) && grouped[tag].length < 6) {
            grouped[tag].push(car);
            break;
          }
        }
      });

      const combined = [...grouped["اقتصادی"], ...grouped["لوکس"], ...grouped["پرطرفدار"]];
      setGroupedData(combined);
    }
  }, [data]);

  const handleScroll = () => {
    if (!stickyRef.current) return;
    const { top } = stickyRef.current.getBoundingClientRect();
    setIsSticky(top <= 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    handleScroll();
  }, [location.pathname]);

  const handleScrollTo = () => {
    const element = dataCardRef.current;
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollBy({
      top: elementPosition - window.pageYOffset - (matches2 ? 200 : 250),
      behavior: "smooth",
    });
  };

  const handleTagChange = (tag) => {
    setActiveTag(tag);
    setHasInteracted(true);
  };

  useEffect(() => {
    if (hasInteracted) {
      handleScrollTo();
    }
  }, [activeTag]);

  return (
    <BaseSection title="رزرو خودرو در" highlight={import.meta.env.VITE_APP_NAME} description="مشاهده خودروهای اجاره‌ای موجود برای رزرو آنلاین در سراسر ایران">
      <div className="flex flex-col items-center justify-start w-full -translate-y-16 gap-y-6">
        <div ref={stickyRef} className={`w-full flex flex-col md:flex-row items-center gap-y-7 gap-x-2 sticky top-16 pt-20 md:pt-28 pb-5 left-0 z-20 transition-colors duration-300 border border-t-0 ${isSticky ? "bg-white shadow-sm rounded-b-2xl border-neutral-gray-2" : "bg-transparent shadow-none border-transparent rounded-b-none"}`}>
          <div className={`transition-all duration-300 ${isSticky ? "flex-none" : "lg:flex-1"}`} />

          {matches ? (
            <div className={`flex justify-center items-center gap-x-2 ${isSticky ? "ml-0" : "md:ml-auto"}`}>
              {Tags.map((e, index) => (
                <button key={index} onClick={() => handleTagChange(e)} className={`btnBase w-32 h-12 ${activeTag === e ? "btn-fill-primary hover:bg-primary" : "btn-border-primary"}`}>
                  {e}
                </button>
              ))}
            </div>
          ) : (
            <Swiper spaceBetween={0} slidesPerView="auto" className={`w-full !px-2`}>
              {Tags.map((e, index) => (
                <SwiperSlide key={index} className="!w-fit px-2">
                  <button onClick={() => handleTagChange(e)} className={`btnBase w-32 h-12 shrink-0 ${activeTag === e ? "btn-fill-primary hover:bg-primary" : "btn-border-primary"}`}>
                    {e}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <div className={`flex-1 flex justify-end transition-all ${isSticky ? "md:translate-x-5" : ""}`}>
            <Link to="/product-list" aria_label="مشاهده همه خودروهای اجاره‌ای" className="btnBase btn-none-primary !p-0 group">
              مشاهده همه
              <ArrowLeft2 className="size-5 stroke-primary group-hover:stroke-primary-shade-3" />
            </Link>
          </div>
        </div>

        <section ref={dataCardRef} aria-labelledby="car-list-heading" className="w-full">
          <h3 id="car-list-heading" className="sr-only">
            لیست خودروهای فیلتر شده برای اجاره
          </h3>
          <div className="flex flex-row flex-wrap items-center justify-center w-full gap-5 lg:justify-between">{isLoading ? Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />) : filteredData?.map((e, index) => <Card key={index} car={e} />)}</div>
        </section>
      </div>
    </BaseSection>
  );
};

export default CarReservationHome;
