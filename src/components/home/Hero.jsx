import { Link } from "react-router-dom";
import { MapPin, MessageCircle } from "lucide-react";
import { useRestaurant } from "../../context/RestaurantContext";
import { Rating } from "../ui/Misc";
import CategoryCard from "../menu/CategoryCard";
import restaurantImage from "../../assets/restaurant.png";

export function Hero() {
  const { restaurant } = useRestaurant();

  return (
    <section className="bg-gradient-to-b from-saffron/10 to-cream">
      <div className="container-app py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
            Authentic Vegetarian Food & Fresh Sweets in Sahaswan
          </h1>
          <p className="text-brown/70 text-base sm:text-lg mb-6 max-w-xl">
            Freshly prepared vegetarian meals, traditional Indian sweets and snacks — available for dine-in,
            takeaway and local delivery.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Link to="/menu" className="btn-primary">Order Food</Link>
            <Link to="/menu/sweets" className="btn-secondary">Order Sweets</Link>
            {restaurant?.whatsappNumber && (
              <a
                href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Order
              </a>
            )}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                restaurant?.address || "Shree Munnalal Halwai Sahaswan"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <MapPin className="w-4 h-4" /> Get Directions
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-brown/70">
            {restaurant?.rating && <Rating value={restaurant.rating} count={restaurant.reviewCount} />}
            <span className="font-medium">100% Vegetarian</span>
          </div>
        </div>

        <div className="aspect-[4/3] rounded-xl2 bg-white shadow-cardHover overflow-hidden">
          <img
            src={restaurantImage}
            alt="Shree Munnalal Halwai Sweets & Restaurant"
            className="w-full h-full object-contain"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}

export function QuickCategories({ categories }) {
  if (!categories?.length) return null;
  return (
    <section className="py-10">
      <div className="container-app">
        <h2 className="text-2xl mb-5">Browse by Category</h2>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
