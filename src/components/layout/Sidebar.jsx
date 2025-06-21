import { Link, useLocation } from "react-router-dom";
import { Add } from "iconsax-react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { motion } from "motion/react";
import BaseBg from "@/components/common/BaseBg";
import { navHeader } from "@/utils/utils";
import useScrollBody from "@/hooks/useScrollBody";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = ({ isOpen, onClose, setAuthOpen }) => {
  const location = useLocation();
  const matches = useMediaQuery("(min-width:1000px)");
  const { setIsScrolling } = useScrollBody();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setIsScrolling(!isOpen);
  }, [isOpen, setIsScrolling]);

  const handleOpenAuth = () => {
    onClose();
    setAuthOpen();
  };

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  if (matches || location.pathname === "/fetcherror") return null;

  return (
    <BaseBg isOpen={isOpen} onClose={onClose}>
      <motion.aside onClick={(e) => e.stopPropagation()} initial={{ x: 250 }} animate={{ x: 0 }} exit={{ x: 250 }} transition={{ duration: 0.225, ease: [0.4, 0, 0.2, 1] }} className="fixed top-0 right-0 z-50 w-64 h-full bg-white shadow-lg animate-slide-in">
        <div className="flex items-center justify-between p-6 pt-3 pl-3">
          <span className="text-lg font-bold text-primary">منو</span>
          <button onClick={onClose} aria-label="بستن منو">
            <Add className="rotate-45 size-8 stroke-neutral-gray-10" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-6">
          {navHeader.map((item, idx) => (
            <Link key={idx} to={item.path} className={`text-base font-medium flex justify-between items-center ${location.pathname === item.path ? "text-primary" : "text-neutral-gray-10 hover:text-primary"} transition-colors`}>
              {item.title}

              {location.pathname === item.path && isOpen && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }} transition={{ delay: 0.3 }} className="w-2 h-2 rounded-full bg-primary"></motion.div>}
            </Link>
          ))}

          {isLoggedIn ? (
            <Link to="/dashboard/user" className={`text-base font-medium flex justify-between items-center ${location.pathname.startsWith("/dashboard") ? "text-primary" : "text-neutral-gray-10 hover:text-primary"} transition-colors`}>
              داشبورد
              {location.pathname.startsWith("/dashboard") && isOpen && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }} transition={{ delay: 0.3 }} className="w-2 h-2 rounded-full bg-primary" />}
            </Link>
          ) : (
            <button onClick={handleOpenAuth} className={`text-base font-medium flex justify-between items-center transition-colors`}>
              ورود / ثبت نام
            </button>
          )}
        </nav>
      </motion.aside>
    </BaseBg>
  );
};

export default Sidebar;
