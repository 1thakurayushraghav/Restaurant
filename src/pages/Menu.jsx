import { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PackageSearch } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { categoryApi } from "../services/categoryApi";
import { productApi } from "../services/productApi";
import ProductCard from "../components/menu/ProductCard";
import CategoryCard from "../components/menu/CategoryCard";
import { SearchBar, FilterBar } from "../components/menu/SearchFilter";
import { Skeleton, EmptyState, ErrorState } from "../components/ui/FormElements";

export default function Menu() {
  const { category: categorySlug } = useParams();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ isVeg: false, isBestseller: false, sort: "" });
  const debouncedSearch = useDebounce(search, 400);

  const { data: categories } = useFetch(() => categoryApi.getAll(), []);

  const fetcher = useCallback(() => {
    if (debouncedSearch.trim()) {
      return productApi.search(debouncedSearch).then((products) => ({ data: { products } }));
    }
    return productApi.getAll({
      category: categorySlug,
      isVeg: filters.isVeg || undefined,
      isBestseller: filters.isBestseller || undefined,
      sort: filters.sort || undefined,
      limit: 40,
    });
  }, [categorySlug, filters, debouncedSearch]);

  const { data, loading, error, refetch } = useFetch(fetcher, [fetcher]);
  const products = data?.data?.products || [];

  const activeCategory = useMemo(
    () => categories?.find((c) => c.slug === categorySlug),
    [categories, categorySlug]
  );

  const pageTitle = activeCategory ? `${activeCategory.name} Menu` : "Full Menu";

  return (
    <>
      <Helmet>
        <title>{pageTitle} — Shree Munnalal</title>
        <meta name="description" content={`Browse our ${pageTitle.toLowerCase()} — fresh, vegetarian, and made with care.`} />
      </Helmet>

      <div className="container-app py-8">
        <h1 className="text-2xl sm:text-3xl mb-6">{pageTitle}</h1>

        {categories && categories.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-xl2" />
            ))}
          </div>
        ) : error ? (
          <ErrorState description={error} onRetry={refetch} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No items found"
            description="Try a different search term or category."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
