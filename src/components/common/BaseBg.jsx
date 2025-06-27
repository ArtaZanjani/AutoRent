import { AnimatePresence, motion } from "motion/react";
import useScrollBody from "@/hooks/useScrollBody";
import { useEffect } from "react";

const BaseBg = ({ children, isOpen, onClose }) => {
  const { setIsScrolling } = useScrollBody();

  useEffect(() => {
    setIsScrolling(!isOpen);
  }, [isOpen, setIsScrolling]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="w-screen h-screen fixed z-[999] top-0 left-0 bg-black/50" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ ease: [0.4, 0, 0.2, 1] }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BaseBg;
