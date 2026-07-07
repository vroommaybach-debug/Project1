import React, { useRef, useState, useEffect } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  range?: number; // Boundary radius in pixels
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  range = 35,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const buttonX = rect.left + rect.width / 2;
    const buttonY = rect.top + rect.height / 2;

    const distanceX = e.clientX - buttonX;
    const distanceY = e.clientY - buttonY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < range) {
      // Attract button towards mouse position, with resistance (e.g. 0.35 factor)
      setPosition({ x: distanceX * 0.4, y: distanceY * 0.4 });
    } else {
      // Snap back to center
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [range]);

  return (
    <button
      ref={buttonRef}
      className={`relative transition-all duration-300 ease-out ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};
