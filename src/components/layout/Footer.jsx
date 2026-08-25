import { Link } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";
import { useRestaurant } from "../../context/RestaurantContext";

export default function Footer() {
  const { restaurant } = useRestaurant();

  return (
    <footer className="bg-brown text-cream/90 mt-16">
      <div className="container-app py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-lg text-white mb-3">Shree Munnalal</h3>
          <p className="text-sm text-cream/70 leading-relaxed">
            {restaurant?.address || "Near Bank of Baroda, Jahangirabad Chawraha, Sahaswan, Uttar Pradesh 243638"}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/menu" className="hover:text-white">Menu</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/bulk-orders" className="hover:text-white">Bulk Orders</Link></li>
            <li><Link to="/delivery" className="hover:text-white">Delivery Info</Link></li>
            <li><Link to="/reviews" className="hover:text-white">Reviews</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            {restaurant?.phone && (
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {restaurant.phone}
              </li>
            )}
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> Jahangirabad Chawraha, Sahaswan
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> 8:30 AM – 10:00 PM
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">100% Vegetarian</h4>
          <p className="text-sm text-cream/70">
            Every dish and sweet we serve is prepared vegetarian, using traditional recipes.
          </p>
        </div>
      </div>

      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Shree Munnalal Halwai Sweets & Restaurant. All rights reserved.
      </div>
    </footer>
  );
}
