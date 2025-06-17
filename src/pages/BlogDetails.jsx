import BaseImage from "@/components/common/BaseImage";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import useFetch from "@/hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Calendar } from "iconsax-react";
import { useEffect } from "react";

const BlogDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useFetch(["blog", id], `/blog/${id}`);
  const navigate = useNavigate();

  const dataMap = [
    {
      icon: <Clock className="size-6 stroke-neutral-gray-11" />,
      value: `زمان مطالعه: ${data?.reading_time}`,
    },
    {
      icon: <Calendar className="size-6 stroke-neutral-gray-11" />,
      value: new Date(data?.publishDate).toLocaleDateString("fa-IR"),
    },
  ];

  useEffect(() => {
    if (isError) {
      navigate("/blog");
    }
  }, [isError, navigate]);

  function randomWidth() {
    const widths = [60, 70, 75, 80, 85, 90, 95];
    const random = widths[Math.floor(Math.random() * widths.length)];
    return `${random}%`;
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen">
        <Breadcrumbs
          title={data?.title}
          crumbs={[
            { path: "/blog", title: "مقالات" },
            { path: null, title: id },
          ]}
        />

        <div className="w-full Padding flex flex-col gap-y-4 animate-pulse">
          <div className="h-[48px] w-3/4 bg-neutral-gray-3 rounded-md"></div>

          <div className="w-full flex items-center gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div className="flex items-center gap-x-2.5" key={index}>
                <div className="h-5 w-5 rounded bg-neutral-gray-3"></div>
                <div className="h-4 w-20 rounded bg-neutral-gray-3"></div>
              </div>
            ))}
          </div>

          <div className="w-full h-[386px] bg-neutral-gray-3 rounded-2xl"></div>

          <div className="space-y-8 w-full">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="flex flex-col gap-y-4" key={index}>
                <div className="h-[40px] w-1/2 bg-neutral-gray-3 rounded"></div>
                <div className="h-4 bg-neutral-gray-3 rounded" style={{ width: randomWidth() }}></div>
                <div className="h-4 bg-neutral-gray-3 rounded" style={{ width: randomWidth() }}></div>
                <div className="h-4 bg-neutral-gray-3 rounded" style={{ width: randomWidth() }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen">
      <Breadcrumbs
        title={data?.title}
        crumbs={[
          { path: "/blog", title: "مقالات" },
          { path: null, title: id },
        ]}
      />

      <div className="w-full Padding flex flex-col gap-y-4">
        <h2 className="font-bold text-neutral-gray-11 text-[clamp(1.75rem,4vw,2.75rem)]">{data?.title}</h2>

        <div className="w-full flex items-center gap-6">
          {dataMap.map((e, index) => (
            <div className="flex items-center gap-x-2.5" key={index}>
              <div>{e.icon}</div>
              <p className="text-neutral-gray-8 text-sm font-medium">{e.value}</p>
            </div>
          ))}
        </div>

        <BaseImage src={`${import.meta.env.VITE_API_BLOGS_IMAGE}${data?.image}`} className="w-full h-[386px] object-cover rounded-2xl" />

        <div className="space-y-8 w-full">
          {data?.mainDescription?.map((e, index) => (
            <div className="flex flex-col gap-y-4" key={index}>
              <strong className="text-[clamp(1.75rem,4vw,2.75rem)] text-neutral-gray-11">{e.title}</strong>

              <p className="text-neutral-gray-9 text-base font-medium leading-loose">{e.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BlogDetails;
