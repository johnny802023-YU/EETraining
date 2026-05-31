export default function CategoryFilter({ categories, activeCategory, onChange }) {
  return (
    <div className="mb-5 overflow-x-auto pb-1">
      <div className="inline-flex min-h-11 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              className={[
                "focus-ring rounded-md px-4 py-2 text-sm font-medium transition",
                active ? "bg-navy-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-navy-900",
              ].join(" ")}
              type="button"
              onClick={() => onChange(category)}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
