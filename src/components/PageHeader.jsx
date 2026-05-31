export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-sm font-semibold text-signal-green">{eyebrow}</p> : null}
        <h1 className="mt-1 text-3xl font-semibold text-navy-900 lg:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
