import React, { useEffect, useState } from 'react';
import Confetti from 'react-dom-confetti';

const ConfettiComponent: React.FC<{ active: boolean }> = ({ active }) => {
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    if (active) {
      setConfettiActive(true);

      // Disable confetti after a short delay
      const timeout = setTimeout(() => {
        setConfettiActive(false);
      }, 8000); // Adjust the duration as needed

      return () => clearTimeout(timeout);
    }
  }, [active]);

  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 400,
    elementCount: 700,
    dragFriction: 0.50,
    duration: 8000,
    stagger: 30,
    width: '100px',
    height: '100px',
    perspective: '500px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
  };

  return <Confetti active={confettiActive} config={config} />;
};

export default ConfettiComponent;
