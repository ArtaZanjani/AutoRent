const BlogCardSkeleton = () => {
  return (
    <article className="w-full xs:w-98 h-92.5 bg-white border border-neutral-gray-2 rounded-2xl overflow-hidden animate-pulse">
      <div className="flex flex-col items-center justify-between w-full h-full p-4">
        <div className="w-full h-49 rounded-xl bg-neutral-gray-3" />

        <div className="w-full mt-4 rounded h-7 bg-neutral-gray-3" />

        <div className="w-full h-4 mt-2 rounded bg-neutral-gray-3" />
        <div className="w-[60%] h-4 bg-neutral-gray-3 rounded mt-1 sm:block hidden ml-auto" />

        <div className="flex items-center justify-between w-full mt-4">
          <div className="w-20 h-4 rounded bg-neutral-gray-3" />
          <div className="w-20 h-4 rounded bg-neutral-gray-3" />
          <div className="w-20 h-4 rounded bg-neutral-gray-3" />
        </div>
      </div>
    </article>
  );
};

export default BlogCardSkeleton;
