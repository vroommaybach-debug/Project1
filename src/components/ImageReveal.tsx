import React, { useEffect, useRef, useState } from 'react';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-4/3'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          // Once revealed, we can unobserve
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-brand-beige/50 ${aspectRatio} ${className}`}
    >
      <div
        className={`w-full h-full clip-reveal transition-all duration-1000 ease-out ${
          isRevealed ? 'revealed' : ''
        }`}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Fine overlay lines for premium editorial print aesthetic */}
        <div className="absolute inset-0 border border-brand-charcoal/5 pointer-events-none" />
      </div>
    </div>
  );
};
