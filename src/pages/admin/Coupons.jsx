import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { adminApi } from "../../services/adminApi";
import { Input, Select } from "../../components/ui/FormElements";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";
import { formatDate } from "../../utils/format";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyForm = {
  code: "", type: "PERCENTAGE", value: 0, minimumOrder: 0, maximumDiscount: "",
  startDate: "", endDate: "", usageLimit: "", perUserLimit: 1, active: true,
};

export default function Coupons() {
  const { data: coupons, loading, refetch } = useFetch(() => adminApi.getCoupons(), []);
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code, type: c.type, value: c.value, minimumOrder: c.minimumOrder,
      maximumDiscount: c.maximumDiscount || "", startDate: c.startDate?.slice(0, 10),
      endDate: c.endDate?.slice(0, 10), usageLimit: c.usageLimit || "",
      perUserLimit: c.perUserLimit, active: c.active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      value: Number(form.value) || 0,
      minimumOrder: Number(form.minimumOrder) || 0,
      maximumDiscount: form.maximumDiscount ? Number(form.maximumDiscount) : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      perUserLimit: Number(form.perUserLimit) || 1,
    };
    try {
      if (editing) {
        await adminApi.updateCoupon(editing._id, payload);
        showToast("Coupon updated", "success");
      } else {
        await adminApi.createCoupon(payload);
        showToast("Coupon created", "success");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteCoupon(deleteTarget._id);
      showToast("Coupon deleted", "success");
      refetch();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Coupons</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Coupon
        </Button>
      </div>

      {!loading && (
        <div className="card divide-y divide-brown/10">
          {(coupons || []).map((c) => (
            <div key={c._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-mono font-semibold text-sm">{c.code}</p>
                <p className="text-xs text-brown/50">
                  {c.type === "PERCENTAGE" ? `${c.value}% off` : c.type === "FIXED" ? `₹${c.value} off` : "Free delivery"}
                  {" · "}Valid till {formatDate(c.endDate)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!c.active && <span className="text-xs bg-brown/10 px-2 py-0.5 rounded-full">Inactive</span>}
                <button onClick={() => openEdit(c)} className="p-2 text-maroon" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(c)} className="p-2 text-nonveg" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Coupon" : "Add Coupon"}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Code" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
            <option value="FREE_DELIVERY">Free Delivery</option>
          </Select>
          {form.type !== "FREE_DELIVERY" && (
            <Input label={form.type === "PERCENTAGE" ? "Percentage (%)" : "Amount (₹)"} type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          )}
          <div className="grid grid-cols-2 gap-3">
            <Input label="Minimum Order (₹)" type="number" value={form.minimumOrder} onChange={(e) => setForm({ ...form, minimumOrder: e.target.value })} />
            {form.type === "PERCENTAGE" && (
              <Input label="Max Discount (₹)" type="number" value={form.maximumDiscount} onChange={(e) => setForm({ ...form, maximumDiscount: e.target.value })} />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input label="End Date" type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Usage Limit (optional)" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
            <Input label="Per-User Limit" type="number" value={form.perUserLimit} onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active
          </label>
          <Button type="submit" loading={saving} className="w-full">Save Coupon</Button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete this coupon?" confirmLabel="Delete" danger />
    </div>
  );
}
