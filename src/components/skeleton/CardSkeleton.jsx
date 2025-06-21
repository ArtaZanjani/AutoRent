import { Image } from "iconsax-react";

const CardSkeleton = () => {
  return (
    <div className="w-full xs:w-[392px] h-[500px] animate-pulse bg-white border border-neutral-gray-2 rounded-2xl overflow-hidden p-3 flex flex-col justify-start items-center gap-y-3">
      <div className="relative flex items-center justify-center w-full h-56 p-0 overflow-hidden border pointer-events-none border-neutral-gray-3 rounded-xl">
        <Image className="size-20 stroke-neutral-gray-3" />
      </div>

      <div className="w-40 h-6 ml-auto rounded bg-neutral-gray-3" />
      <div className="h-4 ml-auto rounded w-60 bg-neutral-gray-3" />

      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between w-full h-10 p-2 rounded-lg bg-neutral-gray-2">
          <div className="w-16 h-4 rounded bg-neutral-gray-5" />
          <div className="w-16 h-4 rounded bg-neutral-gray-5" />
        </div>
      ))}

      <div className="flex items-center justify-between w-full px-2">
        <div className="w-16 h-4 rounded bg-neutral-gray-4" />
        <div className="w-16 h-4 rounded bg-neutral-gray-4" />
      </div>

      <div className="w-full h-12 rounded-lg bg-neutral-gray-3" />
    </div>
  );
};

export default CardSkeleton;
