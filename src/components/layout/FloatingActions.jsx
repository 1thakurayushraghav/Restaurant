import { MessageCircle, Phone } from "lucide-react";
import { useRestaurant } from "../../context/RestaurantContext";

export default function FloatingActions() {
  const { restaurant } = useRestaurant();
  if (!restaurant) return null;

  const waNumber = (restaurant.whatsappNumber || "").replace(/[^\d]/g, "");
  const phone = restaurant.phone;

  if (!waNumber && !phone) return null;

  return (
    <div className="fixed bottom-32 lg:bottom-6 right-4 z-30 flex flex-col gap-3">
      {waNumber && (
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on WhatsApp"
          className="w-12 h-12 rounded-full bg-veg text-white flex items-center justify-center shadow-cardHover hover:scale-105 transition-transform"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone}`}
          aria-label="Call restaurant"
          className="w-12 h-12 rounded-full bg-maroon text-white flex items-center justify-center shadow-cardHover hover:scale-105 transition-transform"
        >
          <Phone className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}
