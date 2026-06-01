import { ArrowRight, BookOpen, CheckCircle2, CircleHelp, Search } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import {
  allLearningItems,
  dailyQuestion,
  kpis,
  learningPath,
} from "../data/trainingData.js";
import { itemMatchesQuery } from "../utils/search.js";

const sectionRoutes = {
  components: "/components",
  circuits: "/circuits",
  protocols: "/protocols",
  debug: "/debug",
  automotive: "/automotive",
};

const toneClasses = {
  teal: "border-teal-100 bg-teal-50 text-teal-700",
  blue: "border-blue-100 bg-blue-50 text-blue-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
  cyan: "border-cyan-100 bg-cyan-50 text-cyan-700",
};

export default function Dashboard() {
  const { searchQuery, progress } = useOutletContext();
  const searchResults = searchQuery
    ? allLearningItems.filter((item) => itemMatchesQuery(item, searchQuery)).slice(0, 8)
    : [];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-semibold text-signal-green">For EE Training</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-navy-900 lg:text-5xl">
              EE 基礎訓練平台
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              給電子工程師的實戰性基礎訓練網站
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {kpis.map((kpi) => {
                const sectionProgress = progress.getSectionProgress(kpi.id === "debug" ? "debug" : kpi.id);
                return (
                  <Link
                    key={kpi.id}
                    to={sectionRoutes[kpi.id] ?? "/"}
                    className="focus-ring rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{kpi.title}</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-950">{kpi.value}</p>
                        <p className="text-xs text-slate-500">{kpi.unit}</p>
                      </div>
                      <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${toneClasses[kpi.tone]}`}>
                        {sectionProgress.percent}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[18rem] overflow-hidden bg-slate-100">
            <img
              src={`${import.meta.env.BASE_URL}ee-dashboard-workbench.png`}
              alt="工程訓練桌面，包含 PCB、示波器探棒與量測儀器"
              className="h-full min-h-[18rem] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-white/90 px-5 py-4 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-navy-900">整體學習進度</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {progress.completed} / {progress.total} cards completed
                  </p>
                </div>
                <p className="text-3xl font-semibold text-navy-900">{progress.percent}%</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-signal-green transition-all"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {searchQuery ? (
        <section className="rounded-lg border border-navy-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-navy-700" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-navy-900">搜尋結果</h2>
          </div>
          {searchResults.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {searchResults.map((item) => (
                <Link
                  key={`${item.section}-${item.id}`}
                  to={sectionRoutes[item.section]}
                  className="focus-ring rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-navy-200 hover:bg-white hover:shadow-sm"
                >
                  <p className="text-xs font-semibold text-slate-500">{item.sectionLabel}</p>
                  <p className="mt-1 font-semibold text-navy-900">{item.name}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {item.summary ??
                      item.purpose ??
                      item.useCases?.join("、") ??
                      item.symptom ??
                      item.systemFunction}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">沒有找到符合「{searchQuery}」的內容。</p>
          )}
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-signal-green">Recommended Path</p>
              <h2 className="mt-1 text-2xl font-semibold text-navy-900">推薦學習路徑</h2>
            </div>
            <BookOpen className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <div className="grid gap-4">
            {learningPath.map((step, index) => (
              <div key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-5 flex items-center gap-2">
            <CircleHelp className="h-5 w-5 text-signal-amber" aria-hidden="true" />
            <h2 className="text-2xl font-semibold text-navy-900">{dailyQuestion.title}</h2>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <p className="text-lg font-semibold leading-7 text-slate-950">{dailyQuestion.question}</p>
            <p className="mt-4 text-sm leading-6 text-amber-950">{dailyQuestion.answer}</p>
          </div>
          <Link
            to="/quiz"
            className="focus-ring mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            前往測驗
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-4">
            <div className="flex items-center gap-2 font-semibold text-teal-800">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              FA Debug Mindset
            </div>
            <p className="mt-2 text-sm leading-6 text-teal-900">
              先定義現象，再建立假設、量測關鍵點、縮小範圍，最後用 A/B 或邊界條件驗證修正。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
