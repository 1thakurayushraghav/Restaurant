import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { adminApi } from "../../services/adminApi";
import { Price } from "../../components/ui/Misc";
import { Skeleton, EmptyState } from "../../components/ui/FormElements";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/Misc";
import ProductForm from "../../components/admin/ProductForm";
import { useToast } from "../../components/ui/Toast";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

export default function Products() {
  const { data, loading, refetch } = useFetch(() => adminApi.getProducts({ limit: 100 }), []);
  const { data: categories } = useFetch(() => adminApi.getCategories(), []);
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const products = data?.data?.products || [];

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateProduct(editing._id, formData);
        showToast("Product updated", "success");
      } else {
        await adminApi.createProduct(formData);
        showToast("Product created", "success");
      }
      setModalOpen(false);
      setEditing(null);
      refetch();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteProduct(deleteTarget._id);
      showToast("Product deleted", "success");
      refetch();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Products</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl2" />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState icon={Package} title="No products yet" description="Add your first product to get started." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-brown/50">{p.category?.name}</p>
                </div>
                <span className={p.isVeg ? "veg-dot" : "nonveg-dot"} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <Price amount={p.variants[0]?.price} size="sm" />
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.isAvailable ? "bg-veg/10 text-veg" : "bg-nonveg/10 text-nonveg"}`}>
                  {p.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-brown/10">
                <button
                  onClick={() => {
                    setEditing(p);
                    setModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg bg-maroon/5 text-maroon"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg bg-nonveg/5 text-nonveg"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "Add Product"} size="lg">
        <ProductForm
          initial={editing}
          categories={categories || []}
          onSubmit={handleSave}
          submitting={saving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this product?"
        description={`"${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
