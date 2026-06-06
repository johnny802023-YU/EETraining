import { Award, ChevronDown, ShieldCheck, TrendingUp, Trash2, Upload, Users } from "lucide-react";
import { Fragment, useState } from "react";
import { useTeamProgressImport } from "../hooks/useTeamProgressImport.js";

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

function BadgePill({ badge }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800"
      title={badge.description}
    >
      <Award className="h-3.5 w-3.5" aria-hidden="true" />
      {badge.label}
    </span>
  );
}

export default function TeamProgressAdminPage() {
  const teamProgress = useTeamProgressImport();
  const [expandedStudent, setExpandedStudent] = useState("");
  const students = teamProgress.report.students;
  const summary = teamProgress.report.summary;

  function handleImport(event) {
    teamProgress.importCsvFiles(event.target.files);
    event.target.value = "";
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-signal-green">Admin Console</p>
            <h1 className="mt-1 text-3xl font-semibold text-navy-900">
              主管後台：團隊學習狀況
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
              此頁為隱藏主管頁面，不會出現在 Sidebar。匯入後的彙整資料只存在目前這台電腦的瀏覽器，
              不會同步給其他人，也不會寫入 GitHub repo。
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-navy-700" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-navy-900">團隊 CSV 匯入彙整</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              匯入多位學員從「學習紀錄」頁匯出的 CSV，系統會在主管端瀏覽器彙整 Team Average、技能徽章與每位學員的學習狀態。
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
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <TeamStat label="Students" value={summary.studentCount} />
              <TeamStat label="Avg Completion" value={summary.averageCompletionRate} suffix="%" />
              <TeamStat label="Avg Quiz Accuracy" value={summary.averageQuizAccuracy} suffix="%" />
              <TeamStat label="Avg Skill Badges" value={summary.averageBadgeCount} />
              <TeamStat label="Latest Activity" value={formatDateTime(summary.latestAt)} />
            </div>

            <div className="mt-5 rounded-lg border border-navy-100 bg-slate-50 p-4">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-navy-700" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-navy-900">Team Average</h3>
              </div>
              <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-700">平均學習完成率</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-signal-green"
                        style={{ width: `${summary.averageCompletionRate}%` }}
                      />
                    </div>
                    <span className="text-xl font-semibold text-navy-900">{summary.averageCompletionRate}%</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    用團隊平均值觀察訓練推進狀態，避免把單一學員完成率當成公開排名。
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-700">團隊徽章累積</p>
                  <p className="mt-3 text-3xl font-semibold text-navy-900">{summary.totalBadges}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    平均每位學員 {summary.averageBadgeCount} 枚技能徽章，適合用來呈現能力分布與訓練成果。
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-navy-900">技能徽章牆</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {students.map((student) => (
                  <div key={student.studentKey} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-navy-900">{student.studentName}</p>
                        <p className="mt-1 text-xs text-slate-500">{student.department || student.studentEmail || "-"}</p>
                      </div>
                      <span className="text-sm font-semibold text-amber-700">{student.badges.length} badges</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {student.badges.length ? (
                        student.badges.map((badge) => <BadgePill key={badge.id} badge={badge} />)
                      ) : (
                        <span className="text-sm text-slate-500">尚未取得徽章</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[1080px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">學員</th>
                    <th className="px-3 py-3">部門</th>
                    <th className="px-3 py-3">技能徽章</th>
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
                          <td className="px-3 py-3">
                            <div className="flex max-w-[14rem] flex-wrap gap-1.5">
                              {student.badges.length ? (
                                student.badges.map((badge) => <BadgePill key={badge.id} badge={badge} />)
                              ) : (
                                <span className="text-xs text-slate-400">-</span>
                              )}
                            </div>
                          </td>
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
                                className={["h-4 w-4 transition", expanded ? "rotate-180" : ""].join(" ")}
                                aria-hidden="true"
                              />
                            </button>
                          </td>
                        </tr>
                        {expanded ? (
                          <tr>
                            <td colSpan="9" className="bg-slate-50 px-4 py-4">
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
    </div>
  );
}
