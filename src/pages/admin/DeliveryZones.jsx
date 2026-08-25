import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { adminApi } from "../../services/adminApi";
import { Input } from "../../components/ui/FormElements";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { ConfirmDialog, Price } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyForm = {
  name: "", minimumOrder: 0, deliveryFee: 0, freeDeliveryAbove: "",
  estimatedTime: "30-45 mins", areas: "", isActive: true,
};

export default function DeliveryZones() {
  const { data: zones, loading, refetch } = useFetch(() => adminApi.getDeliveryZones(), []);
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

  const openEdit = (zone) => {
    setEditing(zone);
    setForm({
      name: zone.name,
      minimumOrder: zone.minimumOrder,
      deliveryFee: zone.deliveryFee,
      freeDeliveryAbove: zone.freeDeliveryAbove || "",
      estimatedTime: zone.estimatedTime,
      areas: (zone.areas || []).join(", "),
      isActive: zone.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      minimumOrder: Number(form.minimumOrder) || 0,
      deliveryFee: Number(form.deliveryFee) || 0,
      freeDeliveryAbove: form.freeDeliveryAbove ? Number(form.freeDeliveryAbove) : undefined,
      areas: form.areas.split(",").map((a) => a.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await adminApi.updateDeliveryZone(editing._id, payload);
        showToast("Delivery zone updated", "success");
      } else {
        await adminApi.createDeliveryZone(payload);
        showToast("Delivery zone created", "success");
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
      await adminApi.deleteDeliveryZone(deleteTarget._id);
      showToast("Delivery zone deleted", "success");
      refetch();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Delivery Zones</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Zone
        </Button>
      </div>

      {!loading && (
        <div className="grid sm:grid-cols-2 gap-4">
          {(zones || []).map((zone) => (
            <div key={zone._id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{zone.name}</p>
                  <p className="text-xs text-brown/50">{zone.areas?.length ? zone.areas.join(", ") : "Default / fallback zone"}</p>
                </div>
                {!zone.isActive && <span className="text-xs bg-brown/10 px-2 py-0.5 rounded-full">Inactive</span>}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-xs text-brown/50">Fee</p>
                  <Price amount={zone.deliveryFee} size="sm" />
                </div>
                <div>
                  <p className="text-xs text-brown/50">Min Order</p>
                  <Price amount={zone.minimumOrder} size="sm" />
                </div>
                <div>
                  <p className="text-xs text-brown/50">Free Above</p>
                  <p>{zone.freeDeliveryAbove ? <Price amount={zone.freeDeliveryAbove} size="sm" /> : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-brown/50">Est. Time</p>
                  <p className="text-sm">{zone.estimatedTime}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-brown/10">
                <button onClick={() => openEdit(zone)} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg bg-maroon/5 text-maroon">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => setDeleteTarget(zone)} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg bg-nonveg/5 text-nonveg">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Zone" : "Add Delivery Zone"}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Zone Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Delivery Fee (₹)" type="number" value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })} />
            <Input label="Minimum Order (₹)" type="number" value={form.minimumOrder} onChange={(e) => setForm({ ...form, minimumOrder: e.target.value })} />
          </div>
          <Input label="Free Delivery Above (₹, optional)" type="number" value={form.freeDeliveryAbove} onChange={(e) => setForm({ ...form, freeDeliveryAbove: e.target.value })} />
          <Input label="Estimated Time" value={form.estimatedTime} onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })} />
          <Input
            label="Areas (comma-separated, leave empty for default zone)"
            value={form.areas}
            onChange={(e) => setForm({ ...form, areas: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
          <Button type="submit" loading={saving} className="w-full">Save Zone</Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this zone?"
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
