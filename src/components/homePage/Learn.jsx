import { motion, useInView } from "motion/react";
import { useRef } from "react";
import BaseSection from "@/components/common/BaseSection";
import CarRoad from "@/assets/icons/CarRoad.webp";
import { Car, CalendarTick, Cards, Key } from "iconsax-react";

import One from "@/assets/icons/Number/1.svg";
import Tow from "@/assets/icons/Number/2.svg";
import Three from "@/assets/icons/Number/3.svg";
import Four from "@/assets/icons/Number/4.svg";

import useMediaQuery from "@/hooks/useMediaQuery";
import BaseImage from "@/components/common/BaseImage";

const learnArray = [
  {
    icon: <Car className="size-8 sm:size-10 lg:size-12 stroke-neutral-gray-9" />,
    imageNumber: One,
    title: (
      <>
        <span className="text-secondary-shade-1 text-lg sm:text-xl lg:text-2xl font-bold">خودروی</span> خود را انتخاب کنید.
      </>
    ),
    description: (
      <>
        خودروی مورد نظر خود را، متناسب با <br className="hidden xl:block" /> درخواست خود انتخاب کنید.
      </>
    ),
  },
  {
    icon: <CalendarTick className="size-8 sm:size-10 lg:size-12 stroke-neutral-gray-9" />,
    imageNumber: Tow,
    title: (
      <>
        <span className="text-secondary-shade-1 text-lg sm:text-xl lg:text-2xl font-bold">تاریخ</span> تحویل را تعیین کنید.
      </>
    ),
    description: (
      <>
        تاریخ موردنظر خود را از تقویم، انتخاب و <br className="hidden xl:block" /> رزرو کنید
      </>
    ),
  },
  {
    icon: <Cards className="size-8 sm:size-10 lg:size-12 stroke-neutral-gray-9" />,
    imageNumber: Three,
    title: (
      <>
        <span className="text-secondary-shade-1 text-lg sm:text-xl lg:text-2xl font-bold">هزینه</span> اجاره را پرداخت کنید.
      </>
    ),
    description: (
      <>
        می توانید از طریق کیف پول آنلاین یا <br className="hidden xl:block" /> کارت های عضو شبکه شتاب هزینه اجاره <br className="hidden xl:block" /> را پرداخت کنید.
      </>
    ),
  },
  {
    icon: <Key className="size-8 sm:size-10 lg:size-12 stroke-neutral-gray-9" />,
    imageNumber: Four,
    title: (
      <>
        <span className="text-secondary-shade-1 text-lg sm:text-xl lg:text-2xl font-bold">خودرو</span> را دریافت کنید.
      </>
    ),
    description: (
      <>
        در زمان و مکان تعیین شده، خودروی <br className="hidden xl:block" /> خود را دریافت کنید.
      </>
    ),
  },
];

const Learn = () => {
  const ref = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(min-width: 500px)");

  const isInView = useInView(ref, { amount: 0.1, once: false });

  return (
    <BaseSection title="خودرو رزرو کنیم؟" highlight={import.meta.env.VITE_APP_NAME} description="چگونه در وبسایت" highlightFirst={false} className="w-full space-y-12 xl:space-y-32">
      <div ref={ref} className="w-full h-full relative px-4 sm:px-6 lg:px-8">
        {isDesktop ? (
          <>
            <motion.div initial={{ opacity: 0, y: 100 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
              <BaseImage src={CarRoad} alt={`چگونه در وبسایت ${import.meta.env.VITE_APP_NAME}، خودرو رزرو کنیم`} className="mx-auto hidden md:block max-w-full h-auto" />
            </motion.div>

            <div className="w-full absolute top-0 left-0 h-full">
              <div className="w-full h-full grid grid-cols-[auto_auto] gap-x-8 gap-y-12 justify-between items-start p-8">
                {learnArray.map((e, index) => (
                  <div className="flex flex-row justify-start items-start gap-x-4" key={index}>
                    <div className="w-20 h-20 rounded-2xl flex justify-center items-center bg-white border border-neutral-gray-2 relative flex-shrink-0 shadow-sm">
                      {e.icon}
                      <BaseImage src={e.imageNumber} alt={`مرحله ${index + 1}`} className="absolute -z-10 left-0 -top-20" />
                    </div>

                    <div className="space-y-3 max-w-xs">
                      <p className="text-2xl font-bold text-neutral-gray-11 leading-tight">{e.title}</p>
                      <p className="text-base text-neutral-gray-8 font-medium leading-relaxed">{e.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full space-y-12">
            {learnArray.map((e, index) => (
              <div className="flex flex-row justify-start items-center gap-x-3 p-4 bg-white rounded-2xl border border-neutral-gray-2 shadow-sm" key={index}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex justify-center items-center bg-neutral-gray-1 border border-neutral-gray-2 relative flex-shrink-0">
                  {e.icon}
                  {isMobile && <BaseImage src={e.imageNumber} alt={`مرحله ${index + 1}`} className={`absolute -z-10 left-0 -top-15 md:-top-14 size-13`} />}
                </div>

                <div className="space-y-2 flex-1">
                  <p className="text-lg xs:text-xl font-bold text-neutral-gray-11 leading-tight">{e.title}</p>
                  <p className="text-xs xs:text-base text-neutral-gray-8 font-medium leading-relaxed">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseSection>
  );
};

export default Learn;
