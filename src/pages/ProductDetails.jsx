import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { productApi } from "../services/productApi";
import { useCartStore } from "../store/cartStore";
import { useToast } from "../components/ui/Toast";
import { Price } from "../components/ui/Misc";
import { Badge, Skeleton, ErrorState } from "../components/ui/FormElements";
import Button from "../components/ui/Button";

export default function ProductDetails() {
  const { slug } = useParams();
  const { data: product, loading, error, refetch } = useFetch(() => productApi.getBySlug(slug), [slug]);
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToast();

  if (loading) {
    return (
      <div className="container-app py-8 grid lg:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-xl2" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <ErrorState title="Product not found" description={error} onRetry={refetch} />;
  }

  const variant = product.variants[variantIndex];

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
      quantity: qty,
    });
    showToast(`${product.name} added to cart`, "success");
  };

  return (
    <>
      <Helmet>
        <title>{product.name} — Shree Munnalal</title>
        <meta name="description" content={product.description || product.name} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            offers: {
              "@type": "Offer",
              price: variant.price,
              priceCurrency: "INR",
              availability: product.isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          })}
        </script>
      </Helmet>

      <div className="container-app py-6">
        <Link to="/menu" className="inline-flex items-center gap-1 text-sm text-brown/60 hover:text-maroon mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Menu
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="aspect-square rounded-xl2 bg-brown/5 overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brown/30">No image</div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={product.isVeg ? "veg-dot" : "nonveg-dot"} />
              {product.isBestseller && <Badge tone="saffron">Bestseller</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl mb-2">{product.name}</h1>
            {product.description && <p className="text-brown/70 mb-4">{product.description}</p>}

            <div className="mb-6">
              <Price amount={variant.price} size="lg" />
            </div>

            {product.variants.length > 1 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Select size/weight</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v._id}
                      onClick={() => setVariantIndex(idx)}
                      disabled={!v.isAvailable}
                      className={`px-4 py-2 rounded-xl2 border text-sm font-medium transition-colors disabled:opacity-40 ${
                        idx === variantIndex ? "border-maroon bg-maroon text-white" : "border-brown/15 bg-white"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.ingredients?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Ingredients</p>
                <p className="text-sm text-brown/60">{product.ingredients.join(", ")}</p>
              </div>
            )}
            {product.allergens?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-1">Allergens</p>
                <p className="text-sm text-brown/60">{product.allergens.join(", ")}</p>
              </div>
            )}

            {!product.isAvailable || !variant.isAvailable ? (
              <p className="text-nonveg font-medium">Currently unavailable</p>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-brown/15 rounded-xl2 px-2 py-1.5">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8" aria-label="Decrease quantity">
                    −
                  </button>
                  <span className="w-6 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8" aria-label="Increase quantity">
                    +
                  </button>
                </div>
                <Button onClick={handleAdd} className="flex-1">
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
