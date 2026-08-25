import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { adminApi } from "../../services/adminApi";
import { Input } from "../../components/ui/FormElements";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";
import { slugify } from "../../utils/format";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Categories() {
  const { data: categories, loading, refetch } = useFetch(() => adminApi.getCategories(), []);
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "", sortOrder: 0, isActive: true });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", icon: "", sortOrder: (categories?.length || 0) + 1, isActive: true });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || "", sortOrder: cat.sortOrder, isActive: cat.isActive });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateCategory(editing._id, form);
        showToast("Category updated", "success");
      } else {
        await adminApi.createCategory(form);
        showToast("Category created", "success");
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
      await adminApi.deleteCategory(deleteTarget._id);
      showToast("Category deleted", "success");
      refetch();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Categories</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {!loading && (
        <div className="card divide-y divide-brown/10">
          {(categories || []).map((cat) => (
            <div key={cat._id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.icon || "🍽️"}</span>
                <div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs text-brown/50">/{cat.slug} · order {cat.sortOrder}</p>
                </div>
                {!cat.isActive && (
                  <span className="text-xs bg-brown/10 text-brown/60 px-2 py-0.5 rounded-full">Disabled</span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)} className="p-2 text-maroon" aria-label="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTarget(cat)} className="p-2 text-nonveg" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })}
          />
          <Input label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input label="Icon (emoji)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <Input
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
          <Button type="submit" loading={saving} className="w-full">
            Save Category
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this category?"
        description={`"${deleteTarget?.name}" will be removed. Categories with products cannot be deleted.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
