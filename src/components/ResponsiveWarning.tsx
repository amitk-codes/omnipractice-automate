import React, { useEffect, useState } from 'react';

const ResponsiveWarning: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsVisible(window.innerWidth < 720);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="responsive-warning">
      <div className="responsive-warning-content">
        <h2>Desktop View Required</h2>
        <p>This application is designed for desktop screens with a minimum width of 720px.</p>
        <p>Please access this tool from a device with a larger screen for the best experience.</p>
      </div>
    </div>
  );
};

export default ResponsiveWarning; 