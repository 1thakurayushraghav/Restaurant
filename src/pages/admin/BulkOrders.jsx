import { useFetch } from "../../hooks/useFetch";
import { adminApi } from "../../services/adminApi";
import { Select, Skeleton, EmptyState } from "../../components/ui/FormElements";
import { useToast } from "../../components/ui/Toast";
import { formatDate } from "../../utils/format";
import { Gift } from "lucide-react";

const STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "CLOSED"];

export default function AdminBulkOrders() {
  const { data: enquiries, loading, refetch } = useFetch(() => adminApi.getBulkOrders(), []);
  const { showToast } = useToast();

  const handleStatusChange = async (id, status) => {
    try {
      await adminApi.updateBulkOrderStatus(id, status);
      showToast("Status updated", "success");
      refetch();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">Bulk Order Enquiries</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl2" />)}
        </div>
      ) : !enquiries || enquiries.length === 0 ? (
        <EmptyState icon={Gift} title="No bulk order enquiries yet" />
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => (
            <div key={e._id} className="card p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold text-sm">{e.name} · {e.phone}</p>
                  <p className="text-xs text-brown/50 mt-0.5">
                    {e.eventType} {e.eventDate ? `· ${formatDate(e.eventDate)}` : ""} {e.peopleCount ? `· ${e.peopleCount} people` : ""}
                  </p>
                </div>
                <Select
                  value={e.status}
                  onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                  className="!w-auto text-xs !py-1.5"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              {e.products && <p className="text-sm text-brown/70 mt-2">{e.products}</p>}
              {e.message && <p className="text-sm text-brown/60 mt-1 italic">"{e.message}"</p>}
              <p className="text-xs text-brown/40 mt-2">Submitted {formatDate(e.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
