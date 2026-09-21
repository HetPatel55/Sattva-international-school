import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to the top on page change, or to #section when the URL has a hash.
// Pages are lazy-loaded, so the target may take a moment to appear.
const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    let tries = 0;
    let timer;
    const seek = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (tries++ < 20) {
        timer = setTimeout(seek, 100);
      }
    };
    seek();
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
};

export default ScrollManager;
