import { motion } from 'framer-motion';

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideIn = (direction = 'left') => {
  return {
    hidden: {
      x: direction === 'left' ? -100 : 100,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };
};

export const scaleUp = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { duration: 0.5 } },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};