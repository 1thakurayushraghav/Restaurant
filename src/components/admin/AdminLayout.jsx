import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Package, FolderTree, Users, Truck,
  Tag, Star, Gift, Settings as SettingsIcon, LogOut, Menu as MenuIcon, X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/delivery-zones", label: "Delivery", icon: Truck },
  { to: "/admin/coupons", label: "Coupons", icon: Tag },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/bulk-orders", label: "Bulk Orders", icon: Gift },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function SidebarContent({ user, logout, onNavigate }) {
  return (
    <>
      <div className="h-16 flex items-center px-5 border-b border-brown/10 shrink-0">
        <Link to="/admin/dashboard" onClick={onNavigate} className="font-display font-bold text-maroon">
          Shree Munnalal Admin
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "bg-maroon text-white" : "text-brown/70 hover:bg-maroon/5"
              }`
            }
          >
            <Icon className="w-4 h-4" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-brown/10 shrink-0">
        <p className="text-xs text-brown/50 px-3 mb-2">{user?.name} ({user?.role})</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-nonveg font-medium rounded-xl hover:bg-nonveg/5"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Desktop sidebar — always visible at lg+ */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brown/10 shrink-0">
        <SidebarContent user={user} logout={logout} />
      </aside>

      {/* Mobile sidebar — slide-out drawer, only rendered/shown when toggled open */}
      <div className={`lg:hidden fixed inset-0 z-50 ${mobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-brown/50 backdrop-blur-sm transition-opacity ${
            mobileSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileSidebarOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-72 max-w-[80vw] bg-white flex flex-col shadow-cardHover transition-transform duration-300 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent user={user} logout={logout} onNavigate={() => setMobileSidebarOpen(false)} />
        </aside>
      </div>

      <main className="flex-1 min-w-0">
        {/* Mobile top bar with hamburger toggle */}
        <div className="lg:hidden h-14 bg-white border-b border-brown/10 flex items-center px-4 justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-brown/5"
          >
            <MenuIcon className="w-5 h-5 text-brown" />
          </button>
          <span className="font-display font-bold text-maroon text-sm">Admin</span>
          <button onClick={logout} className="text-nonveg text-sm font-medium">Logout</button>
        </div>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}