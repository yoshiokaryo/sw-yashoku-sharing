"use client";

import { motion } from "framer-motion";

const defaultVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: "easeOut" as const },
  }),
};

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

export function AnimatedSection({ children, className, delay = 0, id }: Props) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px 0px" }}
      variants={defaultVariants}
      custom={delay}
    >
      {children}
    </motion.section>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

type StaggerContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedStaggerContainer({ children, className }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px 0px" }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.06, delayChildren: 0.05 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({
  children,
  className,
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.div className={className} variants={itemVariants} custom={index}>
      {children}
    </motion.div>
  );
}
