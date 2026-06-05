import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Search,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { Fragment, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  allLearningItems,
  dailyQuestion,
  kpis,
  learningPath,
} from "../data/trainingData.js";
import { useTeamProgressImport } from "../hooks/useTeamProgressImport.js";
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

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-Hant", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function TeamStat({ label, value, suffix = "" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-navy-900">
        {value}
        {suffix}
      </p>
    </div>
  );
}

function TeamProgressPanel() {
  const teamProgress = useTeamProgressImport();
  const [expandedStudent, setExpandedStudent] = useState("");
  const students = teamProgress.report.students;
  const summary = teamProgress.report.summary;

  function handleImport(event) {
    teamProgress.importCsvFiles(event.target.files);
    event.target.value = "";
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-navy-700" aria-hidden="true" />
            <h2 className="text-2xl font-semibold text-navy-900">團隊學習狀況</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            匯入多位學員從「學習紀錄」頁匯出的 CSV，Dashboard 會在主管端瀏覽器彙整每個人的完成率與 Quiz 表現。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="focus-ring inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white transition hover:bg-navy-800">
            <Upload className="h-4 w-4" aria-hidden="true" />
            匯入 CSV
            <input className="sr-only" type="file" accept=".csv,text/csv" multiple onChange={handleImport} />
          </label>
          <button
            type="button"
            onClick={teamProgress.clearImportedRecords}
            disabled={!teamProgress.records.length}
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            清空匯入資料
          </button>
        </div>
      </div>

      {teamProgress.importStatus ? (
        <div
          className={[
            "mt-4 rounded-lg border px-4 py-3 text-sm",
            teamProgress.importStatus.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-teal-200 bg-teal-50 text-teal-800",
          ].join(" ")}
        >
          {teamProgress.importStatus.message}
        </div>
      ) : null}

      {students.length ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <TeamStat label="Students" value={summary.studentCount} />
            <TeamStat label="Avg Completion" value={summary.averageCompletionRate} suffix="%" />
            <TeamStat label="Avg Quiz Accuracy" value={summary.averageQuizAccuracy} suffix="%" />
            <TeamStat label="Latest Activity" value={formatDateTime(summary.latestAt)} />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">學員</th>
                  <th className="px-3 py-3">部門</th>
                  <th className="px-3 py-3">完成項目</th>
                  <th className="px-3 py-3">完成率</th>
                  <th className="px-3 py-3">Quiz</th>
                  <th className="px-3 py-3">Quiz 正確率</th>
                  <th className="px-3 py-3">最後學習時間</th>
                  <th className="px-3 py-3">明細</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const expanded = expandedStudent === student.studentKey;
                  return (
                    <Fragment key={student.studentKey}>
                      <tr>
                        <td className="px-3 py-3">
                          <p className="font-semibold text-navy-900">{student.studentName}</p>
                          <p className="text-xs text-slate-500">{student.studentEmail || "-"}</p>
                        </td>
                        <td className="px-3 py-3 text-slate-600">{student.department || "-"}</td>
                        <td className="px-3 py-3 text-slate-700">
                          {student.completedItems} / {student.totalItems}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-signal-green"
                                style={{ width: `${student.completionRate}%` }}
                              />
                            </div>
                            <span className="font-semibold text-slate-700">{student.completionRate}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-700">
                          {student.quizCorrect} / {student.quizAnswered}
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-700">{student.quizAccuracy}%</td>
                        <td className="px-3 py-3 text-slate-500">{formatDateTime(student.latestAt)}</td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => setExpandedStudent(expanded ? "" : student.studentKey)}
                            className="focus-ring inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                          >
                            {expanded ? "收合" : "展開"}
                            <ChevronDown
                              className={[
                                "h-4 w-4 transition",
                                expanded ? "rotate-180" : "",
                              ].join(" ")}
                              aria-hidden="true"
                            />
                          </button>
                        </td>
                      </tr>
                      {expanded ? (
                        <tr>
                          <td colSpan="8" className="bg-slate-50 px-4 py-4">
                            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                              <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <p className="font-semibold text-navy-900">章節完成率</p>
                                <div className="mt-3 grid gap-3">
                                  {student.sectionProgress.map((section) => (
                                    <div
                                      key={section.section}
                                      className="grid grid-cols-[5.5rem_1fr_4.5rem] items-center gap-3 text-xs"
                                    >
                                      <span className="font-medium text-slate-600">{section.label}</span>
                                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                          className="h-full rounded-full bg-navy-500"
                                          style={{ width: `${section.percent}%` }}
                                        />
                                      </div>
                                      <span className="text-right text-slate-500">
                                        {section.completed}/{section.total}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <p className="font-semibold text-navy-900">最近 5 筆紀錄</p>
                                <div className="mt-3 grid gap-2">
                                  {student.recentRecords.map((record) => (
                                    <div
                                      key={`${student.studentKey}-${record.recordId || record.createdAt}-${record.itemId || record.questionId}`}
                                      className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                                    >
                                      <p className="font-medium text-slate-800">
                                        {record.type === "quiz"
                                          ? record.question
                                          : record.itemName || record.itemId}
                                      </p>
                                      <p className="mt-1">
                                        {formatDateTime(record.createdAt)} ·{" "}
                                        {record.type === "quiz"
                                          ? record.isCorrect
                                            ? "Quiz 答對"
                                            : "Quiz 答錯"
                                          : record.completed
                                            ? "標記完成"
                                            : "取消完成"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
          <h3 className="text-lg font-semibold text-navy-900">尚未匯入團隊 CSV</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            請先從各學員收集「學習紀錄」頁匯出的 CSV，再使用上方「匯入 CSV」一次選取多個檔案。
          </p>
        </div>
      )}
    </section>
  );
}

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

      <TeamProgressPanel />

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
