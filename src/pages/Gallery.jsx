import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { EmptyState } from "../components/ui/FormElements";
import { Image as ImageIcon } from "lucide-react";

const CATEGORIES = ["All", "Food", "Sweets", "Restaurant", "Interior", "Exterior"];

export default function Gallery() {
  const [active, setActive] = useState("All");
  // Images are admin-managed; empty by default until uploaded via Admin Panel.
  const images = [];
  const filtered = active === "All" ? images : images.filter((img) => img.category === active);

  return (
    <>
      <Helmet>
        <title>Gallery — Shree Munnalal</title>
      </Helmet>
      <div className="container-app py-8">
        <h1 className="text-2xl sm:text-3xl mb-6">Gallery</h1>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-xl2 text-sm font-medium border shrink-0 ${
                active === cat ? "bg-maroon text-white border-maroon" : "bg-white border-brown/15"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={ImageIcon} title="No photos yet" description="Photos will appear here once added by the restaurant." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((img) => (
              <img key={img._id} src={img.url} alt={img.alt || ""} loading="lazy" className="w-full aspect-square object-cover rounded-xl2" />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
