// src/utils/pageAnimations.ts
import { type Variants, type Transition } from 'framer-motion';

export const pageVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const pageTransition: Transition = {
    duration: 0.28,
    ease: [0.4, 0, 0.2, 1],
};