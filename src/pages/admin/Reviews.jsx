import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { adminApi } from "../../services/adminApi";
import { Rating } from "../../components/ui/Misc";
import { Skeleton, EmptyState } from "../../components/ui/FormElements";
import { useToast } from "../../components/ui/Toast";
import { formatDate } from "../../utils/format";
import { Star, Check, X } from "lucide-react";

const TABS = ["PENDING", "APPROVED", "REJECTED"];

export default function AdminReviews() {
  const [tab, setTab] = useState("PENDING");
  const { data: reviews, loading, refetch } = useFetch(() => adminApi.getReviews({ status: tab }), [tab]);
  const { showToast } = useToast();

  const handleStatus = async (id, status) => {
    try {
      await adminApi.updateReviewStatus(id, status);
      showToast(`Review ${status.toLowerCase()}`, "success");
      refetch();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">Reviews</h1>

      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl2 text-sm font-medium ${
              tab === t ? "bg-maroon text-white" : "bg-white border border-brown/15 text-brown"
            }`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl2" />)}
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <EmptyState icon={Star} title={`No ${tab.toLowerCase()} reviews`} />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Rating value={r.rating} />
                  <p className="text-sm font-semibold mt-1">{r.customer.name}</p>
                  <p className="text-xs text-brown/40">{formatDate(r.createdAt)}</p>
                </div>
                {tab === "PENDING" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleStatus(r._id, "APPROVED")} className="p-2 bg-veg/10 text-veg rounded-lg" aria-label="Approve">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleStatus(r._id, "REJECTED")} className="p-2 bg-nonveg/10 text-nonveg rounded-lg" aria-label="Reject">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {r.comment && <p className="text-sm text-brown/70 mt-2">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
