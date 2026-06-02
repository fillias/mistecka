'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type FadeInProps = {
    children: ReactNode;
    delay?: number;
    moveY?: number;
};

export default function FadeIn({ children, delay = 0, moveY = 0 }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: moveY }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                delay,
                ease: 'easeOut'
            }}
        >
            {children}
        </motion.div>
    );
}
