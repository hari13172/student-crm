import { ReactNode } from "react";
import { motion } from "motion/react";

const pageTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.4, ease: "easeInOut" },
};

export const ComponentWrapper = ({
  children,
  keyName,
}: {
  children: ReactNode;
  keyName: string;
}) => {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      key={keyName}
    >
      {children}
    </motion.div>
  );
};
