import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface CascadingTextProps {
  text: string;
  className?: string;
  delay?: number;
  tagName?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
}

export const CascadingText: React.FC<CascadingTextProps> = ({
  text,
  className = '',
  delay = 0,
  tagName: Tag = 'h1'
}) => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      }
    }
  };

  const letterVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // premium cubic-bezier speed curve
      }
    }
  };

  // Split word-by-word, keeping spaces
  const words = text.split(' ');

  return (
    <Tag
      ref={containerRef as any}
      className={`inline-block overflow-hidden ${className}`}
    >
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="inline-flex flex-wrap"
      >
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-flex mr-[0.25em] whitespace-nowrap overflow-hidden">
            {word.split('').map((char, charIdx) => (
              <motion.span
                key={charIdx}
                variants={letterVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};
