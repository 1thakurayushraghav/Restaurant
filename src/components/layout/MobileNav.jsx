import { NavLink, useNavigate } from "react-router-dom";
import { Home, UtensilsCrossed, ShoppingCart, Package, MoreHorizontal } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../utils/format";

const TABS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/contact", label: "More", icon: MoreHorizontal },
];

export function MobileBottomNav() {
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-brown/10 flex justify-around py-1.5 pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile bottom navigation"
    >
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium ${
              isActive ? "text-maroon" : "text-brown/50"
            }`
          }
        >
          <Icon className="w-5 h-5" />
          {label}
          {label === "Cart" && itemCount > 0 && (
            <span className="absolute top-0 right-1 bg-maroon text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function StickyCartBar() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const itemCount = useCartStore((s) => s.getItemCount());
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <button
      onClick={() => navigate("/cart")}
      className="lg:hidden fixed bottom-16 left-0 right-0 z-30 mx-3 mb-2 bg-maroon text-white rounded-xl2 shadow-cardHover px-4 py-3 flex items-center justify-between"
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        <ShoppingCart className="w-4 h-4" /> {itemCount} {itemCount === 1 ? "Item" : "Items"} · {formatPrice(subtotal)}
      </span>
      <span className="text-sm font-semibold">View Cart →</span>
    </button>
  );
}
