import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useDebounce } from "../../hooks/useDebounce";
import { adminApi } from "../../services/adminApi";
import { SearchBar } from "../../components/menu/SearchFilter";
import { Skeleton, EmptyState } from "../../components/ui/FormElements";
import { Price } from "../../components/ui/Misc";
import { Users } from "lucide-react";

export default function Customers() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 400);
  const { data, loading } = useFetch(() => adminApi.getCustomers({ q: debounced || undefined, limit: 100 }), [debounced]);

  const customers = data?.data?.customers || [];

  return (
    <div>
      <h1 className="text-2xl mb-6">Customers</h1>
      <div className="mb-5 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or phone..." />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : customers.length === 0 ? (
        <EmptyState icon={Users} title="No customers found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brown/50 border-b border-brown/10">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Phone</th>
                <th className="p-3 font-medium">Orders</th>
                <th className="p-3 font-medium">Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-brown/5 last:border-0">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-brown/60">{c.phone}</td>
                  <td className="p-3">{c.orderCount}</td>
                  <td className="p-3"><Price amount={c.totalSpend} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
