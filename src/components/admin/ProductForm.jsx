import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input, Select } from "../ui/FormElements";
import Button from "../ui/Button";
import { slugify } from "../../utils/format";

export default function ProductForm({ initial, categories, onSubmit, submitting }) {
  const [form, setForm] = useState(
  initial
    ? {
        ...initial,
        category:
          typeof initial.category === "object"
            ? initial.category?._id || ""
            : initial.category || "",
        variants: (initial.variants || []).map((v) => ({
          label: v.label || "",
          price: Number(v.price) || 0,
          isAvailable: v.isAvailable !== false,
          ...(v.sku ? { sku: v.sku } : {}),
        })),
        images: initial.images || [],
        tags: initial.tags || [],
        ingredients: initial.ingredients || [],
        allergens: initial.allergens || [],
        description: initial.description || "",
        isVeg: initial.isVeg !== false,
        isAvailable: initial.isAvailable !== false,
        isFeatured: initial.isFeatured === true,
        isBestseller: initial.isBestseller === true,
      }
    : {
        name: "",
        slug: "",
        description: "",
        category: categories?.[0]?._id || "",
        images: [],
        variants: [{ label: "", price: 0, isAvailable: true }],
        isVeg: true,
        isAvailable: true,
        isFeatured: false,
        isBestseller: false,
        tags: [],
        ingredients: [],
        allergens: [],
      }
);

  const updateVariant = (idx, key, value) => {
    const variants = [...form.variants];
    variants[idx] = { ...variants[idx], [key]: value };
    setForm({ ...form, variants });
  };

  const addVariant = () => setForm({ ...form, variants: [...form.variants, { label: "", price: 0, isAvailable: true }] });
  const removeVariant = (idx) => setForm({ ...form, variants: form.variants.filter((_, i) => i !== idx) });

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm({ ...form, name, slug: initial ? form.slug : slugify(name) });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <Input label="Product Name" required value={form.name} onChange={handleNameChange} />
      <Input label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <Select label="Category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </Select>

      <div>
        <label className="block text-sm font-medium mb-2">Variants (size/weight + price)</label>
        <div className="space-y-2">
          {form.variants.map((v, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <Input placeholder="Label (e.g. 250g)" value={v.label} onChange={(e) => updateVariant(idx, "label", e.target.value)} className="flex-1" />
              <Input type="number" placeholder="Price" value={v.price} onChange={(e) => updateVariant(idx, "price", Number(e.target.value))} className="w-28" />
              <button type="button" onClick={() => removeVariant(idx)} className="p-2.5 text-nonveg" aria-label="Remove variant">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addVariant} className="mt-2 flex items-center gap-1 text-sm text-maroon font-medium">
          <Plus className="w-4 h-4" /> Add Variant
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} /> Vegetarian
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} /> Available
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isBestseller} onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })} /> Bestseller
        </label>
      </div>

      <Button type="submit" loading={submitting} className="w-full">
        Save Product
      </Button>
    </form>
  );
}
