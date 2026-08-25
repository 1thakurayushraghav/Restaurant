import { Search, SlidersHorizontal } from "lucide-react";

export function SearchBar({ value, onChange, placeholder = "Search for food or sweets..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown/40" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search menu"
        className="w-full pl-11 pr-4 py-3 rounded-xl2 border border-brown/15 bg-white focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition"
      />
    </div>
  );
}

export function FilterBar({ filters, onChange }) {
  const { isVeg, isBestseller, sort } = filters;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onChange({ ...filters, isVeg: !isVeg })}
        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl2 border transition-colors ${
          isVeg ? "bg-veg text-white border-veg" : "bg-white border-brown/15 text-brown"
        }`}
        aria-pressed={isVeg}
      >
        <span className={isVeg ? "veg-dot bg-white" : "veg-dot"} /> Veg Only
      </button>

      <button
        onClick={() => onChange({ ...filters, isBestseller: !isBestseller })}
        className={`text-sm font-medium px-3 py-2 rounded-xl2 border transition-colors ${
          isBestseller ? "bg-saffron text-white border-saffron" : "bg-white border-brown/15 text-brown"
        }`}
        aria-pressed={isBestseller}
      >
        Bestsellers
      </button>

      <div className="flex items-center gap-1.5 ml-auto">
        <SlidersHorizontal className="w-4 h-4 text-brown/40" />
        <select
          value={sort || ""}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          className="text-sm border border-brown/15 rounded-xl2 px-3 py-2 bg-white"
          aria-label="Sort products"
        >
          <option value="">Sort: Recommended</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A-Z</option>
        </select>
      </div>
    </div>
  );
}
