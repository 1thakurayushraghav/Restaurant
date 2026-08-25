import { Link } from "react-router-dom";
import { useRestaurant } from "../../context/RestaurantContext";

const DAY_LABELS = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday", SAT: "Saturday", SUN: "Sunday" };

export function OpeningHoursSection() {
  const { restaurant } = useRestaurant();
  const hours = restaurant?.openingHours || [];

  return (
    <section className="py-12 bg-white">
      <div className="container-app max-w-2xl">
        <h2 className="text-2xl mb-6 text-center">Opening Hours</h2>
        {hours.length === 0 ? (
          <p className="text-center text-brown/60">Open daily, 8:30 AM – 10:00 PM (subject to change)</p>
        ) : (
          <ul className="divide-y divide-brown/10 max-w-md mx-auto">
            {hours.map((h) => (
              <li key={h.day} className="flex justify-between py-2 text-sm">
                <span className="font-medium">{DAY_LABELS[h.day]}</span>
                <span className="text-brown/60">{h.isClosed ? "Closed" : `${h.open} – ${h.close}`}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="py-16 bg-maroon text-white text-center">
      <div className="container-app">
        <h2 className="text-2xl sm:text-3xl text-white mb-3">Hungry for something authentic?</h2>
        <p className="text-white/80 mb-6 max-w-lg mx-auto">
          Order online now for delivery, or visit us for a warm dine-in experience.
        </p>
        <Link to="/menu" className="inline-flex items-center justify-center bg-white text-maroon font-semibold px-6 py-3 rounded-xl2 hover:bg-cream transition-colors">
          Order Now
        </Link>
      </div>
    </section>
  );
}
