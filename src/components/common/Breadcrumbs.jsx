import { Link } from "react-router-dom";
import Page_Screen from "@/assets/icons/page screen.webp";
import BaseImage from "@/components/common/BaseImage";
import { ArrowLeft2 } from "iconsax-react";
import React from "react";

const Breadcrumbs = ({ title = "", crumbs = [] }) => {
  return (
    <div className="text-sm h-[400px] relative flex justify-center items-center mb-14">
      <BaseImage src={Page_Screen} alt="Page_Screen" className="absolute top-0 left-0 z-0 object-cover w-full h-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-white gap-y-3">
        <h1 className="text-secondary text-center line-clamp-2 text-2xl px-1 sm:text-[32px] font-bold">{title}</h1>

        <div className="flex flex-wrap items-center gap-x-1">
          <Link to="/" className="text-white hover:text-secondary">
            {import.meta.env.VITE_APP_NAME || "خانه"}
          </Link>

          {crumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span>
                <ArrowLeft2 className="size-6 stroke-white" />
              </span>
              {index === crumbs.length - 1 ? (
                <span className="text-white">{crumb.title}</span>
              ) : (
                <Link to={crumb.path} className="text-white hover:text-secondary">
                  {crumb.title}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
