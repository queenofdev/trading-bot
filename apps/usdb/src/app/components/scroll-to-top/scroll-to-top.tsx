import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = (): JSX.Element => {
  const routePath = useLocation();
  const onTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    onTop();
  }, [routePath]);

  return <></>;
};
