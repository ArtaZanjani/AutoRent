import { useLocation, matchPath } from "react-router-dom";
import { getAppRoutes } from "@/utils/routes";
import { useEffect } from "react";

const SetTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const routes = getAppRoutes(() => {});

    const currentRoute = routes.find((route) => matchPath({ path: route.path, end: true }, location.pathname));

    if (currentRoute && currentRoute.title) {
      document.title = `${import.meta.env.VITE_APP_NAME} - ${currentRoute.title}`;
    } else {
      document.title = import.meta.env.VITE_APP_NAME;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return null;
};

export default SetTitle;
