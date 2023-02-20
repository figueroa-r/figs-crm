import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// import { useMatches } from 'react-router-dom'

// ----------------------------------------------------------------------

export default function ScrollToTop() {
  const { pathname } = useLocation();
  // const { pathname } = useMatches();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
