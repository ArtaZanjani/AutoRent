import { Image } from "iconsax-react";

const CardSkeleton = () => {
  return (
    <div className="w-full xs:w-[392px] h-[500px] animate-pulse bg-white border border-neutral-gray-2 rounded-2xl overflow-hidden p-3 flex flex-col justify-start items-center gap-y-3">
      <div className="w-full h-56 border border-neutral-gray-3 rounded-xl flex justify-center items-center overflow-hidden relative pointer-events-none p-0">
        <Image className="size-20 stroke-neutral-gray-3" />
      </div>

      <div className="w-40 ml-auto h-6 bg-neutral-gray-3 rounded" />
      <div className="w-60 ml-auto h-4 bg-neutral-gray-3 rounded" />

      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="w-full h-10 bg-neutral-gray-2 rounded-lg flex justify-between items-center p-2">
          <div className="w-16 h-4 bg-neutral-gray-5 rounded" />
          <div className="w-16 h-4 bg-neutral-gray-5 rounded" />
        </div>
      ))}

      <div className="w-full flex justify-between items-center px-2">
        <div className="w-16 h-4 bg-neutral-gray-4 rounded" />
        <div className="w-16 h-4 bg-neutral-gray-4 rounded" />
      </div>

      <div className="h-12 w-full rounded-lg bg-neutral-gray-3" />
    </div>
  );
};

export default CardSkeleton;
