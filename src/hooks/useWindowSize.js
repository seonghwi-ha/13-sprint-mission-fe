import { useState, useEffect } from 'react';

/**
 * 현재 윈도우 너비를 반환하는 커스텀 훅
 */
function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

export default useWindowSize;
