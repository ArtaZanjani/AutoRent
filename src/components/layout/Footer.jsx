import { Link, useLocation } from "react-router-dom";
import useMediaQuery from "@/hooks/useMediaQuery";
import { CreativeCommons, ArrowDown2 } from "iconsax-react";
import React, { useRef, useState, useEffect } from "react";
import BaseImage from "@/components/common/BaseImage";
import { navFooter } from "@/utils/utils";
import Logo2 from "@/assets/icons/Logo2.webp";

const Footer = () => {
  const matches = useMediaQuery("(min-width: 800px)");
  const [openIndex, setOpenIndex] = useState(null);
  const refs = useRef([]);
  const location = useLocation();

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const onResize = () => setOpenIndex(null);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const renderLink = (sectionTitle, item) => {
    if (sectionTitle === "دسترسی آسان") {
      return (
        <Link to={item.path} className={`text-sm group relative transition-all ${location.pathname === item.path ? "text-secondary" : "text-white hover:text-secondary"}`}>
          {item.title}

          {matches && <div className={`w-0 h-0.5 bg-secondary absolute -bottom-2 left-0 ${location.pathname === item.path ? "w-full right-0" : "group-hover:w-full group-hover:right-0 right-auto"} transition-all`} />}
        </Link>
      );
    } else {
      return (
        <a href={item.path} className={`text-sm group relative transition-all text-white hover:text-secondary`} target="_blank" rel="noopener noreferrer">
          {item.title}

          {matches && <div className={`w-0 h-0.5 bg-secondary absolute -bottom-2 left-0 group-hover:w-full group-hover:right-0 right-auto transition-all`} />}
        </a>
      );
    }
  };

  if (location.pathname === "/fetcherror") {
    return null;
  }
  return (
    <footer className="bg-[#1E1E1E]/90 w-full px-6 pt-10 pb-5 flex flex-col items-center gap-y-10" role="contentinfo">
      <section className={`w-full flex ${matches ? "flex-row" : "flex-col"} gap-y-5 justify-between items-start flex-wrap`}>
        <article className="space-y-6 max-w-[407px]">
          <BaseImage src={Logo2} fallback={Logo2} alt="Autornet Logo" className="object-contain w-auto h-[59px]" />
          <p className="text-sm text-white leading-relaxed">اتورنت با رویکرد اعتماد به مشتری، با در اختیار داشتن بزرگترین ناوگان خودرویی متشکل از انواع خودروهای صفر کیلومتر، اقتصادی تا تجاری در سراسر کشور ایران آماده خدمت‌رسانی به مشتریان است.</p>
        </article>

        {matches
          ? navFooter.map(({ title, items }, i) => (
              <nav key={i} aria-label={title} className="space-y-6">
                <h2 className="text-base font-medium text-white">{title}</h2>
                <ul className="space-y-4">
                  {items.map((item, j) => (
                    <li key={j}>{renderLink(title, item)}</li>
                  ))}
                </ul>
              </nav>
            ))
          : navFooter.map(({ title, items }, index) => {
              const isOpen = openIndex === index;
              return (
                <section key={index} className="w-full border border-white rounded-xl">
                  <button onClick={() => toggleAccordion(index)} aria-expanded={isOpen} aria-controls={`footer-section-${index}`} className="w-full flex justify-between items-center text-white font-semibold px-3 py-3" type="button">
                    {title}
                    <ArrowDown2 className={`size-6 stroke-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>

                  <div
                    id={`footer-section-${index}`}
                    ref={(el) => (refs.current[index] = el)}
                    style={{
                      maxHeight: isOpen && refs.current[index] ? `${refs.current[index].scrollHeight}px` : "0px",
                      paddingLeft: isOpen ? "0.75rem" : 0,
                      paddingRight: isOpen ? "0.75rem" : 0,
                      marginTop: isOpen ? "0.75rem" : 0,
                    }}
                    className={`overflow-hidden customTransition`}
                    aria-hidden={!isOpen}
                  >
                    <ul className="space-y-3 pb-3">
                      {items.map((item, i) => (
                        <li key={i}>{renderLink(title, item)}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })}
      </section>

      <hr className="w-full border border-neutral-gray-4 mt-5" />

      <address className="flex items-center gap-x-2" aria-label="حقوق وبسایت">
        <CreativeCommons className="size-6 stroke-white" />
        <p className="text-white text-sm font-semibold not-italic">تمامی حقوق این وبسایت متعلق به اتورنت می‌باشد</p>
      </address>
    </footer>
  );
};

export default Footer;
