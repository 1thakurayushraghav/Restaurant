import { Link } from "react-router-dom";
import { Leaf, Clock, ShieldCheck, Truck } from "lucide-react";
import ProductCard from "../menu/ProductCard";
import { Skeleton } from "../ui/FormElements";
import { Rating } from "../ui/Misc";

export function ProductRow({ title, products, viewAllHref, loading }) {
  if (!loading && (!products || products.length === 0)) return null;

  return (
    <section className="py-8">
      <div className="container-app">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl">{title}</h2>
          {viewAllHref && (
            <Link to={viewAllHref} className="text-sm font-semibold text-maroon hover:underline">
              View All →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5] rounded-xl2" />)
            : products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

const REASONS = [
  { icon: Leaf, title: "100% Vegetarian", desc: "Every item, made with pure vegetarian ingredients." },
  { icon: Clock, title: "Freshly Prepared", desc: "Cooked and packed fresh for every order." },
  { icon: ShieldCheck, title: "Trusted Since Years", desc: "A familiar name in Sahaswan's food scene." },
  { icon: Truck, title: "Fast Local Delivery", desc: "Quick delivery across nearby areas." },
];

export function WhyChooseUs() {
  return (
    <section className="py-12 bg-white">
      <div className="container-app">
        <h2 className="text-2xl mb-8 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-saffron/10 flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-saffron" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{title}</h3>
              <p className="text-xs text-brown/60">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({ reviews, loading }) {
  if (!loading && (!reviews || reviews.length === 0)) return null;

  return (
    <section className="py-12">
      <div className="container-app">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">What Our Customers Say</h2>
          <Link to="/reviews" className="text-sm font-semibold text-maroon hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl2" />)
            : reviews.slice(0, 3).map((r) => (
                <div key={r._id} className="card p-4">
                  <Rating value={r.rating} />
                  <p className="text-sm text-brown/70 mt-2 line-clamp-3">{r.comment}</p>
                  <p className="text-xs font-semibold text-brown mt-3">{r.customer.name}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
