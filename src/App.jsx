import { Suspense, useCallback, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAppRoutes } from "@/utils/routes";
import SetTitle from "@/base/SetTitle";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import SearchBar from "@/components/layout/SearchBar";
import Footer from "@/components/layout/Footer";
import SuspenseElement from "@/components/layout/SuspenseElement";
import Auth from "@/components/auth/Auth";
import { Toaster } from "sonner";
import CustomAlertDialog from "./components/common/CustomAlertDialog";

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchBarOpen, setSearchBarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleCloseSearchBar = useCallback(() => setSearchBarOpen(false), []);
  const handleCloseSidehBar = useCallback(() => setSidebarOpen(false), []);
  const handleCloseAuth = useCallback(() => setIsAuthOpen(false), []);

  const appRoutes = getAppRoutes(setIsAuthOpen);

  return (
    <Router basename="/AutoRent/">
      <Suspense fallback={<SuspenseElement />}>
        <SetTitle />
        <div className="absolute">
          <Toaster richColors dir="rtl" />
        </div>
        <CustomAlertDialog />

        <Header onMenuClick={() => setSidebarOpen(true)} onSearchBarClick={() => setSearchBarOpen(true)} setAuthOpen={() => setIsAuthOpen(true)} />

        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidehBar} setAuthOpen={() => setIsAuthOpen(true)} />
        <SearchBar isOpen={isSearchBarOpen} onClose={handleCloseSearchBar} />
        <Auth isAuthOpen={isAuthOpen} onClose={handleCloseAuth} />
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.component} />
          ))}
        </Routes>
        <Footer />
      </Suspense>
    </Router>
  );
};

export default App;
