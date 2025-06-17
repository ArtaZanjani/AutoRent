import { useRef } from "react";
import { Swiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const CommentSliderSkeleton = ({ children }) => {
  const swiperRef = useRef(null);

  return (
    <Swiper
      className="w-full"
      modules={[Autoplay]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        900: { slidesPerView: 3 },
        1440: { slidesPerView: 4 },
        1920: { slidesPerView: 5 },
      }}
      loop={true}
      spaceBetween={20}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onTouchStart={() => swiperRef.current?.autoplay?.stop()}
      onTouchEnd={() => swiperRef.current?.autoplay?.start()}
    >
      {children}
    </Swiper>
  );
};

export default CommentSliderSkeleton;
