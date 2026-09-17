import { useEffect, useRef } from "react";
import { ExternalLink, X, ZoomIn } from "lucide-react";
import { getLearningResources } from "../data/learningResources.js";

export default function LearningResources({ itemId }) {
  const { diagram, references } = getLearningResources(itemId);
  const dialogRef = useRef(null);
  const src = diagram ? `${import.meta.env.BASE_URL}images/learning/${diagram.file}.svg` : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    return () => { if (dialog?.open) dialog.close(); };
  }, []);

  if (!diagram && !references.length) return null;

  return (
    <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
      {diagram && (
        <figure>
          <button type="button" onClick={() => dialogRef.current?.showModal()}
            className="focus-ring group relative block w-full overflow-hidden rounded-md border border-slate-200 bg-slate-50"
            aria-label={`放大：${diagram.title}`} title="放大教學圖">
            <img src={src} alt={diagram.title} width="640" height="360" loading="lazy" className="aspect-video w-full object-contain" />
            <span className="absolute right-2 top-2 rounded bg-white p-1.5 text-navy-900 shadow-sm"><ZoomIn className="h-4 w-4" /></span>
          </button>
          <figcaption className="mt-2 text-xs leading-5 text-slate-500">
            <span className="font-semibold text-slate-700">{diagram.title} · EETraining 教學示意</span><br />{diagram.caption}
          </figcaption>
          <dialog ref={dialogRef} aria-label={diagram.title}
            onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
            className="m-auto max-h-[90dvh] w-[min(960px,94vw)] overflow-auto rounded-lg p-0 shadow-xl backdrop:bg-black/60">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-3">
              <h3 className="font-semibold text-navy-900">{diagram.title}</h3>
              <button type="button" onClick={() => dialogRef.current.close()} aria-label="關閉圖片" title="關閉圖片" className="focus-ring shrink-0 rounded p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <img src={src} alt={diagram.title} width="640" height="360" className="w-full" />
            <p className="px-5 py-4 text-sm leading-6 text-slate-600">{diagram.caption}</p>
          </dialog>
        </figure>
      )}
      {references.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500">原廠參考資料</p>
          <ul className="mt-2 space-y-2">
            {references.map((reference) => (
              <li key={reference.url}>
                <a href={reference.url} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-start gap-2 rounded text-sm leading-6 text-teal-700 hover:underline">
                  <ExternalLink className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{reference.title}<span className="block text-xs text-slate-500">{reference.kind} · 開啟新分頁</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
