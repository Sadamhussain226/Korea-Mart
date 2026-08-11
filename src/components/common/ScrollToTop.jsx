import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Cache scroll positions in memory per path + query
const scrollPositions = new Map();

export function ScrollToTop() {
  const { pathname, search, key } = useLocation();
  const navType = useNavigationType();
  const locationKey = `${pathname}${search}`;

  // Continuously record scroll position for current route
  useEffect(() => {
    const saveScroll = () => {
      if (window.scrollY !== undefined) {
        scrollPositions.set(locationKey, {
          x: window.scrollX || 0,
          y: window.scrollY || 0
        });
      }
    };

    // Save on scroll & before navigate
    window.addEventListener('scroll', saveScroll, { passive: true });
    return () => {
      saveScroll();
      window.removeEventListener('scroll', saveScroll);
    };
  }, [locationKey]);

  useEffect(() => {
    // Enable manual scroll restoration control
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (navType === 'POP') {
      // Restore previous scroll position on Back / Forward browser navigation
      const savedPos = scrollPositions.get(locationKey);
      if (savedPos) {
        const restore = () => {
          window.scrollTo({
            top: savedPos.y,
            left: savedPos.x,
            behavior: 'instant'
          });
        };

        restore();

        // Multi-frame backup to handle lazy loaded / async rendered content
        const rafId = requestAnimationFrame(restore);
        const timer1 = setTimeout(restore, 40);
        const timer2 = setTimeout(restore, 120);

        return () => {
          cancelAnimationFrame(rafId);
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } else {
      // On PUSH or REPLACE (New page navigation), scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname, search, key, navType, locationKey]);

  return null;
}
