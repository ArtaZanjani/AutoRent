import React, { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchNormal1, Clock, Eye } from "iconsax-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import BaseImage from "@/components/common/BaseImage";
import BlogCard from "@/components/widget/BlogCard";
import useMediaQuery from "@/hooks/useMediaQuery";
import BlogCardSkeleton from "@/components/skeleton/BlogCardSkeleton";
import FetchErrorComp from "@/components/common/FetchErrorComp";

const fetchBlogs = async ({ pageParam = 1 }) => {
  try {
    const offset = (pageParam - 1) * 4;
    const res = await fetch(`${import.meta.env.VITE_API_URL}blog?limit=4&offset=${offset}&order=publishDate.desc,views.desc`, {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqdWhzd2huZGZwanV6dGphYmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzgyNDAsImV4cCI6MjA2NjU1NDI0MH0.pNAixwBCETl9h7PyDhjJFpNwZDfSHLRbzFK5YJ9M0so",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();

    return {
      data,
      nextPage: pageParam + 1,
    };
  } catch (error) {
    console.error("Fetch blogs error:", error);
    throw error;
  }
};

const Blog = () => {
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const matches = useMediaQuery("(min-width: 888px)");
  const matches2 = useMediaQuery("(min-width: 1280px)");
  const matches3 = useMediaQuery("(max-width: 1427px)");

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
    getNextPageParam: (lastPage) => {
      return lastPage.data.length === 4 ? lastPage.nextPage : undefined;
    },
  });

  const blogs = useMemo(() => {
    const allBlogs = data?.pages.flatMap((page) => page.data) || [];
    const seen = new Set();
    return allBlogs.filter((blog) => {
      if (seen.has(blog.id)) return false;
      seen.add(blog.id);
      return true;
    });
  }, [data]);

  const filteredBlogs = useMemo(() => {
    if (!value.trim()) return blogs;
    const lower = value.toLowerCase();
    return blogs.filter((b) => b.title?.toLowerCase().includes(lower) || b.summary?.toLowerCase().includes(lower));
  }, [value, blogs]);

  const sortedBlogs = useMemo(() => {
    return [...blogs].sort((a, b) => {
      const dateA = new Date(a.publishDate);
      const dateB = new Date(b.publishDate);
      if (dateB - dateA !== 0) return dateB - dateA;
      return (b.views || 0) - (a.views || 0);
    });
  }, [blogs]);

  const onImageError = (id) => {
    setErrorList((prev) => [...new Set([...prev, id])]);
  };

  if (isError) {
    return <FetchErrorComp refetch={refetch} />;
  }
  return (
    <main className="w-full min-h-screen">
      <Breadcrumbs title="جزئیات محصول" crumbs={[{ path: "/blog", title: "مقالات" }]} />

      <div className="flex flex-col-reverse items-start w-full gap-6 xl:flex-row Padding">
        <div className="flex-1 xl:flex-2">
          {isLoading ? (
            <div className={`w-full flex flex-row ${matches ? "justify-between" : "justify-center"} flex-wrap items-start gap-x-6 gap-y-4`}>
              {Array.from({ length: 4 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <>
              <div className={`w-full flex flex-row ${matches ? "justify-between" : "justify-center"} flex-wrap items-start gap-x-6 gap-y-4`}>
                {filteredBlogs.map((blog) => (
                  <BlogCard blog={blog} key={blog.id} />
                ))}

                {isFetchingNextPage && Array.from({ length: 4 }).map((_, index) => <BlogCardSkeleton key={index} />)}
              </div>

              {hasNextPage && (
                <button onClick={() => fetchNextPage()} className={`btnBase btn-fill-primary h-11 px-4 mt-8 ${matches2 && matches3 ? "" : "mx-auto"}`} disabled={isFetchingNextPage}>
                  مشاهده بیشتر
                </button>
              )}
            </>
          ) : (
            <p className="mt-4 text-center text-gray-400">مقاله‌ای یافت نشد.</p>
          )}
        </div>

        <div className="w-full space-y-6 xl:flex-1 xl:w-fit">
          <div className="relative w-full">
            <label className={`absolute transition-all pointer-events-none right-2 bg-white px-2 ${focus || value.length > 0 ? "text-sm -top-2.5 translate-y-0 text-neutral-gray-10" : "top-1/2 text-neutral-gray-5 text-base -translate-y-1/2"}`}>جستجو در سایت اجاره خودرو اتورنت</label>
            <input value={value} type="text" className={`w-full text-sm font-medium inpBase !rounded-2xl h-14 bg-white border transition-all ${focus || value.length > 0 ? "border-neutral-gray-10" : "border-neutral-gray-4"}`} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onChange={(e) => setValue(e.target.value)} />
            <div className="absolute left-0 px-3 -translate-y-1/2 pointer-events-none top-1/2">
              <SearchNormal1 className={`size-6 stroke-neutral-gray-5 transition-all ${focus || value.length > 0 ? "stroke-neutral-gray-10" : "stroke-neutral-gray-5"}`} />
            </div>
          </div>

          <div className="w-full h-[568px] border border-neutral-gray-4 shadow-2xl rounded-2xl p-4 !pb-16 overflow-hidden">
            <h1 className="text-2xl font-black text-neutral-gray-10">آخرین مقالات</h1>

            {isLoading ? (
              <div className="flex flex-col justify-between h-full mt-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div className={`w-full animate-pulse rounded-xl flex items-center p-2 gap-x-3.5 border border-neutral-gray-3`} key={index}>
                    <div className="w-20.5 h-20.5 rounded-lg overflow-hidden bg-neutral-gray-3"></div>

                    <div className="flex-1 space-y-3">
                      <div className="w-3/4 h-4 rounded bg-neutral-gray-3"></div>
                      <div className="flex items-center gap-x-4">
                        <div className="flex items-center gap-x-2">
                          <Clock className="size-5 stroke-neutral-gray-6" />
                          <div className="w-10 h-3 rounded bg-neutral-gray-3"></div>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <Eye className="size-5 stroke-neutral-gray-6" />
                          <div className="w-10 h-3 rounded bg-neutral-gray-3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedBlogs.length > 0 ? (
              <div className="flex flex-col justify-between h-full mt-4">
                {sortedBlogs.slice(0, 4).map((blog, index) => (
                  <div key={blog?.id} className={`w-full p-2 ${index !== sortedBlogs.length - 1 && "border-b border-neutral-gray-3"}`}>
                    <Link to={`/blog/${blog?.id}`} className="w-full h-full flex items-center gap-x-3.5">
                      <div className={`w-20.5 h-20.5 rounded-lg overflow-hidden ${errorList.includes(blog?.id) ? "bg-primary/10 px-1" : ""}`}>
                        <BaseImage src={blog.image} alt={blog.title} onError={() => onImageError(blog?.id)} className={`w-full h-full ${errorList.includes(blog?.id) ? "object-contain" : "object-cover"}`} />
                      </div>

                      <div className="flex-1 space-y-3">
                        <p className="text-sm font-medium text-neutral-gray-9 line-clamp-2">{blog?.title}</p>
                        <div className="flex items-center gap-x-4">
                          <div className="flex items-center gap-x-2">
                            <Clock className="size-5 stroke-neutral-gray-6" />
                            <p className="text-sm text-neutral-gray-6">{blog?.reading_time}</p>
                          </div>
                          <div className="flex items-center gap-x-2">
                            <Eye className="size-5 stroke-neutral-gray-6" />
                            <p className="text-sm text-neutral-gray-6">{blog?.views?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-center text-gray-400">مقاله‌ای یافت نشد.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Blog;
