import { useEffect, useState } from "react";

const useScrollBody = () => {
  const [isScrolling, setIsScrolling] = useState(true);

  useEffect(() => {
    document.body.style.overflowY = isScrolling ? "auto" : "hidden";
    document.body.style.touchAction = isScrolling ? "auto" : "none";
  }, [isScrolling]);

  return { setIsScrolling };
};

export default useScrollBody;
