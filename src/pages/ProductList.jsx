import React, { useEffect, useRef, useState, useCallback } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { ArrowDown2, Filter } from "iconsax-react";
import { carBrands, capitalAirports } from "@/utils/utils";
import CheckBox from "@/components/common/CheckBox";
import RadioBtn from "@/components/common/RadioBtn";
import * as Slider from "@radix-ui/react-slider";
import Card from "@/components/widget/Card";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import useMediaQuery from "@/hooks/useMediaQuery";
import useScrollBody from "@/hooks/useScrollBody";
import { AnimatePresence, motion } from "motion/react";

const ProductList = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [filters, setFilters] = useState({
    activeRadio: null,
    activeCheckBox: [],
    price: [1000000, 60000000],
  });
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortValue, setSortValue] = useState("");
  const [filterSortInput, setFilterSortInput] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const sidebarRef = useRef(null);
  const accordionRefs = useRef([]);
  const isDesktop = useMediaQuery("(min-width:1312px)");
  const isTablet = useMediaQuery("(min-width:888px)");
  const { setIsScrolling } = useScrollBody();

  useEffect(() => {
    setFilterSortInput("");
  }, [isSortOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        setIsSticky(sidebarRef.current.getBoundingClientRect().top <= 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsScrolling(!isFilterOpen);
  }, [isFilterOpen, setIsScrolling]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest("#sort") && !e.target.closest(".sort-dropdown")) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/cars`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        const selectedBrands = filters.activeCheckBox.map((i) => carBrands[i]);
        const selectedCity = capitalAirports[filters.activeRadio]?.city;
        const airportCode = selectedCity ? capitalAirports.find((a) => a.city === selectedCity)?.code : null;

        let filteredCars = Array.isArray(data) ? data.filter((car) => (selectedBrands.length === 0 || selectedBrands.includes(car.brand)) && car.inventory && car.price.daily >= filters.price[0] && car.price.daily <= filters.price[1] && (!airportCode || car.deliveryAirportCode?.includes(airportCode))) : [];

        filteredCars = filteredCars.sort((a, b) => {
          switch (sortValue) {
            case "جدید ترین (مدل)":
              return b.yearOfManufacture - a.yearOfManufacture;
            case "قدیمی ترین (مدل)":
              return a.yearOfManufacture - b.yearOfManufacture;
            case "جدید ترین (اپلود)":
              return new Date(b.publishDate) - new Date(a.publishDate);
            case "قدیمی ترین (اپلود)":
              return new Date(a.publishDate) - new Date(b.publishDate);
            case "گران ترین":
              return b.price.daily - a.price.daily;
            case "ارزان ترین":
              return a.price.daily - b.price.daily;
            default:
              return b.yearOfManufacture - a.yearOfManufacture;
          }
        });

        const start = (page - 1) * 5;
        const end = page * 5;
        const pageCars = filteredCars.slice(start, end);

        setCars((prevCars) => (page === 1 ? pageCars : [...prevCars, ...pageCars]));
        setHasMore(end < filteredCars.length);
      } catch (error) {
        console.error("Error fetching cars:", error.message);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filters, sortValue, page]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [filters, sortValue]);

  const handleCheckBoxChange = useCallback((index) => {
    setFilters((prev) => ({
      ...prev,
      activeCheckBox: prev.activeCheckBox.includes(index) ? prev.activeCheckBox.filter((i) => i !== index) : [...prev.activeCheckBox, index],
    }));
  }, []);

  const handleRadioChange = useCallback((index) => {
    setFilters((prev) => ({ ...prev, activeRadio: index }));
  }, []);

  const handleSliderChange = useCallback((value) => {
    if (value[0] <= value[1]) {
      setFilters((prev) => ({ ...prev, price: value }));
    }
  }, []);

  const filterSidebar = [
    {
      title: "قیمت اجاره خودرو",
      content: (
        <div className="space-y-3 w-full">
          <div className="flex justify-between">
            {filters.price.map((price, index) => (
              <p key={index}>{price.toLocaleString()}</p>
            ))}
          </div>
          <Slider.Root dir="rtl" className="relative flex w-full touch-none select-none items-center" min={1000000} max={60000000} step={1000000} value={filters.price} onValueChange={handleSliderChange}>
            <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-neutral-200">
              <Slider.Range className="absolute h-full bg-primary" />
            </Slider.Track>
            <Slider.Thumb className="block h-5 w-5 rounded-full bg-white border border-neutral-gray-4" aria-label="Minimum value" />
            <Slider.Thumb className="block h-5 w-5 rounded-full bg-white border border-neutral-gray-4" aria-label="Maximum value" />
          </Slider.Root>
        </div>
      ),
    },
    {
      title: "برند خودرو",
      content: carBrands.map((brand, index) => (
        <div key={index} onClick={() => handleCheckBoxChange(index)} className="flex items-center gap-x-3 cursor-pointer">
          <CheckBox active={filters.activeCheckBox.includes(index)} />
          <p>{brand}</p>
        </div>
      )),
    },
    {
      title: "مقصد مورد نظر",
      content: capitalAirports.map((option, index) => (
        <div key={index} onClick={() => handleRadioChange(index)} className="flex items-center gap-x-3 cursor-pointer">
          <RadioBtn active={filters.activeRadio === index} />
          <p>{option.city}</p>
        </div>
      )),
    },
  ];

  const sortOptions = ["جدید ترین (مدل)", "قدیمی ترین (مدل)", "جدید ترین (اپلود)", "قدیمی ترین (اپلود)", "گران ترین", "ارزان ترین"];

  return (
    <main className="w-full">
      <Breadcrumbs title="لیست خودرو" crumbs={[{ path: null, title: "لیست خودرو" }]} />
      <div className="flex justify-between items-start gap-x-6 px-4">
        <div onClick={() => setIsFilterOpen(false)} ref={sidebarRef} className={`${isDesktop ? "sticky top-0" : `fixed z-[999] bg-black/50 top-0 left-0 w-screen h-screen transition-all ${isFilterOpen ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-56"}`}`}>
          <div onClick={(e) => e.stopPropagation()} className={`w-72 overflow-y-auto border border-neutral-gray-2 px-4 py-6 flex flex-col items-center space-y-4 bg-white transition-all ${isDesktop ? "min-h-[680px] rounded-2xl" : "h-full rounded-l-2xl"} ${isDesktop && isSticky && "pt-28"}`}>
            {filterSidebar.map((item, index) => (
              <div className="w-full" key={index}>
                <button onClick={() => setActiveAccordion(activeAccordion === index ? null : index)} className="w-full flex justify-between items-center">
                  <p>{item.title}</p>
                  <ArrowDown2 className={`size-6 stroke-neutral-gray-6 transition-transform ${activeAccordion === index ? "rotate-180" : "rotate-0"}`} />
                </button>
                <div
                  className={`w-full space-y-2 mt-3 overflow-hidden transition-all ${activeAccordion === index ? "pb-2" : ""}`}
                  ref={(el) => (accordionRefs.current[index] = el)}
                  style={{
                    maxHeight: activeAccordion === index ? accordionRefs.current[index]?.scrollHeight : 0,
                  }}
                >
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-[300px]">
          {cars.length ? (
            <div className="flex flex-col items-center gap-y-6 w-full">
              <div className={`grid ${isDesktop ? "grid-cols-[1fr_auto]" : "grid-cols-1 xs:grid-cols-[auto_1fr]"} gap-6 w-full`}>
                {!isDesktop && (
                  <button className="btn-fill-primary w-12 h-12 p-3 rounded-xl flex justify-center items-center" onClick={() => setIsFilterOpen(true)}>
                    <Filter className="size-8 stroke-white" />
                  </button>
                )}
                <div onClick={(e) => e.stopPropagation()} className="relative w-full md:w-[287px]">
                  <label htmlFor="sort" className={`absolute bg-white transition-all px-2 ${isSortOpen || sortValue ? "-top-3 text-sm right-2" : "top-1/2 -translate-y-1/2 right-1"}`}>
                    مرتب سازی
                  </label>
                  <input id="sort" value={isSortOpen ? filterSortInput : sortValue} type="text" className="p-3 h-12 border border-neutral-gray-5 rounded-xl w-full" onFocus={() => setIsSortOpen(true)} onChange={(e) => setFilterSortInput(e.target.value)} />
                  <span className="absolute top-0 left-0 h-full px-3 cursor-pointer flex justify-center items-center rounded-l-xl" onClick={() => setIsSortOpen((prev) => !prev)}>
                    <ArrowDown2 className={`size-6 stroke-neutral-gray-5 transition-transform ${isSortOpen ? "rotate-180" : "rotate-0"}`} />
                  </span>
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div className="sort-dropdown w-full absolute left-0 top-14 overflow-hidden rounded-xl z-30 bg-white border border-neutral-gray-5 shadow-2xl" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.225, ease: [0.4, 0, 0.2, 1] }}>
                        <div className="flex flex-col items-center w-full max-h-72 overflow-y-auto">
                          {sortOptions.filter((option) => option.includes(filterSortInput)).length > 0 ? (
                            sortOptions
                              .filter((option) => option.includes(filterSortInput))
                              .map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSortValue(option);
                                    setIsSortOpen(false);
                                  }}
                                  className={`w-full h-12 flex justify-center items-center ${sortValue === option ? "bg-primary/10" : "hover:bg-primary/10"}`}
                                >
                                  {option}
                                </button>
                              ))
                          ) : (
                            <div className="py-4 text-neutral-gray-6 text-sm w-full px-3">نتیجه‌ای یافت نشد</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className={`flex flex-row flex-wrap gap-10 w-full ${isTablet ? "justify-between" : "justify-center"}`}>
                {cars.map((car) => (
                  <Card key={car.id} car={car} />
                ))}

                {isLoading && page > 1 && Array.from({ length: 5 }).map((_, index) => <CardSkeleton key={`skeleton-${index}`} />)}

                {isLoading && page === 1 && Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={`initial-skeleton-${index}`} />)}
              </div>

              {hasMore && !isLoading && (
                <div className="flex justify-center mt-8">
                  <button onClick={() => setPage((prev) => prev + 1)} className="btnBase btn-fill-primary h-11 px-4">
                    مشاهده بیشتر
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className={`flex flex-row flex-wrap gap-6 w-full ${isTablet ? "justify-between" : "justify-center"}`}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CardSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p>ماشینی با فیلترهای انتخابی یافت نشد</p>
                  <button
                    onClick={() =>
                      setFilters({
                        activeRadio: null,
                        activeCheckBox: [],
                        price: [1000000, 60000000],
                      })
                    }
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    بازنشانی فیلترها
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductList;
