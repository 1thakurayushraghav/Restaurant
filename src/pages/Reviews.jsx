import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Star } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { reviewApi } from "../services/miscApi";
import { Rating } from "../components/ui/Misc";
import { Skeleton, EmptyState, Input } from "../components/ui/FormElements";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import { formatDate } from "../utils/format";

export default function Reviews() {
  const { data: reviews, loading, refetch } = useFetch(() => reviewApi.getApproved(), []);
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewApi.create({
        customer: { name: form.name, phone: form.phone },
        rating: Number(form.rating),
        comment: form.comment,
      });
      showToast("Thank you! Your review will appear after approval.", "success");
      setForm({ name: "", phone: "", rating: 5, comment: "" });
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reviews — Shree Munnalal</title>
      </Helmet>
      <div className="container-app py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl sm:text-3xl mb-6">Customer Reviews</h1>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl2" />)}
            </div>
          ) : reviews?.length === 0 ? (
            <EmptyState icon={Star} title="No reviews yet" description="Be the first to share your experience." />
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <Rating value={r.rating} />
                    <span className="text-xs text-brown/50">{formatDate(r.createdAt)}</span>
                  </div>
                  {r.comment && <p className="text-sm text-brown/70 mt-2">{r.comment}</p>}
                  <p className="text-xs font-semibold text-brown mt-2">{r.customer.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="card p-5">
            <h2 className="font-semibold mb-4">Leave a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input label="Your Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setForm({ ...form, rating: n })}
                      aria-label={`${n} stars`}
                    >
                      <Star className={`w-6 h-6 ${n <= form.rating ? "fill-gold text-gold" : "text-brown/20"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
              <Button type="submit" loading={submitting} className="w-full">
                Submit Review
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
