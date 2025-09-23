import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CategoryFilterProps {
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ className = "" }) => {
  const pathname = usePathname();
  const currentCategory = pathname.includes("/category/")
    ? pathname.split("/category/")[1]
    : "all";

  const categories = [
    { id: "all", name: "All Products", icon: "📱" },
    { id: "smartphones", name: "Smartphones", icon: "📱" },
    { id: "tablets", name: "Tablets", icon: "📱" },
    { id: "accessories", name: "Accessories", icon: "🎧" },
    { id: "cases", name: "Cases & Covers", icon: "🛡️" },
    { id: "chargers", name: "Chargers", icon: "🔌" },
    { id: "earphones", name: "Earphones", icon: "🎧" },
    { id: "powerbanks", name: "Power Banks", icon: "🔋" },
    { id: "cables", name: "Cables", icon: "🔌" },
    { id: "screen-protectors", name: "Screen Protectors", icon: "🛡️" },
  ];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={
              category.id === "all"
                ? "/products"
                : `/products/category/${category.id}`
            }
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              currentCategory === category.id
                ? "bg-orange-100 text-orange-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg mr-3">{category.icon}</span>
            <span className="text-sm">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
