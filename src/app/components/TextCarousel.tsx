import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TextCarouselProps {
  texts: string[];
  interval?: number;
}

export function TextCarousel({ texts, interval = 2500 }: TextCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className="relative h-20 overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="absolute"
        >
          <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {texts[currentIndex]}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
