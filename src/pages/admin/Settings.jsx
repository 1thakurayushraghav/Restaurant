import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { adminApi } from "../../services/adminApi";
import { Input } from "../../components/ui/FormElements";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function Settings() {
  const { data: restaurant, loading, refetch } = useFetch(() => adminApi.getSettings(), []);
  const { showToast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (restaurant) {
      const hoursByDay = new Map((restaurant.openingHours || []).map((h) => [h.day, h]));
      setForm({
        name: restaurant.name || "",
        address: restaurant.address || "",
        phone: restaurant.phone || "",
        whatsappNumber: restaurant.whatsappNumber || "",
        manualOverrideClosed: restaurant.manualOverrideClosed || false,
        scheduledOrderingEnabled: restaurant.scheduledOrderingEnabled || false,
        openingHours: DAYS.map((day) => hoursByDay.get(day) || { day, open: "08:30", close: "22:00", isClosed: false }),
      });
    }
  }, [restaurant]);

  if (loading || !form) return null;

  const updateHour = (idx, key, value) => {
    const hours = [...form.openingHours];
    hours[idx] = { ...hours[idx], [key]: value };
    setForm({ ...form, openingHours: hours });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(form);
      showToast("Settings saved", "success");
      refetch();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl mb-6">Restaurant Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold">Business Info</h2>
          <Input label="Restaurant Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="WhatsApp Number" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
        </div>

        <div className="card p-5 space-y-3">
          <h2 className="font-semibold mb-2">Opening Hours</h2>
          {form.openingHours.map((h, idx) => (
            <div key={h.day} className="flex items-center gap-3">
              <span className="w-10 text-sm font-medium">{h.day}</span>
              <input
                type="time"
                value={h.open}
                onChange={(e) => updateHour(idx, "open", e.target.value)}
                disabled={h.isClosed}
                className="border border-brown/15 rounded-lg px-2 py-1.5 text-sm"
              />
              <span className="text-brown/40">–</span>
              <input
                type="time"
                value={h.close}
                onChange={(e) => updateHour(idx, "close", e.target.value)}
                disabled={h.isClosed}
                className="border border-brown/15 rounded-lg px-2 py-1.5 text-sm"
              />
              <label className="flex items-center gap-1.5 text-xs ml-auto">
                <input type="checkbox" checked={h.isClosed} onChange={(e) => updateHour(idx, "isClosed", e.target.checked)} />
                Closed
              </label>
            </div>
          ))}
        </div>

        <div className="card p-5 space-y-3">
          <h2 className="font-semibold mb-2">Ordering Control</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.manualOverrideClosed}
              onChange={(e) => setForm({ ...form, manualOverrideClosed: e.target.checked })}
            />
            Manually mark restaurant as closed (overrides hours, stops new orders)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.scheduledOrderingEnabled}
              onChange={(e) => setForm({ ...form, scheduledOrderingEnabled: e.target.checked })}
            />
            Allow scheduled ordering while closed
          </label>
        </div>

        <Button type="submit" loading={saving}>Save Settings</Button>
      </form>
    </div>
  );
}
