import { Category } from "@/contexts/CategoryContext";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color || "#000" }}
          ></div>
          <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
        </div>
        <div className="flex gap-2">
          <EditButton onClick={() => onEdit(category)} width={5} height={5} />

          <DeleteButton
            onClick={() => onDelete(category)}
            width={6}
            height={6}
          ></DeleteButton>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        {category.subcategories.length} subcategorias
      </p>

      <div className="flex flex-wrap gap-2">
        {category.subcategories.map((sub) => (
          <span
            key={sub}
            className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full"
          >
            {sub}
          </span>
        ))}
      </div>
    </div>
  );
}
