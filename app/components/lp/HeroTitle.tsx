"use client";

import { motion } from "framer-motion";

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const taglineVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.15, ease: "easeOut" as const },
  },
};

const bubblesVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.25 },
  },
};

const bubbleItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type Props = {
  title: string;
  tagline: string;
  leftBubbles: React.ReactNode;
  rightBubble: React.ReactNode;
};

export function HeroTitle({ title, tagline, leftBubbles, rightBubble }: Props) {
  return (
    <>
      <motion.div
        className="text-center mt-[18vh] mb-2"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.h1
          className="text-[clamp(3rem,14vw,6rem)] font-black tracking-tight m-0 text-white leading-none"
          style={{ fontFamily: "var(--font-rounded), sans-serif" }}
          variants={titleVariants}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl font-bold text-lp-accent mt-3 mb-6"
          variants={taglineVariants}
        >
          {tagline}
        </motion.p>
      </motion.div>
      <motion.div
        className="flex flex-col gap-4 md:flex-row md:flex-wrap md:justify-between md:items-start md:max-w-[90%] md:mx-auto"
        initial="hidden"
        animate="visible"
        variants={bubblesVariants}
      >
        <motion.div
          className="w-full md:flex-1 md:min-w-[200px] md:max-w-[280px] space-y-2"
          variants={bubbleItem}
        >
          {leftBubbles}
        </motion.div>
        <motion.div
          className="w-full md:w-auto md:shrink md:max-w-[160px] md:text-right"
          variants={bubbleItem}
        >
          {rightBubble}
        </motion.div>
      </motion.div>
    </>
  );
}
