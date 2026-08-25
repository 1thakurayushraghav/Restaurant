import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { CartItem, CartSummary } from "../components/cart/CartItem";
import { EmptyState } from "../components/ui/FormElements";
import Button from "../components/ui/Button";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Your Cart — Shree Munnalal</title>
      </Helmet>
      <div className="container-app py-8 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add some delicious food or sweets to get started."
            action={<Button onClick={() => navigate("/menu")}>Browse Menu</Button>}
          />
        ) : (
          <div className="space-y-6">
            <div className="card p-4">
              {items.map((item) => (
                <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
              ))}
            </div>

            <div className="card p-4">
              <CartSummary subtotal={subtotal} total={subtotal} />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={clearCart} className="flex-1">
                Clear Cart
              </Button>
              <Button onClick={() => navigate("/checkout")} className="flex-1">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
