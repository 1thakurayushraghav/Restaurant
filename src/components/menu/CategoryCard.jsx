import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/menu/${category.slug}`}
      className="flex flex-col items-center gap-2 shrink-0 group"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-card flex items-center justify-center text-3xl group-hover:shadow-cardHover group-hover:-translate-y-0.5 transition-all overflow-hidden">
        {category.image ? (
          <img src={category.image} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span aria-hidden="true">{category.icon || "🍽️"}</span>
        )}
      </div>
      <span className="text-xs sm:text-sm font-medium text-brown text-center">{category.name}</span>
    </Link>
  );
}
