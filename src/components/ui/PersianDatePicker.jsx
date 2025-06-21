import React, { useState, useEffect, useRef } from "react";
import { ArrowDown2 } from "iconsax-react";
import { AnimatePresence, motion } from "motion/react";
import jalaliMoment from "jalali-moment";
import scrollToElement from "@/utils/scrollToElement";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Add } from "iconsax-react";
import { useLocation } from "react-router-dom";

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const PersianDatePicker = ({ label, value, onChange, isRange = false, onClose, isOpen }) => {
  const today = useRef(jalaliMoment());
  const datePickerRef = useRef(null);
  const [currentDate, setCurrentDate] = useState({ year: today.current.jYear(), month: today.current.jMonth() });
  const [selectedDates, setSelectedDates] = useState(value || (isRange ? [] : null));
  const matches = useMediaQuery("(min-width:1280px)");
  const location = useLocation();

  const isPastMonth = jalaliMoment().jYear(currentDate.year).jMonth(currentDate.month).isSameOrBefore(today.current, "month");

  useEffect(() => {
    if (isOpen) {
      scrollToElement(datePickerRef, isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    jalaliMoment.locale("fa");
    setSelectedDates(value || (isRange ? [] : null));
  }, [value, isRange]);

  const goToMonth = (offset) => {
    setCurrentDate(({ year, month }) => {
      const newMonth = month + offset;
      return newMonth < 0 ? { year: year - 1, month: 11 } : newMonth > 11 ? { year: year + 1, month: 0 } : { year, month: newMonth };
    });
  };

  const renderMonth = (year, month, isPrimary = true) => {
    const monthMoment = jalaliMoment().jYear(year).jMonth(month).jDate(1);
    const daysInMonth = monthMoment.jDaysInMonth();
    const startDay = monthMoment.jDay();
    const days = [...Array(startDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    const isSameDate = (d1, d2) => d1?.jy === d2?.jy && d1?.jm === d2?.jm && d1?.jd === d2?.jd;
    const isToday = (day) => day && year === today.current.jYear() && month === today.current.jMonth() && day === today.current.jDate();
    const isPast = (day) => day && jalaliMoment().jYear(year).jMonth(month).jDate(day).isBefore(today.current, "day");
    const isInRange = (day) => {
      if (!day || !isRange || selectedDates.length !== 2) return false;
      const [start, end] = selectedDates;
      const current = jalaliMoment().jYear(year).jMonth(month).jDate(day);
      return current.isBetween(jalaliMoment().jYear(start.jy).jMonth(start.jm).jDate(start.jd), jalaliMoment().jYear(end.jy).jMonth(end.jm).jDate(end.jd), "day", "[]");
    };
    const isSelected = (day) => day && (isRange ? selectedDates.some((d) => isSameDate(d, { jy: year, jm: month, jd: day })) : isSameDate(selectedDates, { jy: year, jm: month, jd: day }));
    const isStart = (day) => isRange && day && isSameDate({ jy: year, jm: month, jd: day }, selectedDates[0]);
    const isEnd = (day) => isRange && day && isSameDate({ jy: year, jm: month, jd: day }, selectedDates[1]);
    const isSingleDay = isRange && selectedDates.length === 2 && isSameDate(selectedDates[0], selectedDates[1]);

    const handleDayClick = (day) => {
      if (!day || isPast(day)) return;
      const clicked = { jy: year, jm: month, jd: day };
      if (isRange) {
        if (selectedDates.length === 0 || selectedDates.length === 2) {
          setSelectedDates([clicked]);
          onChange([clicked]);
        } else {
          const [start] = selectedDates;
          const startMoment = jalaliMoment().jYear(start.jy).jMonth(start.jm).jDate(start.jd);
          if (jalaliMoment().jYear(year).jMonth(month).jDate(day).isSameOrAfter(startMoment)) {
            const range = [start, clicked];
            setSelectedDates(range);
            onChange(range);
            onClose();
          } else {
            setSelectedDates([]);
            onChange([]);
          }
        }
      } else {
        setSelectedDates(clicked);
        onChange(clicked);
        onClose();
      }
    };

    return (
      <div className="px-1 text-center">
        <div className="flex items-center justify-between p-2">
          {matches &&
            (isPrimary ? (
              <button onClick={isPastMonth ? null : () => goToMonth(-1)} className={classNames("p-2 rounded-xl xl:rounded-full", isPastMonth ? "opacity-30 cursor-not-allowed" : "hover:bg-neutral-gray-3")} disabled={isPastMonth}>
                <ArrowDown2 className="-rotate-90 size-5 stroke-black" />
              </button>
            ) : (
              !isPrimary && <div className="w-9" />
            ))}

          <span className="flex-grow text-lg font-semibold">
            {jalaliMoment().jMonth(month).format("jMMMM")} {year}
          </span>

          {matches &&
            (isRange && !isPrimary ? (
              <button onClick={() => goToMonth(1)} className="p-2 rounded-xl xl:rounded-full hover:bg-neutral-gray-3">
                <ArrowDown2 className="rotate-90 size-5 stroke-black" />
              </button>
            ) : (
              <div className="w-9" />
            ))}
        </div>

        <div className="grid grid-cols-7 text-sm font-medium gap-y-1 text-neutral-gray-6">
          {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day, i) => (
            <div key={i} className="py-2 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {days.map((day, i) => {
            const classes = classNames("flex items-center justify-center p-2 h-17 xl:h-10 xl:w-10 relative", day && !isPast(day) && "cursor-pointer hover:bg-primary/10 hover:text-primary", !day || isPast(day) ? "opacity-50 cursor-not-allowed" : "", isSelected(day) ? "bg-primary text-white" : "", isToday(day) && !isSelected(day) && !isInRange(day) ? "border border-primary text-primary" : "", isInRange(day) && !isSelected(day) ? "bg-primary/10 text-primary" : "", isInRange(day) && !isSelected(day) ? "rounded-none" : isSelected(day) && isSingleDay ? "rounded-xl xl:rounded-full" : !isStart(day) && !isEnd(day) ? "rounded-xl xl:rounded-full" : "", isStart(day) && !isSingleDay ? "rounded-r-xl xl:rounded-r-full" : "", isEnd(day) && !isSingleDay ? "rounded-l-xl xl:rounded-l-full" : "");
            return (
              <div key={i} onClick={() => handleDayClick(day)} className={classes}>
                {isPast(day) && <div className="w-0.5 bg-neutral-gray-11 absolute h-5 rotate-45 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const formatDate = (d) => (d ? jalaliMoment().jYear(d.jy).jMonth(d.jm).jDate(d.jd).format("jYYYY-jMM-jDD") : "");

  const displayValue = isRange ? (selectedDates || []).map(formatDate).filter(Boolean).join(" - ") : formatDate(selectedDates);

  const { year, month } = currentDate;
  const nextMonth = (month + 1) % 12;
  const nextYear = month === 11 ? year + 1 : year;

  return (
    <div ref={datePickerRef} className="relative w-full date-picker-container">
      {location.pathname === "/" && (
        <>
          <label htmlFor="1" className={`absolute pointer-events-none transition-all ${isOpen || displayValue ? "top-0 right-0 scale-75" : "top-1/2 -translate-y-1/2 right-2 scale-100"}`}>
            {label}
          </label>
          <input id="1" type="text" readOnly value={displayValue} className={`h-14 w-full border rounded-xl px-3 pt-5 text-sm transition-colors ${isOpen || displayValue ? "border-primary" : "border-neutral-gray-3"}`} />
          <div className="absolute left-0 px-2 -translate-y-1/2 cursor-pointer top-1/2" onClick={(e) => e.stopPropagation()}>
            <ArrowDown2 className={`size-6 transition-transform ${isOpen ? "stroke-primary rotate-180" : "stroke-black"}`} />
          </div>
        </>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div className={`bg-white fixed w-screen h-screen left-0 z-[999] overflow-y-auto xl:h-fit xl:absolute xl:z-30 border border-neutral-gray-4 xl:w-[600px] xl:rounded-xl shadow-lg pb-4 ${location.pathname === "/" ? "top-0 xl:mt-2 xl:left-1/2 xl:-translate-x-1/2" : "top-0 xl:-top-15"}`} initial={{ y: 100, opacity: 0 }} animate={{ y: matches ? 70 : 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ duration: 0.255, ease: [0.4, 0, 0.2, 1] }} onClick={(e) => e.stopPropagation()}>
            <div className={classNames("flex flex-col", isRange && "xl:flex-row gap-x-4")}>
              {!matches && (
                <div className="sticky top-0 left-0 z-20 flex flex-col items-center w-full px-3 py-5 bg-white border-b border-neutral-gray-4">
                  <div className="flex items-center justify-between w-full">
                    {label}
                    <div onClick={onClose} className="p-2 rounded-full hover:bg-neutral-gray-3">
                      <Add className="rotate-45 size-7 stroke-black" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full mt-5">
                    <button onClick={isPastMonth ? null : () => goToMonth(-1)} className={classNames("p-2 rounded-xl xl:rounded-full", isPastMonth ? "opacity-30 cursor-not-allowed" : "hover:bg-neutral-gray-3")} disabled={isPastMonth}>
                      <ArrowDown2 className="-rotate-90 size-6 stroke-black" />
                    </button>

                    <button onClick={() => goToMonth(1)} className="p-2 rounded-xl xl:rounded-full hover:bg-neutral-gray-3">
                      <ArrowDown2 className="rotate-90 size-6 stroke-black" />
                    </button>
                  </div>
                </div>
              )}
              {renderMonth(year, month, true)}
              {isRange && <div className="max-w-0.5 w-0.5 bg-neutral-gray-4" />}
              {isRange && renderMonth(nextYear, nextMonth, false)}
            </div>
            <div className="flex justify-end px-4 mt-4 mb-24 gap-x-2 xl:mb-0">
              <button
                onClick={() => {
                  setSelectedDates(isRange ? [] : null);
                  onChange(isRange ? [] : null);
                  setCurrentDate({ year: today.current.jYear(), month: today.current.jMonth() });
                  onClose();
                }}
                className="px-4 py-2 btn-outline-primary rounded-xl xl:rounded-full"
              >
                پاک کردن
              </button>
              <button onClick={onClose} className="px-4 py-2 btnBase btn-fill-primary rounded-xl xl:rounded-full">
                تایید
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersianDatePicker;
