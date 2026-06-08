function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-Hant", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function badgeHtml(badges) {
  if (!badges.length) {
    return '<span class="muted">尚未取得徽章</span>';
  }

  return badges
    .map((badge) => `<span class="badge" title="${escapeHtml(badge.description)}">${escapeHtml(badge.label)}</span>`)
    .join("");
}

function progressBar(percent) {
  return `
    <div class="bar" aria-label="${percent}%">
      <div class="bar-fill" style="width:${percent}%"></div>
    </div>
  `;
}

export function buildTeamProgressHtmlReport(report) {
  const generatedAt = new Date();
  const students = report.students ?? [];
  const summary = report.summary ?? {};

  const studentRows = students
    .map(
      (student) => `
        <tr>
          <td>
            <strong>${escapeHtml(student.studentName)}</strong>
            <div class="muted">${escapeHtml(student.studentEmail || "-")}</div>
          </td>
          <td>${escapeHtml(student.department || "-")}</td>
          <td>${badgeHtml(student.badges)}</td>
          <td>${student.completedItems} / ${student.totalItems}</td>
          <td>
            <div class="metric-cell">
              ${progressBar(student.completionRate)}
              <strong>${student.completionRate}%</strong>
            </div>
          </td>
          <td>${student.quizCorrect} / ${student.quizAnswered}</td>
          <td><strong>${student.quizAccuracy}%</strong></td>
          <td>${formatDateTime(student.latestAt)}</td>
        </tr>
      `,
    )
    .join("");

  const badgeCards = students
    .map(
      (student) => `
        <article class="badge-card">
          <div class="badge-card-head">
            <div>
              <h3>${escapeHtml(student.studentName)}</h3>
              <p>${escapeHtml(student.department || student.studentEmail || "-")}</p>
            </div>
            <strong>${student.badges.length} badges</strong>
          </div>
          <div class="badge-list">${badgeHtml(student.badges)}</div>
        </article>
      `,
    )
    .join("");

  const sectionBlocks = students
    .map(
      (student) => `
        <article class="section-card">
          <h3>${escapeHtml(student.studentName)}</h3>
          <div class="section-grid">
            ${student.sectionProgress
              .map(
                (section) => `
                  <div>
                    <div class="section-line">
                      <span>${escapeHtml(section.label)}</span>
                      <span>${section.completed}/${section.total}</span>
                    </div>
                    ${progressBar(section.percent)}
                  </div>
                `,
              )
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");

  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>EETraining Team Progress Report</title>
  <style>
    :root {
      color-scheme: light;
      --navy: #0f172a;
      --text: #334155;
      --muted: #64748b;
      --line: #e2e8f0;
      --soft: #f8fafc;
      --green: #10b981;
      --amber: #b45309;
      --amber-bg: #fffbeb;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #f8fafc;
      color: var(--text);
      font-family: Inter, "Noto Sans TC", "Microsoft JhengHei", Arial, sans-serif;
      line-height: 1.5;
    }
    main {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      padding: 32px 0 48px;
    }
    header, section {
      margin-bottom: 20px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: white;
      box-shadow: 0 12px 30px rgb(15 23 42 / 0.06);
    }
    header { padding: 28px; }
    section { padding: 22px; }
    h1, h2, h3, p { margin: 0; }
    h1 { color: var(--navy); font-size: 30px; }
    h2 { color: var(--navy); font-size: 20px; margin-bottom: 16px; }
    h3 { color: var(--navy); font-size: 15px; }
    .eyebrow { color: var(--green); font-weight: 700; font-size: 13px; margin-bottom: 8px; }
    .description { max-width: 780px; margin-top: 10px; color: var(--muted); }
    .muted { color: var(--muted); font-size: 12px; }
    .stats {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 12px;
    }
    .stat {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 14px;
      background: var(--soft);
    }
    .stat span { display: block; color: var(--muted); font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .stat strong { display: block; color: var(--navy); font-size: 24px; margin-top: 8px; }
    .badge-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .badge-card, .section-card {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 14px;
      background: var(--soft);
    }
    .badge-card-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
    }
    .badge-card-head strong { color: var(--amber); font-size: 13px; white-space: nowrap; }
    .badge-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
    .badge {
      display: inline-flex;
      border: 1px solid #fde68a;
      border-radius: 999px;
      background: var(--amber-bg);
      color: var(--amber);
      padding: 4px 9px;
      font-size: 12px;
      font-weight: 700;
      margin: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      text-align: left;
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      border-bottom: 1px solid var(--line);
      padding: 10px 8px;
    }
    td {
      border-bottom: 1px solid #f1f5f9;
      padding: 12px 8px;
      vertical-align: top;
    }
    .metric-cell { display: grid; grid-template-columns: 1fr 44px; gap: 8px; align-items: center; }
    .bar {
      height: 8px;
      overflow: hidden;
      border-radius: 999px;
      background: #e2e8f0;
    }
    .bar-fill {
      height: 100%;
      border-radius: 999px;
      background: var(--green);
    }
    .section-grid {
      display: grid;
      gap: 10px;
      margin-top: 12px;
    }
    .section-line {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 5px;
      font-size: 12px;
    }
    .sections {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    footer {
      color: var(--muted);
      font-size: 12px;
      text-align: center;
      padding: 10px;
    }
    @media (max-width: 900px) {
      .stats, .badge-grid, .sections { grid-template-columns: 1fr; }
      table { min-width: 980px; }
      .table-wrap { overflow-x: auto; }
    }
    @media print {
      body { background: white; }
      header, section { box-shadow: none; break-inside: avoid; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="eyebrow">EETraining Team Report</p>
      <h1>EE 基礎訓練平台 - 團隊學習報告</h1>
      <p class="description">由主管後台匯入學員 CSV 後產生。此報告是 ${formatDateTime(generatedAt.toISOString())} 的本機快照，不會自動同步更新。</p>
    </header>

    <section>
      <h2>Team Average</h2>
      <div class="stats">
        <div class="stat"><span>Students</span><strong>${summary.studentCount ?? 0}</strong></div>
        <div class="stat"><span>Avg Completion</span><strong>${summary.averageCompletionRate ?? 0}%</strong></div>
        <div class="stat"><span>Avg Quiz Accuracy</span><strong>${summary.averageQuizAccuracy ?? 0}%</strong></div>
        <div class="stat"><span>Total Badges</span><strong>${summary.totalBadges ?? 0}</strong></div>
        <div class="stat"><span>Latest Activity</span><strong style="font-size:16px">${formatDateTime(summary.latestAt)}</strong></div>
      </div>
    </section>

    <section>
      <h2>技能徽章牆</h2>
      <div class="badge-grid">${badgeCards}</div>
    </section>

    <section>
      <h2>個人進度表</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>學員</th>
              <th>部門</th>
              <th>技能徽章</th>
              <th>完成項目</th>
              <th>完成率</th>
              <th>Quiz</th>
              <th>Quiz 正確率</th>
              <th>最後學習時間</th>
            </tr>
          </thead>
          <tbody>${studentRows}</tbody>
        </table>
      </div>
    </section>

    <section>
      <h2>各分類完成率</h2>
      <div class="sections">${sectionBlocks}</div>
    </section>

    <footer>
      EETraining report generated locally from imported CSV records.
    </footer>
  </main>
</body>
</html>`;
}

export function downloadTeamProgressHtmlReport(report) {
  const date = new Date().toISOString().slice(0, 10);
  const html = buildTeamProgressHtmlReport(report);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `EETraining-Team-Progress-${date}.html`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
