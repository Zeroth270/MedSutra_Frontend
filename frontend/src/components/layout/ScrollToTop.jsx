import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls to the top of the window when the location changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Wrap in a short timeout to ensure the new page content has rendered
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
  }, [pathname]);

  return null;
}
