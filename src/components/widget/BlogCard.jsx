import { Clock, Eye, Calendar } from "iconsax-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BaseImage from "@/components/common/BaseImage";
import Logo from "@/assets/icons/Logo.webp";

const BlogCard = ({ blog }) => {
  const { id, image = Logo, title = "", description = "", publishDate = "", reading_time = "", views = 0 } = blog || {};

  const [imageError, setImageError] = useState(false);

  const infoItems = [
    {
      icon: <Calendar className="size-5 stroke-neutral-gray-9" />,
      label: new Date(publishDate).toLocaleDateString("fa-IR"),
      key: "date",
      itemProp: "datePublished",
    },
    {
      icon: <Clock className="size-5 stroke-neutral-gray-9" />,
      label: reading_time,
      key: "readingTime",
    },
    {
      icon: <Eye className="size-5 stroke-neutral-gray-9" />,
      label: `${views.toLocaleString()} بازدید`,
      key: "views",
    },
  ];

  const metaData = [
    { tag: "meta", props: { itemProp: "mainEntityOfPage", content: `/blog/${id}` } },
    { tag: "meta", props: { itemProp: "image", content: `${import.meta.env.VITE_API_BLOGS_IMAGE}${image}` } },
    { tag: "meta", props: { itemProp: "dateModified", content: publishDate } },
    {
      tag: "span",
      props: { itemProp: "author", itemScope: true, itemType: "https://schema.org/Person", hidden: true },
      children: [{ tag: "meta", props: { itemProp: "name", content: "Autorent" } }],
    },
    {
      tag: "span",
      props: { itemProp: "publisher", itemScope: true, itemType: "https://schema.org/Organization", hidden: true },
      children: [{ tag: "meta", props: { itemProp: "name", content: "Autorent" } }],
    },
  ];

  const renderMeta = ({ tag, props, children }, index) => {
    if (tag === "meta") return <meta key={index} {...props} />;
    if (tag === "span")
      return (
        <span key={index} {...props}>
          {children?.map((child, i) => renderMeta(child, `${index}-${i}`))}
        </span>
      );
    return null;
  };

  return (
    <article itemScope itemType="https://schema.org/Article" className="w-full xs:w-98 h-92.5 bg-white border border-neutral-gray-2 rounded-2xl overflow-hidden">
      <Link to={`/blog/${id}`} className="no-underline text-inherit w-full h-full flex flex-col justify-between items-center p-4" itemProp="url">
        <div className={`w-full h-49 rounded-xl overflow-hidden relative ${imageError ? "p-10 bg-primary/20" : ""}`}>
          <BaseImage src={`${import.meta.env.VITE_API_BLOGS_IMAGE}${image}`} alt={title} className={`w-full h-full ${imageError ? "object-contain" : "object-cover"}`} onError={() => setImageError(true)} />
        </div>

        <h2 className="font-medium text-neutral-gray-11 w-full" itemProp="headline">
          {title}
        </h2>

        <p className="text-xs text-neutral-gray-9 font-medium leading-relaxed line-clamp-1 sm:line-clamp-2 w-full" itemProp="description">
          {description}
        </p>

        {metaData.map(renderMeta)}

        <div className="flex items-center justify-between text-xs text-neutral-gray-6 w-full">
          {infoItems.map(({ icon, label, key, itemProp }) => (
            <span key={key} {...(itemProp ? { itemProp } : {})} className="flex text-sm items-center gap-1 text-neutral-gray-9">
              {icon}
              {label}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
