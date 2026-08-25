import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Package, FolderTree, Users, Truck,
  Tag, Star, Gift, Settings as SettingsIcon, LogOut,
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

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brown/10 shrink-0">
        <div className="h-16 flex items-center px-5 border-b border-brown/10">
          <Link to="/admin/dashboard" className="font-display font-bold text-maroon">
            Shree Munnalal Admin
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
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
        <div className="p-3 border-t border-brown/10">
          <p className="text-xs text-brown/50 px-3 mb-2">{user?.name} ({user?.role})</p>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-nonveg font-medium rounded-xl hover:bg-nonveg/5"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="lg:hidden h-14 bg-white border-b border-brown/10 flex items-center px-4 justify-between">
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
