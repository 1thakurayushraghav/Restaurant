import { useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { MobileBottomNav, StickyCartBar } from "./components/layout/MobileNav";
import FloatingActions from "./components/layout/FloatingActions";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    // Admin panel renders its own full-screen layout (AdminLayout) without the storefront chrome.
    return <AppRoutes />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">
        <AppRoutes />
      </main>
      <Footer />
      <MobileBottomNav />
      <StickyCartBar />
      <FloatingActions />
    </div>
  );
}
