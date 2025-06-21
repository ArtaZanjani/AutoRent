import Banner from "@/assets/icons/Banner.webp";
import { Car, ArrowCircleLeft, WalletMinus, I24Support, Box } from "iconsax-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import React from "react";
import { Link } from "react-router-dom";
import Bmw from "@/assets/icons/Cars/BMW.webp";
import Honda from "@/assets/icons/Cars/Honda.webp";
import Hyundai from "@/assets/icons/Cars/Hyundai.webp";
import Jeep from "@/assets/icons/Cars/Jeep.webp";
import KIA from "@/assets/icons/Cars/KIA.webp";
import LandRover from "@/assets/icons/Cars/LandRover.webp";
import lexus_logo from "@/assets/icons/Cars/lexus-logo.webp";
import Mercedes from "@/assets/icons/Cars/Mercedes.webp";
import Nissan from "@/assets/icons/Cars/Nissan.webp";
import Toyota from "@/assets/icons/Cars/Toyota.webp";
import BaseImage from "@/components/common/BaseImage";
import useMediaQuery from "@/hooks/useMediaQuery";
import BannerAbout from "@/assets/icons/BannerAbout.webp";
import Coupe from "@/assets/icons/carType/Coupe.webp";
import Sedan from "@/assets/icons/carType/Sedan.webp";
import Convertible from "@/assets/icons/carType/Convertible.webp";
import SUV from "@/assets/icons/carType/SUV.webp";
import Sport from "@/assets/icons/carType/Sport.webp";
import CarReservationHome from "@/components/homePage/CarReservationHome";
import Learn from "@/components/homePage/Learn";
import AccordionHome from "@/components/homePage/AccordionHome.jsx";
import Comments from "@/components/homePage/Comments.jsx";
import BlogHome from "@/components/homePage/BlogHome.jsx";

const carBrands = [
  { label: "BMW", icon: Bmw },
  { label: "Honda", icon: Honda },
  { label: "Hyundai", icon: Hyundai },
  { label: "Jeep", icon: Jeep },
  { label: "KIA", icon: KIA },
  { label: "Land Rover", icon: LandRover },
  { label: "Lexus", icon: lexus_logo },
  { label: "Mercedes", icon: Mercedes },
  { label: "Nissan", icon: Nissan },
  { label: "Toyota", icon: Toyota },
];

const BannerAboutArray = [
  {
    icon: <WalletMinus className="size-12 stroke-primary" />,
    title: "قیمت مناسب",
    content: (
      <>
        هدف ما، ارائه بهترین خدمات با مناسب ترین قیمت <br /> ممکن است.
      </>
    ),
  },
  {
    icon: <I24Support className="size-12 stroke-primary" />,
    title: "پشتیبانی 24 ساعته",
    content: (
      <>
        کارشناسان ما در هر زمان و مکان، پاسخگوی سوالات <br /> شما خواهند بود.
      </>
    ),
  },
  {
    icon: <Box className="size-12 stroke-primary" />,
    title: "تحویل در محل",
    content: (
      <>
        تحویل خودرو در زمان و مکان تعیین شده توسط شما <br /> خواهد بود.
      </>
    ),
  },
];

const CarTypes = [
  {
    title: "کوپه",
    icon: Coupe,
  },
  {
    title: "سدان",
    icon: Sedan,
  },
  {
    title: "کروک",
    icon: Convertible,
  },
  {
    title: "شاسی‌ بلند",
    icon: SUV,
  },
  {
    title: "اسپرت",
    icon: Sport,
  },
];

const Home = () => {
  const matches = useMediaQuery("(min-width:1344px)");
  const matches2 = useMediaQuery("(min-width:1170px)");
  const matches3 = useMediaQuery("(min-width:850px)");
  const matches4 = useMediaQuery("(max-width:1536px)");

  return (
    <>
      <main className="SpaceYCustom">
        <div className="w-full h-[500px] relative">
          <BaseImage src={Banner} alt={`${import.meta.env.VITE_APP_NAME} - رزرو خودرو`} className="object-cover w-full h-full" />

          <div className="absolute top-[200px] sm:right-0 Padding z-10 flex flex-col justify-start items-center sm:items-start w-full sm:w-fit">
            <h1 className="text-secondary text-[25px] xs:text-[27px] sm:text-4xl md:text-[44px] font-bold text-center leading-relaxed">{import.meta.env.VITE_APP_NAME}؛ سریع، آسان و به‌صرفه</h1>
            <p className="mt-2 text-sm font-semibold text-center text-white xs:text-xl xs:font-normal">سرویس‌دهنده رزرو خودرو در ایران در کمترین زمان ممکن!</p>
            <div className="flex flex-row items-center justify-start mt-5 gap-x-4" aria-label="CTA Buttons">
              <Link to="/product-list" className="h-12 font-semibold btnBase btn-fill-secondary">
                <Car className="size-6 stroke-black" />
                رزرو آسان خودرو
              </Link>
              <Link to="/contact-us" className={"btnBase border border-white text-white h-12 font-semibold"}>
                <ArrowCircleLeft className="size-6 stroke-white" />
                تماس با ما
              </Link>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-black/70 sm:bg-black/50" aria-hidden="true"></div>
        </div>

        <Swiper
          className={`w-full px-5 ${matches && "swiperBrand !px-5"}`}
          spaceBetween={56}
          slidesPerView="auto"
          modules={[Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
          loop={!matches ? true : false}
          allowTouchMove={false}
        >
          {carBrands.map((e, index) => (
            <SwiperSlide className={`!w-fit ${matches ? "!m-0" : ""}`} key={index}>
              <BaseImage src={e.icon} alt={e.label} className="object-contain w-20 h-20" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="Padding SpaceYCustom">
          <section aria-labelledby="why-us" className="relative h-[292px] w-full">
            <BaseImage src={BannerAbout} alt={`چرا ${import.meta.env.VITE_APP_NAME} ؟`} className="absolute top-0 left-0 object-cover w-full h-full rounded-2xl" />
            <div className="absolute flex flex-col items-center justify-start w-full space-y-3 -translate-x-1/2 top-5 left-1/2">
              <h2 id="why-us" className="text-2xl font-semibold text-center text-secondary">
                چــــــرا {import.meta.env.VITE_APP_NAME} ؟
              </h2>
              <p className="text-center md:text-lg px-5 text-white leading-[180%] w-full lg:w-[95%] xl:w-[82%] 2xl:w-[65%]">اجاره خودرو از یک شرکت اجاره خودرو با سابقه به شما کمک می‌کند تا در سفرها، جلسات و مراسم‌های خانوادگی ماشین مناسب در اختیار داشته باشید.</p>
            </div>
            {matches2 && (
              <div className="absolute left-1/2 -translate-x-1/2 flex flex-row justify-center gap-x-10 items-center -bottom-[35%]">
                {BannerAboutArray.map((e, index) => (
                  <article className="w-78 h-46.5 bg-white border border-neutral-gray-2 rounded-2xl py-4 px-6 flex flex-col justify-start items-center gap-y-3" key={index}>
                    <div className="p-3 border-2 rounded-xl border-primary">{e.icon}</div>
                    <h3 className="font-bold text-neutral-gray-10">{e.title}</h3>
                    <p className="text-xs font-medium text-center text-neutral-gray-9">{e.content}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
          {!matches2 && (
            <section className="flex flex-row flex-wrap items-center justify-center gap-3" aria-label="مزایای استفاده">
              {BannerAboutArray.map((e, index) => (
                <article className="w-78 h-46.5 bg-white border border-neutral-gray-2 rounded-2xl py-4 px-6 flex flex-col justify-start items-center gap-y-3" key={index}>
                  <div className="p-2 border-2 xs:p-3 rounded-xl border-primary">{e.icon}</div>
                  <h3 className="font-bold text-neutral-gray-10">{e.title}</h3>
                  <p className="text-xs font-medium text-center text-neutral-gray-9">{e.content}</p>
                </article>
              ))}
            </section>
          )}

          <section aria-labelledby="car-categories" className={`w-full ${matches3 ? "grid-cols-3 2xl:grid-cols-5 grid justify-items-center" : "flex flex-row flex-wrap justify-center"} gap-5`}>
            {CarTypes.map((e, index) => {
              const isSport = e.title === "اسپرت";
              return (
                <React.Fragment key={index}>
                  {isSport && matches3 && matches4 && <div className="w-60 h-36" />}

                  <div className="relative flex overflow-hidden bg-white border w-60 h-36 border-neutral-gray-2 rounded-2xl group">
                    <Link to="/product-list" className="z-10 flex flex-col items-center justify-start w-full h-full pt-3">
                      <h4 className="text-2xl font-bold text-neutral-gray-10">{e.title}</h4>
                      <BaseImage src={e.icon} alt="" className="w-[232px] h-25 object-contain" />
                    </Link>
                    <div className="absolute bottom-0 h-2 transition-all duration-300 -translate-x-1/2 rounded-t-lg bg-secondary left-1/2 w-52 group-hover:h-10"></div>
                  </div>
                </React.Fragment>
              );
            })}
          </section>

          <CarReservationHome />
          <Learn />
          <AccordionHome />
          <Comments />
          <BlogHome />
        </div>
      </main>
    </>
  );
};

export default Home;
