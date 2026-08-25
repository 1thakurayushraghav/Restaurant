import { Helmet } from "react-helmet-async";
import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { useRestaurant } from "../context/RestaurantContext";

export default function Contact() {
  const { restaurant } = useRestaurant();

  return (
    <>
      <Helmet>
        <title>Contact Us — Shree Munnalal</title>
      </Helmet>
      <div className="container-app py-8 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl mb-6">Contact Us</h1>

        <div className="card p-5 space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-maroon shrink-0 mt-0.5" />
            <p className="text-sm text-brown/80">
              {restaurant?.address || "Near Bank of Baroda, Jahangirabad Chawraha, Sahaswan, Uttar Pradesh 243638"}
            </p>
          </div>
          {restaurant?.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-maroon shrink-0" />
              <a href={`tel:${restaurant.phone}`} className="text-sm text-brown/80 hover:text-maroon">
                {restaurant.phone}
              </a>
            </div>
          )}
          {restaurant?.whatsappNumber && (
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-maroon shrink-0" />
              <a
                href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brown/80 hover:text-maroon"
              >
                WhatsApp us
              </a>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-maroon shrink-0" />
            <span className="text-sm text-brown/80">8:30 AM – 10:00 PM (daily, subject to change)</span>
          </div>
        </div>

        <div className="aspect-video rounded-xl2 overflow-hidden bg-brown/5">
          <iframe
            title="Restaurant location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              restaurant?.address || "Jahangirabad Chawraha, Sahaswan"
            )}&output=embed`}
          />
        </div>
      </div>
    </>
  );
}
