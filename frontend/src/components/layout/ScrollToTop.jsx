import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls to the top of the window when the location changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
