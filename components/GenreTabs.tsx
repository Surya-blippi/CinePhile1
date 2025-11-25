import React from 'react';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelect
}) => {
  return (
    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`
              px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap
              transition-all duration-300 shadow-sm
              ${isSelected
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 shadow-lg shadow-yellow-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};