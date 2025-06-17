import React, { useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useLocation, useNavigate } from "react-router-dom";
import useScrollBody from "@/hooks/useScrollBody";
import FetchErrorComp from "@/components/common/FetchErrorComp";

const FetchError = () => {
  const { clearErrors } = useError();
  const { setIsScrolling } = useScrollBody();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/fetcherror") {
      setIsScrolling(false);
    }
  }, [location.pathname, setIsScrolling]);

  const handleGoBack = () => {
    clearErrors();
    navigate("/");
  };

  return <FetchErrorComp refetch={handleGoBack} />;
};

export default FetchError;
