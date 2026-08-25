import { Helmet } from "react-helmet-async";
import { useFetch } from "../hooks/useFetch";
import { deliveryApi } from "../services/deliveryApi";
import { Skeleton, EmptyState } from "../components/ui/FormElements";
import { Truck } from "lucide-react";
import { Price } from "../components/ui/Misc";

export default function Delivery() {
  const { data: zones, loading } = useFetch(() => deliveryApi.getZones(), []);

  return (
    <>
      <Helmet>
        <title>Delivery Info — Shree Munnalal</title>
      </Helmet>
      <div className="container-app py-8 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl mb-6">Delivery Information</h1>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl2" />)}
          </div>
        ) : !zones || zones.length === 0 ? (
          <EmptyState icon={Truck} title="Delivery info coming soon" description="Please contact us directly for delivery availability." />
        ) : (
          <div className="space-y-4">
            {zones.map((zone) => (
              <div key={zone._id} className="card p-5">
                <h2 className="font-semibold mb-2">{zone.name}</h2>
                <div className="text-sm text-brown/70 space-y-1">
                  <p>Estimated time: {zone.estimatedTime}</p>
                  <p>Delivery fee: {zone.deliveryFee === 0 ? "Free" : <Price amount={zone.deliveryFee} size="sm" />}</p>
                  {zone.minimumOrder > 0 && <p>Minimum order: <Price amount={zone.minimumOrder} size="sm" /></p>}
                  {zone.freeDeliveryAbove && <p>Free delivery above <Price amount={zone.freeDeliveryAbove} size="sm" /></p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
