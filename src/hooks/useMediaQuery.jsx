import { useState, useEffect } from "react";

function useMediaQuery(query, defaultMatches = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return defaultMatches;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!query || typeof window === "undefined" || !window.matchMedia) {
      setMatches(defaultMatches);
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    const listener = (event) => {
      setMatches(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener);
    } else {
      mediaQueryList.addListener(listener);
    }

    setMatches(mediaQueryList.matches);

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query, defaultMatches]);

  return matches;
}

export default useMediaQuery;
