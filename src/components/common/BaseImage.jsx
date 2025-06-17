import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Logo from "@/assets/icons/Logo.webp";

const BaseImage = ({ src, alt, fallback = Logo, className = "w-full h-full object-contain", lazyLoad = true, animationDuration = 0.5, onError, ...rest }) => {
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const imgRef = useRef();

  useEffect(() => {
    if (!lazyLoad) return;

    const observer = new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [lazyLoad]);

  const handleError = (e) => {
    setHasError(true);
    onError && onError(e);
  };

  return <motion.img ref={imgRef} src={hasError ? fallback : src} alt={alt} onError={handleError} initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: animationDuration }} loading={lazyLoad ? "lazy" : "eager"} className={`pointer-events-none ${className}`} {...rest} />;
};

export default BaseImage;
