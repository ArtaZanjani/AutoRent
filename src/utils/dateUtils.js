import jalaliMoment from "jalali-moment";

export const formatDateForDisplay = (dateValue) => {
  if (!dateValue) return "";

  if (Array.isArray(dateValue)) {
    return dateValue
      .map((date) => {
        if (date && typeof date === "object" && date.jy) {
          return jalaliMoment().jYear(date.jy).jMonth(date.jm).jDate(date.jd).format("jYYYY-jMM-jDD");
        }
        return "";
      })
      .filter(Boolean)
      .join(" - ");
  } else if (typeof dateValue === "object" && dateValue.jy) {
    return jalaliMoment().jYear(dateValue.jy).jMonth(dateValue.jm).jDate(dateValue.jd).format("jYYYY-jMM-jDD");
  }

  return dateValue;
};

export const timeToMinutes = (time) => (time ? time.split(":").reduce((h, m) => +h * 60 + +m, 0) : null);

export const isSameDay = (dateRange) => {
  if (!dateRange || !Array.isArray(dateRange) || dateRange.length !== 2) return false;
  return dateRange[0]?.jy === dateRange[1]?.jy && dateRange[0]?.jm === dateRange[1]?.jm && dateRange[0]?.jd === dateRange[1]?.jd;
};

export const getNextValidTime = (times, deliveryTime) => {
  const deliveryMinutes = timeToMinutes(deliveryTime);
  return times.find((t) => timeToMinutes(t) > deliveryMinutes) || "";
};
