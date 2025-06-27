import BaseSection from "@/components/common/BaseSection";
import { ArrowLeft2 } from "iconsax-react";
import BlogCard from "@/components/widget/BlogCard";
import useMediaQuery from "@/hooks/useMediaQuery";
import useGetData from "@/hooks/useGetData";
import { Link } from "react-router-dom";
import BlogCardSkeleton from "@/components/skeleton/BlogCardSkeleton";

const BlogHome = () => {
  const matches = useMediaQuery("(min-width:888px)");

  const { data: blog, loading } = useGetData("blog?select=*&order=publishDate.desc,views.desc&limit=4");

  return (
    <BaseSection className="space-y-10" description="مقالات ما" title="مجله" highlight="خودرو">
      <Link to="/blog" className={`btnBase btn-none-primary group !p-0 ${matches ? "mr-auto" : "mx-auto mb-10"}`}>
        مشاهده همه
        <ArrowLeft2 className="size-5 stroke-primary group-hover:stroke-primary-shade-3" />
      </Link>

      {blog?.length > 0 ? <div className={`flex flex-row ${matches ? "justify-between" : "justify-center"} items-center gap-6 flex-wrap w-full`}>{loading ? Array.from({ length: 4 }).map((_, index) => <BlogCardSkeleton key={index} />) : blog?.map((e) => <BlogCard key={e.id} blog={e} />)}</div> : <p>مقاله‌ای در دسترس نیست.</p>}
    </BaseSection>
  );
};

export default BlogHome;
