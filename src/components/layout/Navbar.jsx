import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu as MenuIcon, X, User, LogOut } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/menu/sweets", label: "Sweets" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-brown/10">
      <div className="container-app flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl font-bold text-maroon">
          Shree Munnalal
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-maroon" : "text-brown/70 hover:text-maroon"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-brown/5 transition-colors"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingCart className="w-6 h-6 text-brown" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-maroon text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Account: shows Login link when logged out, name + dropdown with Logout when logged in */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen((o) => !o)}
                className="p-2 rounded-full hover:bg-brown/5 transition-colors flex items-center gap-1.5"
                aria-label="Account menu"
                aria-expanded={accountOpen}
              >
                <User className="w-6 h-6 text-brown" />
                <span className="hidden sm:inline text-sm font-medium text-brown max-w-[100px] truncate">
                  {user.name?.split(" ")[0]}
                </span>
              </button>

              {accountOpen && (
                <>
                  {/* click-outside overlay */}
                  <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-cardHover rounded-xl2 border border-brown/10 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-brown/10">
                      <p className="text-sm font-semibold text-brown truncate">{user.name}</p>
                      <p className="text-xs text-brown/50">{user.phone}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-brown hover:bg-maroon/5"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2.5 text-sm text-brown hover:bg-maroon/5"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-nonveg hover:bg-nonveg/5"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="p-2 rounded-full hover:bg-brown/5 transition-colors flex items-center gap-1.5"
              aria-label="Login"
            >
              <User className="w-6 h-6 text-brown" />
              <span className="hidden sm:inline text-sm font-medium text-brown">Login</span>
            </Link>
          )}

          <Link to="/menu" className="hidden lg:inline-flex btn-primary !py-2.5 !px-4 text-sm">
            Order Online
          </Link>

          <button
            className="lg:hidden p-2 rounded-full hover:bg-brown/5"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-brown/10 bg-white" aria-label="Mobile navigation">
          <div className="container-app py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? "bg-maroon/5 text-maroon" : "text-brown/70"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="border-t border-brown/10 mt-2 pt-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-brown/70"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-brown/70"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-nonveg"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-brown/70"
                >
                  <User className="w-4 h-4" /> Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}