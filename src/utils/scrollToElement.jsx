const scrollToElement = (ref, isActive, offset = 195) => {
  if (isActive !== -1 && ref.current) {
    const element = Array.isArray(ref.current) ? ref.current[isActive] : ref.current;
    if (element && typeof element.getBoundingClientRect === "function") {
      const { top } = element.getBoundingClientRect();
      window.scrollTo({
        top: top + window.pageYOffset - offset,
        behavior: "smooth",
      });
    }
  }
};

export default scrollToElement;
