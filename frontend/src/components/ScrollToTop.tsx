import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * ScrollToTop Component
 * 
 * Manages window scroll behavior across route transitions in React Router:
 * 1. PUSH / REPLACE navigation (clicking product cards, navbar links, related products):
 *    Resets window scroll position to (0, 0) immediately.
 * 2. POP navigation (Browser Back / Forward buttons):
 *    Allows the browser's native history scroll restoration to handle returning to the previous position.
 * 3. Search / Query updates on the same pathname (e.g. toggling filters on /products):
 *    Does not reset scroll position so users can filter seamlessly without page jumps.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Enable browser history scroll restoration for Back/Forward actions
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }
  }, []);

  useEffect(() => {
    // Only scroll to top if pathname actually changed and it's not a back/forward (POP) action
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      if (navType !== "POP") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  }, [pathname, navType]);

  return null;
}
