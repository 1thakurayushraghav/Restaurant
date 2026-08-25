import { ShoppingBag, IndianRupee, Clock, ChefHat, Truck, CheckCircle2 } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { adminApi } from "../../services/adminApi";
import StatCard from "../../components/admin/StatCard";
import { Skeleton } from "../../components/ui/FormElements";
import { formatPrice } from "../../utils/format";

export default function Dashboard() {
  const { data, loading } = useFetch(() => adminApi.getDashboard(), []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl2" />)}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Today's Orders" value={data.todayOrders} icon={ShoppingBag} tone="maroon" />
        <StatCard label="Today's Revenue" value={formatPrice(data.todayRevenue)} icon={IndianRupee} tone="veg" />
        <StatCard label="Pending" value={data.pending} icon={Clock} tone="saffron" />
        <StatCard label="Preparing" value={data.preparing} icon={ChefHat} tone="gold" />
        <StatCard label="Out for Delivery" value={data.outForDelivery} icon={Truck} tone="maroon" />
        <StatCard label="Delivered Today" value={data.delivered} icon={CheckCircle2} tone="veg" />
      </div>
    </div>
  );
}
