import { Helmet } from "react-helmet-async";
import { useRestaurant } from "../context/RestaurantContext";

export default function About() {
  const { restaurant } = useRestaurant();

  return (
    <>
      <Helmet>
        <title>About Us — Shree Munnalal</title>
        <meta name="description" content="Learn about Shree Munnalal Halwai Sweets & Restaurant in Sahaswan." />
      </Helmet>
      <div className="container-app py-10 max-w-3xl">
        <h1 className="text-3xl mb-4">About Us</h1>
        <p className="text-brown/70 leading-relaxed mb-4">
          Shree Munnalal Halwai Sweets & Restaurant is a vegetarian restaurant and traditional sweets shop located
          near Bank of Baroda, Jahangirabad Chawraha, Sahaswan, Uttar Pradesh.
        </p>
        <p className="text-brown/70 leading-relaxed mb-4">
          We serve freshly prepared vegetarian meals, traditional Indian sweets and snacks for dine-in, takeaway,
          and local delivery.
        </p>
        {restaurant?.address && (
          <p className="text-brown/70 leading-relaxed">
            <strong>Address:</strong> {restaurant.address}
          </p>
        )}
      </div>
    </>
  );
}
