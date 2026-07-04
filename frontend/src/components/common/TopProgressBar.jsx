import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './TopProgressBar.css';

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

const TopProgressBar = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    
    // In a real app with data fetching per route, this would tie into the router loader.
    // For now, we simulate the finish of navigation.
    const timer = setTimeout(() => {
      NProgress.done();
    }, 500);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
};

export default TopProgressBar;
