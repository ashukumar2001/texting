import { motion } from "framer-motion";
import { useNavigationType } from "react-router-dom";
const AnimatedPage = ({
  children,
  className,
  isInitial = true,
}: {
  children: JSX.Element | JSX.Element[];
  className?: string;
  isInitial?: boolean;
}) => {
  const navigationType = useNavigationType();

  return (
    <motion.div
      className={className}
      initial={
        isInitial && { opacity: 0, x: navigationType === "POP" ? -120 : 120 }
      }
      animate={isInitial && { opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: navigationType === "POP" ? 120 : -120 }}
      transition={{
        duration: 0.3,
        type: "keyframes",
        // ...(navigationType === "POP" && { delay: 0.2 }),
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
