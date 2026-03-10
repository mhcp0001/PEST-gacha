import type { FilterCategory } from "../types";

interface CategoryFilterProps {
  filter: FilterCategory;
  onFilterChange: (category: FilterCategory) => void;
}

const categories: { value: FilterCategory; label: string }[] = [
  { value: "ALL", label: "ALL" },
  { value: "MEGA", label: "MEGA" },
  { value: "MIDDLE", label: "MIDDLE" },
  { value: "MICRO", label: "MICRO" },
];

const colorMap: Record<FilterCategory, string> = {
  ALL: "bg-all text-bg-primary",
  MEGA: "bg-mega text-white",
  MIDDLE: "bg-middle text-bg-primary",
  MICRO: "bg-micro text-bg-primary",
};

export default function CategoryFilter({
  filter,
  onFilterChange,
}: CategoryFilterProps) {
  return (
    <div
      className="flex rounded-full border border-text-muted/30 overflow-hidden"
      role="radiogroup"
      aria-label="カテゴリフィルター"
    >
      {categories.map(({ value, label }) => (
        <button
          key={value}
          role="radio"
          aria-checked={filter === value}
          onClick={() => onFilterChange(value)}
          className={`px-4 py-2 text-xs font-medium tracking-wider transition-all duration-200 cursor-pointer ${
            filter === value
              ? colorMap[value]
              : "bg-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
