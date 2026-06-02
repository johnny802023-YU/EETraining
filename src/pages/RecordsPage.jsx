import { Download, RotateCcw, Save, UserRound } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-Hant", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-navy-900">{value}</p>
    </div>
  );
}

export default function RecordsPage() {
  const { trainingRecords } = useOutletContext();
  const [form, setForm] = useState(trainingRecords.profile);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    trainingRecords.updateProfile(form);
  }

  const latestRecords = trainingRecords.records.slice(0, 12);

  return (
    <div>
      <PageHeader
        eyebrow="Training Records"
        title="學習紀錄"
        description="設定學員資料，網站會把完成標記與 Quiz 作答記錄在本機瀏覽器，並可匯出 CSV 供主管彙整。"
      />

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-5 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-navy-700" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-navy-900">學員資料設定</h2>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              姓名
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="focus-ring h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-900"
                placeholder="例如：王小明"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email
              <input
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="focus-ring h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-900"
                placeholder="name@company.com"
                type="email"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              部門
              <input
                value={form.department}
                onChange={(event) => updateField("department", event.target.value)}
                className="focus-ring h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-900"
                placeholder="例如：EE / FA / Validation"
              />
            </label>

            <button
              type="submit"
              className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white transition hover:bg-navy-800"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              儲存學員資料
            </button>
          </form>

          <div
            className={[
              "mt-5 rounded-lg border p-4 text-sm leading-6",
              trainingRecords.profileComplete
                ? "border-teal-100 bg-teal-50 text-teal-900"
                : "border-amber-100 bg-amber-50 text-amber-950",
            ].join(" ")}
          >
            {trainingRecords.profileComplete
              ? "學員資料已設定。後續完成標記與 Quiz 作答會帶入這組資料。"
              : "建議先完成學員資料，否則匯出的 CSV 會缺少姓名、Email 或部門。"}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-xl font-semibold text-navy-900">紀錄匯出</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Records" value={trainingRecords.summary.totalRecords} />
            <StatCard label="Completion Events" value={trainingRecords.summary.completionEvents} />
            <StatCard label="Quiz Events" value={trainingRecords.summary.quizEvents} />
            <StatCard label="Completed Items" value={trainingRecords.summary.completedItems} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={trainingRecords.exportCsv}
              disabled={!trainingRecords.records.length}
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-40"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              匯出 CSV
            </button>
            <button
              type="button"
              onClick={trainingRecords.clearRecords}
              disabled={!trainingRecords.records.length}
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              清空本機紀錄
            </button>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            CSV 會包含學員資料、完成/取消完成事件、Quiz 作答、正確答案與時間。資料只存在目前這台電腦的瀏覽器。
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-xl font-semibold text-navy-900">近期紀錄</h2>
        {latestRecords.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">時間</th>
                  <th className="px-3 py-3">類型</th>
                  <th className="px-3 py-3">分類</th>
                  <th className="px-3 py-3">項目 / 題目</th>
                  <th className="px-3 py-3">結果</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {latestRecords.map((record) => (
                  <tr key={record.recordId}>
                    <td className="px-3 py-3 text-slate-500">{formatDateTime(record.createdAt)}</td>
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {record.type === "quiz" ? "Quiz" : "完成標記"}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{record.category ?? record.sectionLabel}</td>
                    <td className="px-3 py-3 text-slate-900">{record.itemName ?? record.question}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {record.type === "quiz"
                        ? record.isCorrect
                          ? "答對"
                          : "答錯"
                        : record.completed
                          ? "完成"
                          : "取消完成"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
            目前沒有紀錄。標記任一張學習卡片完成，或完成 Quiz 作答後，這裡會出現紀錄。
          </p>
        )}
      </section>
    </div>
  );
}
