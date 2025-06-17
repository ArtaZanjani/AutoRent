import { useEffect, useState } from "react";
import BaseSection from "@/components/common/BaseSection";
import { Star1 } from "iconsax-react";
import { User } from "@/svg/CustomIcon";
import BaseImage from "@/components/common/BaseImage";
import useGetData from "@/hooks/useGetData";
import CommentSliderSkeleton from "@/components/skeleton/CommentSliderSkeleton";
import { SwiperSlide } from "swiper/react";

const Comments = () => {
  const { data: comments, loading } = useGetData(`${import.meta.env.VITE_API_URL}/comments?_expand=user&_limit=10`);

  const [activeId, setActiveId] = useState(false);

  useEffect(() => {
    if (comments?.length > 0) {
      setActiveId(comments[0].id);
    }
  }, [comments]);

  const [errorList, setErrorList] = useState([]);

  const fincById = comments?.find((e) => e.id === activeId);

  return (
    <BaseSection description="آنچه مشتریان ما درموردمان گفته‌اند." title="نظرات" highlight="مشتریان">
      {loading || !fincById ? (
        <div className="w-full flex flex-col justify-start items-center gap-y-5 mt-6 animate-pulse">
          <div className="w-full min-h-[391px] bg-white border border-neutral-gray-2 rounded-2xl py-4 flex flex-col justify-start items-center gap-y-5">
            <div className="w-34 h-34 rounded-full bg-neutral-gray-3" />

            <div className="w-32 h-5 bg-neutral-gray-3 rounded" />

            <div className="flex flex-row justify-center items-center gap-x-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star1 key={index} className={`size-6 fill-neutral-gray-3`} />
              ))}
            </div>

            <div className="w-full md:w-[80%] lg:w-[70%] xl:w-[50%] px-5 md:px-0 flex flex-col items-center">
              <div className="w-full h-4 bg-neutral-gray-3 rounded mb-2" />
              <div className="w-5/6 h-4 bg-neutral-gray-3 rounded mb-2" />
              <div className="w-2/3 h-4 bg-neutral-gray-3 rounded" />
            </div>
          </div>

          <CommentSliderSkeleton>
            {Array.from({ length: 10 }).map((_, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-24 flex flex-row gap-x-3 items-center border border-neutral-gray-2 p-4 rounded-2xl bg-white">
                  <div className="w-16 h-16 rounded-full bg-neutral-gray-3" />

                  <div className="flex flex-col justify-center gap-y-2 flex-1">
                    <div className="w-24 h-4 bg-neutral-gray-3 rounded" />
                    <div className="w-20 h-3 bg-neutral-gray-3 rounded" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </CommentSliderSkeleton>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-start items-center gap-y-5 mt-6">
          {comments?.length > 0 ? (
            <>
              <div className="w-full min-h-[391px] bg-white border border-neutral-gray-2 rounded-2xl py-4 flex flex-col justify-start items-center gap-y-5">
                <div className={`w-34 h-34 rounded-full overflow-hidden pointer-events-none`}>{errorList.includes(activeId) ? <User width="100%" height="100%" /> : <BaseImage src={`${import.meta.env.VITE_API_PROFILE_IMAGE}${fincById.user?.avatar_url}`} alt={fincById?.user?.name} className="w-full h-full object-cover" onError={() => setErrorList((prev) => [...prev, fincById?.id])} />}</div>

                <p className={`font-semibold`}>{fincById?.user?.name}</p>

                <div className="flex flex-row justify-center items-center gap-x-3" dir="ltr">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star1 key={index} className={`size-6 ${index < (fincById?.rate || 0) ? "fill-yellow-400" : "fill-neutral-gray-2"}`} />
                  ))}
                </div>

                <p className="text-neutral-gray-7 flex-1 text-center text-sm font-medium px-5 md:px-0 w-full md:w-[80%] lg:w-[70%] xl:w-[50%] leading-relaxed">{fincById?.comment}</p>
              </div>

              <div className="w-full flex flex-row justify-between items-center">
                <CommentSliderSkeleton>
                  {comments?.map((e) => (
                    <SwiperSlide key={e.id}>
                      <div onClick={() => setActiveId(e.id)} className={`w-full h-24 flex flex-row justify-start gap-x-3 items-center transition-all border border-neutral-gray-2 p-4 rounded-2xl ${activeId === e.id ? "bg-secondary" : "bg-white"}`}>
                        <div className="w-16 h-16 rounded-full overflow-hidden flex justify-center items-center bg-neutral-gray-2">{errorList.includes(e.id) ? <User width="100%" height="100%" /> : <BaseImage src={`${import.meta.env.VITE_API_PROFILE_IMAGE}${e.user?.avatar_url}`} alt={e.user?.name} className="w-full h-full object-cover" onError={() => setErrorList((prev) => [...prev, e.id])} />}</div>

                        <div className="space-y-2 text-start">
                          <p className="text-neutral-gray-11 font-medium">
                            {e.user?.fName} {e.user?.lName}
                          </p>
                          <p className="text-neutral-gray-9 text-sm">{new Date(e.publish_date).toLocaleDateString("fa-IR")}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </CommentSliderSkeleton>
              </div>
            </>
          ) : (
            <p className="text-lg">کامنتی برای نمایش وجود نداره</p>
          )}
        </div>
      )}
    </BaseSection>
  );
};

export default Comments;
