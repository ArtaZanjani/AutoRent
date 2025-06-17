import { AnimatePresence, motion } from "motion/react";

const RadioBtn = ({ active, handleChange = null, size = "size-5" }) => {
  return (
    <div onClick={handleChange} className={`cursor-pointer rounded-full border-2 flex justify-center items-center transition-all ${active ? "p-[2px] border-primary" : "border-neutral-gray-4"} ${size}`}>
      <AnimatePresence>{active && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-full h-full bg-primary rounded-full"></motion.div>}</AnimatePresence>
    </div>
  );
};

export default RadioBtn;
