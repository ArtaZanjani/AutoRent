const BaseSection = ({ title, highlight = "", description = "", children, highlightFirst = true, className = "" }) => {
  return (
    <section className={`w-full flex flex-col items-center justify-start ${className}`}>
      <div className="space-y-4 text-center">
        {description && <p className="text-neutral-gray-8 text-2xl">{description}</p>}
        {title && (
          <h2 className="font-bold text-[32px] text-neutral-gray-10">
            {highlightFirst ? (
              <>
                {title} <span className="text-secondary-shade-1 font-bold text-[32px]">{highlight}</span>
              </>
            ) : (
              <>
                <span className="text-secondary-shade-1 font-bold text-[32px]">{highlight}</span> {title}
              </>
            )}
          </h2>
        )}
      </div>
      {children}
    </section>
  );
};

export default BaseSection;
