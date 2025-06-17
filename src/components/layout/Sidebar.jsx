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
      <motion.aside onClick={(e) => e.stopPropagation()} initial={{ x: 250 }} animate={{ x: 0 }} exit={{ x: 250 }} transition={{ duration: 0.225, ease: [0.4, 0, 0.2, 1] }} className="fixed top-0 right-0 w-64 h-full bg-white z-50 shadow-lg animate-slide-in">
        <div className="flex justify-between items-center pl-3 pt-3 p-6">
          <span className="text-lg font-bold text-primary">منو</span>
          <button onClick={onClose} aria-label="بستن منو">
            <Add className="size-8 stroke-neutral-gray-10 rotate-45" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-6">
          {navHeader.map((item, idx) => (
            <Link key={idx} to={item.path} className={`text-base font-medium flex justify-between items-center ${location.pathname === item.path ? "text-primary" : "text-neutral-gray-10 hover:text-primary"} transition-colors`}>
              {item.title}

              {location.pathname === item.path && isOpen && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }} transition={{ delay: 0.3 }} className="w-2 h-2 bg-primary rounded-full"></motion.div>}
            </Link>
          ))}

          {isLoggedIn ? (
            <Link to="/dashboard/user" className={`text-base font-medium flex justify-between items-center ${location.pathname.startsWith("/dashboard") ? "text-primary" : "text-neutral-gray-10 hover:text-primary"} transition-colors`}>
              داشبورد
              {location.pathname.startsWith("/dashboard") && isOpen && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }} transition={{ delay: 0.3 }} className="w-2 h-2 bg-primary rounded-full" />}
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
