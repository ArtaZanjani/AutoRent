import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Add } from "iconsax-react";

const BookingInput = ({ icon, label, value, filterValue, onFocus, onChange, onFilterChange, isOpen, onClose, children, readOnly = false, matches }) => {
  return (
    <div className="relative w-full">
      <div className="absolute z-10 -translate-y-1/2 top-1/2 right-2">{icon}</div>
      <label htmlFor={label} className={`pointer-events-none bg-white transition-all absolute px-2 ${isOpen || value.length > 0 ? "-top-3 text-sm right-2 text-neutral-gray-10" : "top-1/2 -translate-y-1/2 right-7 text-neutral-gray-4"}`}>
        {label}
      </label>
      <input id={label} className={`h-12 inpBase w-full !pr-9 border transition-all ${isOpen || value.length > 0 ? "border-neutral-gray-10" : "border-neutral-gray-4"}`} value={isOpen ? filterValue : value} onFocus={onFocus} onChange={(ev) => (matches ? onFilterChange(ev.target.value) : null)} readOnly={!matches || readOnly} aria-label={label} />

      <AnimatePresence>
        {isOpen && (
          <motion.div className="w-full h-screen sm:h-fit z-[999] bg-white border border-neutral-gray-4 fixed top-0 sm:absolute sm:top-14 sm:rounded-xl overflow-y-auto left-0 sm:z-20" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.255, ease: [0.4, 0, 0.2, 1] }}>
            {!matches && (
              <div className="sticky top-0 left-0 flex flex-col w-full px-3 py-5 bg-white border-b border-neutral-gray-4">
                <div className="flex items-center justify-between w-full">
                  {label}
                  <div onClick={onClose} className="p-2 rounded-full hover:bg-neutral-gray-3">
                    <Add className="rotate-45 size-7 stroke-black" />
                  </div>
                </div>
                {!readOnly && <input type="text" placeholder="جستجو" className="w-full h-12 px-3 text-sm transition-colors border rounded-xl border-neutral-gray-3 focus:border-primary" value={filterValue} onChange={(ev) => onFilterChange(ev.target.value)} />}
              </div>
            )}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingInput;
