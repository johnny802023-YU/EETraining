import { CheckCircle2, Circle, Wrench } from "lucide-react";

function DetailList({ title, items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-500">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-green" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ContentCard({
  title,
  subtitle,
  category,
  description,
  details,
  itemId,
  itemName,
  section,
  sectionLabel,
  isCompleted,
  onToggleComplete,
}) {
  const CompletedIcon = isCompleted ? CheckCircle2 : Circle;

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {category ? (
              <span className="rounded-md border border-navy-100 bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-800">
                {category}
              </span>
            ) : null}
            {isCompleted ? (
              <span className="rounded-md border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                已完成
              </span>
            ) : null}
          </div>
          <h2 className="text-xl font-semibold text-navy-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p> : null}
        </div>
        <Wrench className="mt-1 h-5 w-5 shrink-0 text-slate-300" aria-hidden="true" />
      </div>

      {description ? <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p> : null}

      <div className="mt-5 grid gap-4">
        {details.map((detail) => (
          <DetailList key={detail.title} title={detail.title} items={detail.items} />
        ))}
      </div>

      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={() =>
            onToggleComplete(itemId, {
              itemName: itemName ?? title,
              section,
              sectionLabel,
              category,
            })
          }
          className={[
            "focus-ring flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition",
            isCompleted
              ? "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
              : "border-slate-200 bg-white text-slate-600 hover:border-navy-200 hover:bg-navy-50 hover:text-navy-900",
          ].join(" ")}
        >
          <CompletedIcon className="h-4 w-4" aria-hidden="true" />
          {isCompleted ? "完成" : "標記完成"}
        </button>
      </div>
    </article>
  );
}
