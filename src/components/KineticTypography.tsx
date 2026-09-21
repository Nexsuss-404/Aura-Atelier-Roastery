import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, Variants } from 'motion/react';

// Kinetic Physics Easing Curves & Springs
export const KINETIC_EASE_OUT = [0.16, 1, 0.3, 1] as const; // Aggressive cubic-bezier (Awwwards standard)
export const KINETIC_EASE_SPRING = { stiffness: 160, damping: 18, mass: 0.9 };

interface KineticWordMaskProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delay?: number;
  stagger?: number; // 0.015s - 0.04s constraint
  tiltAngle?: number; // Subtle kinetic rotation in degrees (e.g., 3 to 6)
  perspective?: number;
  italicWordIndex?: number | number[];
  onComplete?: () => void;
}

/**
 * KineticWordMask: Splits text into words with a dual-wrapper architecture:
 * - Outer node: inline-block overflow-hidden (clipping mask plane)
 * - Inner node: GPU-promoted motion.span with 2.5D translation (y, rotateZ, opacity)
 * - Strict compositor thread safety with zero layout reflow
 */
export const KineticWordMask: React.FC<KineticWordMaskProps> = ({
  text,
  className = '',
  as: Component = 'span',
  delay = 0.08,
  stagger = 0.032,
  tiltAngle = 4.5,
  perspective = 800,
  italicWordIndex,
  onComplete,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const words = useMemo(() => text.split(' ').filter(Boolean), [text]);

  const italicIndices = useMemo(() => {
    if (italicWordIndex === undefined) return [];
    return Array.isArray(italicWordIndex) ? italicWordIndex : [italicWordIndex];
  }, [italicWordIndex]);

  // Reduced motion fallback: Instant/fade reveal with no transforms
  if (shouldReduceMotion) {
    return (
      <Component className={className}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={`inline-block mr-[0.28em] ${italicIndices.includes(i) ? 'italic font-normal' : ''}`}
          >
            {word}
          </span>
        ))}
      </Component>
    );
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      y: '120%',
      rotateZ: tiltAngle,
      opacity: 0.001,
      transition: { duration: 0 },
    },
    visible: {
      y: '0%',
      rotateZ: 0,
      opacity: 1,
      transition: {
        duration: 0.92,
        ease: KINETIC_EASE_OUT,
      },
    },
  };

  return (
    <Component
      className={`${className} inline-block`}
      style={{ perspective: `${perspective}px` }}
    >
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onComplete}
        className="inline-block"
      >
        {words.map((word, i) => {
          const isItalic = italicIndices.includes(i);
          return (
            <span
              key={`${word}-${i}`}
              className="inline-block overflow-hidden align-top mr-[0.28em] py-0.5 -my-0.5"
            >
              <motion.span
                variants={wordVariants}
                className={`inline-block origin-bottom-left will-change-transform ${
                  isItalic ? 'italic font-normal' : ''
                }`}
                style={{
                  transformOrigin: '0% 100%',
                }}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Component>
  );
};

interface KineticHeroHeadlineProps {
  firstLine: string;
  accentWord: string;
  className?: string;
  delay?: number;
}

/**
 * KineticHeroHeadline: Specifically engineered for Display / H1 hero architecture.
 * Dual-line masked kinetic choreography with synchronized micro-staggers.
 */
export const KineticHeroHeadline: React.FC<KineticHeroHeadlineProps> = ({
  firstLine,
  accentWord,
  className = '',
  delay = 0.05,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const firstLineWords = useMemo(() => firstLine.split(' ').filter(Boolean), [firstLine]);

  if (shouldReduceMotion) {
    return (
      <h1 className={className}>
        <span className="leading-[1.08] sm:leading-[1.05] md:leading-[100px] hero-headline-line1" style={{ lineHeight: 'clamp(52px, 8.5vw, 100px)' }}>{firstLine}</span>
        <br />
        <span className="font-normal italic pl-1 sm:pl-3">{accentWord}</span>
      </h1>
    );
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.038,
        delayChildren: delay,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: {
      y: '125%',
      rotateZ: 4.8,
      opacity: 0.001,
    },
    visible: {
      y: '0%',
      rotateZ: 0,
      opacity: 1,
      transition: {
        duration: 1.05,
        ease: KINETIC_EASE_OUT,
      },
    },
  };

  const accentVariants: Variants = {
    hidden: {
      y: '130%',
      rotateZ: -3.5,
      scale: 0.96,
      opacity: 0.001,
    },
    visible: {
      y: '0%',
      rotateZ: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.15,
        ease: KINETIC_EASE_OUT,
      },
    },
  };

  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${className} select-none`}
      style={{ perspective: '1200px' }}
    >
      {/* Line 1 */}
      <span
        className="block text-[100px] leading-[100px] hero-headline-line1"
        style={{ fontSize: '100px', lineHeight: '100px' }}
      >
        {firstLineWords.map((word, idx) => (
          <span
            key={`hero-w-${idx}`}
            className="inline-block overflow-hidden align-top mr-[0.28em] py-1 -my-1"
          >
            <motion.span
              variants={lineVariants}
              className="inline-block origin-bottom-left will-change-transform"
              style={{ transformOrigin: '0% 100%' }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>

      {/* Line 2 (Accent & Italic) */}
      <span className="block mt-1 sm:mt-2">
        <span className="inline-block overflow-hidden align-top py-1.5 -my-1.5">
          <motion.span
            variants={accentVariants}
            className="inline-block font-normal italic pl-1 sm:pl-3 origin-bottom-left will-change-transform"
            style={{ transformOrigin: '0% 100%' }}
          >
            {accentWord}
          </motion.span>
        </span>
      </span>
    </motion.h1>
  );
};

interface KineticParagraphRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

/**
 * KineticParagraphReveal: Word-by-word staggered reveal for editorial narrative body copy.
 * Uses dampened acceleration with tight 0.018s staggers to keep reading cadence natural.
 */
export const KineticParagraphReveal: React.FC<KineticParagraphRevealProps> = ({
  text,
  className = '',
  delay = 0.25,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const words = useMemo(() => text.split(' ').filter(Boolean), [text]);

  if (shouldReduceMotion) {
    return <p className={className}>{text}</p>;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.018,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: 0.72,
        ease: KINETIC_EASE_OUT,
      },
    },
  };

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${className} [text-wrap:pretty]`}
    >
      {words.map((word, i) => (
        <span
          key={`p-${i}`}
          className="inline-block overflow-hidden align-top mr-[0.24em] py-0.5 -my-0.5"
        >
          <motion.span
            variants={wordVariants}
            className="inline-block will-change-transform origin-bottom"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
};

interface KineticMetricProps {
  value: string;
  label: string;
  delay?: number;
}

/**
 * KineticMetric: Mathematical odometer vertical slip with delayed label unmask.
 */
export const KineticMetric: React.FC<KineticMetricProps> = ({
  value,
  label,
  delay = 0.35,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div>
        <span className="font-serif text-2xl sm:text-3xl font-light text-[#1A1A18] block tracking-[-0.02em] leading-none mb-1.5">
          {value}
        </span>
        <span className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.04em] text-[#1A1A18]/55 uppercase block whitespace-nowrap sm:whitespace-normal">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden py-0.5 -my-0.5">
        <motion.span
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{
            duration: 0.85,
            delay,
            ease: KINETIC_EASE_OUT,
          }}
          className="font-serif text-2xl sm:text-3xl font-light text-[#1A1A18] block tracking-[-0.02em] leading-none mb-1.5 will-change-transform origin-bottom"
        >
          {value}
        </motion.span>
      </div>

      <div className="overflow-hidden">
        <motion.span
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: delay + 0.12,
            ease: KINETIC_EASE_OUT,
          }}
          className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.04em] text-[#1A1A18]/55 uppercase block will-change-transform whitespace-nowrap sm:whitespace-normal"
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
};

interface KineticMagneticHoverProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

/**
 * KineticMagneticHover: Subtle spring-dampened cursor magnetic attraction
 * for interactive links and primary call-to-actions.
 */
export const KineticMagneticHover: React.FC<KineticMagneticHoverProps> = ({
  children,
  className = '',
  strength = 0.22,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (clientX - centerX) * strength;
    const distanceY = (clientY - centerY) * strength;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 18,
        mass: 0.2,
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
