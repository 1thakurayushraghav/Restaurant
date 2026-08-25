import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { Badge, Card } from "../ui/FormElements";
import { Price } from "../ui/Misc";
import { useCartStore } from "../../store/cartStore";
import { useToast } from "../ui/Toast";

export default function ProductCard({ product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex];
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const { showToast } = useToast();

  const cartLine = items.find(
    (i) => i.productId === product._id && i.variantId === variant._id
  );

  const handleAdd = () => {
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0],
      isVeg: product.isVeg,
      variantId: variant._id,
      variantLabel: variant.label,
      price: variant.price,
      quantity: 1,
    });
    showToast(`${product.name} added to cart`, "success");
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/3] bg-brown/5">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brown/30 text-sm">
            No image
          </div>
        )}
        {product.isBestseller && (
          <Badge tone="saffron" className="absolute top-3 left-3">
            Bestseller
          </Badge>
        )}
        <span
          className={`absolute top-3 right-3 ${product.isVeg ? "veg-dot" : "nonveg-dot"} bg-white/90 p-1 rounded`}
          aria-label={product.isVeg ? "Vegetarian" : "Non-vegetarian"}
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-brown line-clamp-1">{product.name}</h3>
        </Link>
        {product.description && (
          <p className="text-sm text-brown/60 line-clamp-2 mt-1">{product.description}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div>
            <Price amount={variant.price} />
            {product.variants.length > 1 && (
              <span className="text-xs text-brown/50 ml-1">/ {variant.label}</span>
            )}
          </div>

          {product.variants.length > 1 && (
            <select
              value={variantIndex}
              onChange={(e) => setVariantIndex(Number(e.target.value))}
              className="text-xs border border-brown/15 rounded-lg px-2 py-1.5 bg-white"
              aria-label="Select variant"
            >
              {product.variants.map((v, idx) => (
                <option key={v._id} value={idx} disabled={!v.isAvailable}>
                  {v.label}
                  {!v.isAvailable ? " (unavailable)" : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="pt-3">
          {!product.isAvailable ? (
            <span className="block text-center text-sm text-nonveg font-medium py-2">Currently unavailable</span>
          ) : !variant.isAvailable ? (
            <span className="block text-center text-sm text-brown/50 font-medium py-2">Variant unavailable</span>
          ) : cartLine ? (
            <div className="flex items-center justify-between bg-maroon/5 rounded-xl2 px-2 py-1.5">
              <button
                onClick={() => decreaseQty(product._id, variant._id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-card"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold">{cartLine.quantity}</span>
              <button
                onClick={() => increaseQty(product._id, variant._id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-card"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={handleAdd} className="btn-primary w-full !py-2 text-sm">
              Add
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
