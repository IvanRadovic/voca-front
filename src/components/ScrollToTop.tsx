import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Always start a new page at the very top - never restore the previous
// scroll position. Runs before paint so there is no visible jump.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
