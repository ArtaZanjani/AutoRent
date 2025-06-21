import { Star1, Image } from "iconsax-react";
import React from "react";

const ProductDetailSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-full xl:flex-row gap-x-6 xl:items-start Padding animate-pulse">
      <div className="flex flex-col w-full sm:flex-1 gap-y-5">
        <div className="flex flex-col items-center justify-center w-full h-32 p-6 bg-white border border-neutral-gray-2 gap-y-3 rounded-2xl">
          <div className="flex items-center justify-between w-full">
            <div className="w-40 h-8 rounded-lg bg-neutral-gray-2"></div>

            <div className="flex items-center gap-x-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star1 key={`star-${index}`} className="size-6 stroke-neutral-gray-2" />
              ))}
            </div>
          </div>

          <hr className="w-full border border-neutral-gray-2" />

          <div className="flex w-full items-center gap-x-2.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className={`${index === 0 ? "w-41" : index === 1 ? "w-35" : "w-36"} h-8 bg-neutral-gray-2 rounded-lg flex items-center p-1.5`} key={`width-div-${index}`}>
                <div className="h-full w-[70%] bg-neutral-gray-3 rounded-sm"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-[503px] flex justify-center items-center bg-white border border-neutral-gray-2 rounded-2xl">
          <Image className="size-20 stroke-neutral-gray-6" />
        </div>

        <div className="flex flex-col items-center justify-center w-full px-6 pt-3 pb-4 bg-white border border-neutral-gray-2 gap-y-3 rounded-2xl">
          <div className="flex items-center justify-between w-full">
            <div className="w-40 h-8 rounded-lg bg-neutral-gray-2"></div>
          </div>

          <hr className="w-full border border-neutral-gray-2" />

          <div className="flex flex-col w-full gap-y-2">
            {Array.from({ length: 6 }).map((_, outerIndex) => (
              <React.Fragment key={`frag-${outerIndex}`}>
                <div className="flex items-center justify-between w-full gap-x-10">
                  {Array.from({ length: 3 }).map((_, innerIndex) => (
                    <div className="flex-1 h-10 rounded-md bg-neutral-gray-2" key={`inner-div-${outerIndex}-${innerIndex}`}></div>
                  ))}
                </div>
                {outerIndex !== 5 && <hr className="w-full border border-neutral-gray-2" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full px-6 pt-3 pb-4 bg-white border border-neutral-gray-2 gap-y-3 rounded-2xl">
          <div className="flex items-center justify-between w-full">
            <div className="w-40 h-8 rounded-lg bg-neutral-gray-2"></div>
          </div>

          <hr className="w-full border border-neutral-gray-2" />

          <div className="flex flex-col flex-wrap justify-start w-full gap-5 sm:flex-row sm:items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="flex items-center h-10 p-1 rounded-md w-39 bg-neutral-gray-2 gap-x-1" key={`grid-item-${index}`}>
                <div className="w-8 h-8 rounded-sm bg-neutral-gray-4"></div>

                <div className="flex-1 space-y-1">
                  <div className="w-[30%] h-3 bg-neutral-gray-4 rounded-xs" key={`bar1-${index}`}></div>
                  <div className="w-[70%] h-3 bg-neutral-gray-4 rounded-xs" key={`bar2-${index}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full px-6 pt-3 pb-4 bg-white border border-neutral-gray-2 gap-y-3 rounded-2xl">
          <div className="flex items-center justify-between w-full">
            <div className="w-40 h-8 rounded-lg bg-neutral-gray-2"></div>
          </div>

          <hr className="w-full border border-neutral-gray-2" />

          <div className="flex flex-col w-full gap-y-2">
            <div className="h-8 rounded-lg w-60 bg-neutral-gray-2"></div>

            <div className="flex flex-col w-full h-fit gap-y-1">
              {Array.from({ length: 10 }).map((_, index) => {
                const randomWidth = Math.floor(Math.random() * (90 - 30 + 1)) + 30;
                return <div className="h-1 bg-neutral-gray-2" key={`pulse-bar-${index}`} style={{ width: `${randomWidth}%` }}></div>;
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full px-6 pt-3 pb-4 bg-white border border-neutral-gray-2 gap-y-3 rounded-2xl">
          <div className="flex items-center justify-between w-full">
            <div className="w-40 h-8 rounded-lg bg-neutral-gray-2"></div>
          </div>

          <hr className="w-full border border-neutral-gray-2" />

          <div className="w-full h-fit border border-neutral-gray-2 rounded-xl flex flex-col justify-center p-3 items-start gap-y-2.5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-x-3">
                <div className="w-10 h-10 rounded-sm bg-neutral-gray-2"></div>
                <div className="w-40 h-10 rounded-lg bg-neutral-gray-2"></div>
              </div>

              <div className="w-10 h-10 rounded-lg bg-neutral-gray-2"></div>
            </div>

            <div className="w-full h-full">
              <div className="w-[60%] mt-4 h-1 bg-neutral-gray-2"></div>
              <div className="w-[70%] mt-4 h-1 bg-neutral-gray-2"></div>
              <div className="w-[80%] mt-4 h-1 bg-neutral-gray-2"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center flex-1 p-6 border gap-y-6 bg-neutral-gray-2 border-neutral-gray-2 rounded-2xl">
        <div className="w-full flex gap-x-2.5">
          {Array.from({ length: 2 }).map((e, index) => (
            <div className="flex-1 h-8.5 bg-neutral-gray-4 rounded-lg" key={index}></div>
          ))}
        </div>

        {Array.from({ length: 6 }).map((_, index) => (
          <div className="w-full h-12 bg-neutral-gray-4 rounded-xl" key={index}></div>
        ))}

        <div className="flex items-center justify-between w-full">
          <div className="w-20 h-4 rounded-md bg-neutral-gray-4"></div>

          <div className="flex gap-x-6">
            <div className="w-10 h-4 rounded-md bg-neutral-gray-4"></div>
            <div className="w-10 h-4 rounded-md bg-neutral-gray-4"></div>
          </div>
        </div>

        <div className="w-full h-12 bg-neutral-gray-4 rounded-xl"></div>

        <div className="flex items-center justify-center w-full h-12 p-2 bg-neutral-gray-4 rounded-xl">
          <div className="w-full h-full rounded-md bg-neutral-gray-8"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
