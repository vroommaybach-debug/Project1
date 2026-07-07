import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 12
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse x within element
    const y = e.clientY - rect.top;  // Mouse y within element

    // Calculate normalized position (-1 to 1)
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Calculate rotation angles
    const rotateX = -normY * maxTilt;
    const rotateY = normX * maxTilt;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)',
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    });
  };

  return (
    <div
      ref={cardRef}
      className={`relative cursor-pointer select-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        ...tiltStyle
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D shadow effect */}
      <div 
        className={`absolute inset-0 bg-brand-charcoal/10 rounded-lg blur-xl opacity-0 transition-opacity duration-500 pointer-events-none -translate-y-2 translate-z-[-20px]`}
        style={{
          opacity: isHovered ? 0.45 : 0,
        }}
      />
      {children}
    </div>
  );
};
