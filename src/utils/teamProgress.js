const csvHeaders = {
  recordId: "Record ID",
  createdAt: "Created At",
  studentName: "Student Name",
  studentEmail: "Student Email",
  department: "Department",
  type: "Type",
  action: "Action",
  section: "Section",
  sectionLabel: "Section Label",
  category: "Category",
  itemId: "Item ID",
  itemName: "Item Name",
  completed: "Completed",
  questionId: "Question ID",
  question: "Question",
  selectedOption: "Selected Option",
  correctOption: "Correct Option",
  isCorrect: "Is Correct",
};

const requiredHeaders = [
  csvHeaders.createdAt,
  csvHeaders.studentName,
  csvHeaders.studentEmail,
  csvHeaders.type,
];

const sectionLabels = {
  components: "元件",
  circuits: "電路",
  protocols: "通訊",
  debug: "FA Debug",
  automotive: "車用系統",
};

function sectionStat(sectionProgress, section) {
  return sectionProgress.find((item) => item.section === section) ?? { completed: 0, percent: 0 };
}

const badgeTracks = [
  {
    id: "protocol",
    levels: [
      {
        id: "protocol-lv1",
        label: "Protocol Lv1",
        description: "通訊協定完成 2 張以上，或該章節完成率達 25%。",
        predicate: ({ sectionProgress }) => {
          const protocols = sectionStat(sectionProgress, "protocols");
          return protocols.completed >= 2 || protocols.percent >= 25;
        },
      },
      {
        id: "protocol-lv2",
        label: "Protocol Lv2",
        description: "通訊協定完成 4 張以上，或該章節完成率達 50%。",
        predicate: ({ sectionProgress }) => {
          const protocols = sectionStat(sectionProgress, "protocols");
          return protocols.completed >= 4 || protocols.percent >= 50;
        },
      },
      {
        id: "protocol-expert",
        label: "Protocol Expert",
        description: "通訊協定完成 6 張以上，或該章節完成率達 80%。",
        predicate: ({ sectionProgress }) => {
          const protocols = sectionStat(sectionProgress, "protocols");
          return protocols.completed >= 6 || protocols.percent >= 80;
        },
      },
    ],
  },
  {
    id: "circuit",
    levels: [
      {
        id: "circuit-lv1",
        label: "Circuit Lv1",
        description: "電路基礎完成 3 張以上，或該章節完成率達 25%。",
        predicate: ({ sectionProgress }) => {
          const circuits = sectionStat(sectionProgress, "circuits");
          return circuits.completed >= 3 || circuits.percent >= 25;
        },
      },
      {
        id: "circuit-lv2",
        label: "Circuit Lv2",
        description: "電路基礎完成 6 張以上，或該章節完成率達 50%。",
        predicate: ({ sectionProgress }) => {
          const circuits = sectionStat(sectionProgress, "circuits");
          return circuits.completed >= 6 || circuits.percent >= 50;
        },
      },
      {
        id: "circuit-expert",
        label: "Circuit Expert",
        description: "電路基礎完成 8 張以上，或該章節完成率達 80%。",
        predicate: ({ sectionProgress }) => {
          const circuits = sectionStat(sectionProgress, "circuits");
          return circuits.completed >= 8 || circuits.percent >= 80;
        },
      },
    ],
  },
  {
    id: "fa-debug",
    levels: [
      {
        id: "fa-debug-lv1",
        label: "FA Debug Lv1",
        description: "FA Debug 完成 2 張以上，或該章節完成率達 25%。",
        predicate: ({ sectionProgress }) => {
          const debug = sectionStat(sectionProgress, "debug");
          return debug.completed >= 2 || debug.percent >= 25;
        },
      },
      {
        id: "fa-debug-lv2",
        label: "FA Debug Lv2",
        description: "FA Debug 完成 4 張以上，或該章節完成率達 50%。",
        predicate: ({ sectionProgress }) => {
          const debug = sectionStat(sectionProgress, "debug");
          return debug.completed >= 4 || debug.percent >= 50;
        },
      },
      {
        id: "fa-investigator-expert",
        label: "FA Investigator Expert",
        description: "FA Debug 完成 6 張以上，或該章節完成率達 80%。",
        predicate: ({ sectionProgress }) => {
          const debug = sectionStat(sectionProgress, "debug");
          return debug.completed >= 6 || debug.percent >= 80;
        },
      },
    ],
  },
  {
    id: "component",
    levels: [
      {
        id: "component-lv1",
        label: "Component Lv1",
        description: "元件基礎完成 5 張以上，或該章節完成率達 25%。",
        predicate: ({ sectionProgress }) => {
          const components = sectionStat(sectionProgress, "components");
          return components.completed >= 5 || components.percent >= 25;
        },
      },
      {
        id: "component-lv2",
        label: "Component Lv2",
        description: "元件基礎完成 10 張以上，或該章節完成率達 50%。",
        predicate: ({ sectionProgress }) => {
          const components = sectionStat(sectionProgress, "components");
          return components.completed >= 10 || components.percent >= 50;
        },
      },
      {
        id: "component-expert",
        label: "Component Expert",
        description: "元件基礎完成 15 張以上，或該章節完成率達 80%。",
        predicate: ({ sectionProgress }) => {
          const components = sectionStat(sectionProgress, "components");
          return components.completed >= 15 || components.percent >= 80;
        },
      },
    ],
  },
  {
    id: "ev-systems",
    levels: [
      {
        id: "ev-systems-lv1",
        label: "EV Systems Lv1",
        description: "車用系統完成 1 張以上。",
        predicate: ({ sectionProgress }) => sectionStat(sectionProgress, "automotive").completed >= 1,
      },
      {
        id: "ev-systems-lv2",
        label: "EV Systems Lv2",
        description: "車用系統完成 2 張以上。",
        predicate: ({ sectionProgress }) => sectionStat(sectionProgress, "automotive").completed >= 2,
      },
      {
        id: "ev-systems-expert",
        label: "EV Systems Expert",
        description: "車用系統完成 3 張以上，或該章節完成率達 50%。",
        predicate: ({ sectionProgress }) => {
          const automotive = sectionStat(sectionProgress, "automotive");
          return automotive.completed >= 3 || automotive.percent >= 50;
        },
      },
    ],
  },
  {
    id: "quiz",
    levels: [
      {
        id: "quiz-lv1",
        label: "Quiz Lv1",
        description: "Quiz 作答 10 題以上且正確率達 60% 以上。",
        predicate: ({ quizAnswered, quizAccuracy }) => quizAnswered >= 10 && quizAccuracy >= 60,
      },
      {
        id: "quiz-lv2",
        label: "Quiz Lv2",
        description: "Quiz 作答 25 題以上且正確率達 70% 以上。",
        predicate: ({ quizAnswered, quizAccuracy }) => quizAnswered >= 25 && quizAccuracy >= 70,
      },
      {
        id: "quiz-expert",
        label: "Quiz Expert",
        description: "Quiz 作答 40 題以上且正確率達 80% 以上。",
        predicate: ({ quizAnswered, quizAccuracy }) => quizAnswered >= 40 && quizAccuracy >= 80,
      },
    ],
  },
];

export function buildSkillBadges({ sectionProgress = [], quizAnswered = 0, quizAccuracy = 0 }) {
  const badgeContext = {
    sectionProgress,
    quizAnswered,
    quizAccuracy,
  };

  return badgeTracks.flatMap((track) => {
    const highestLevel = [...track.levels].reverse().find((badge) => badge.predicate(badgeContext));
    return highestLevel
      ? [{ id: highestLevel.id, label: highestLevel.label, description: highestLevel.description }]
      : [];
  });
}

function normalize(value) {
  return String(value ?? "").trim();
}

function normalizeKey(value) {
  return normalize(value).toLowerCase();
}

function parseBoolean(value) {
  const normalized = normalizeKey(value);
  if (["true", "1", "yes", "y", "完成", "答對"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "n", "取消完成", "答錯"].includes(normalized)) {
    return false;
  }
  return null;
}

function timestamp(value) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

export function parseCsv(text) {
  const source = String(text ?? "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const nextChar = source[index + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  row.push(field);
  rows.push(row);

  return rows.filter((csvRow) => csvRow.some((cell) => normalize(cell)));
}

export function csvRowsToObjects(rows) {
  if (!rows.length) {
    throw new Error("CSV 沒有資料。");
  }

  const headers = rows[0].map((header) => normalize(header));
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
  if (missingHeaders.length) {
    throw new Error(`CSV 欄位不符，缺少：${missingHeaders.join("、")}`);
  }

  return rows.slice(1).map((row) => {
    const object = {};
    headers.forEach((header, index) => {
      object[header] = row[index] ?? "";
    });
    return object;
  });
}

export function getRecordKey(record) {
  if (record.recordId) {
    return record.recordId;
  }

  return [
    normalizeKey(record.studentName) || normalizeKey(record.studentEmail) || "unknown-student",
    record.createdAt,
    record.type,
    record.itemId || record.questionId || record.itemName || record.question,
  ].join("|");
}

export function normalizeImportedRecord(row, fallbackProfile = {}) {
  const type = normalizeKey(row[csvHeaders.type]);
  const rowStudentName = normalize(row[csvHeaders.studentName]);
  const fallbackStudentName = normalize(fallbackProfile.studentName);

  return {
    recordId: normalize(row[csvHeaders.recordId]),
    createdAt: normalize(row[csvHeaders.createdAt]),
    studentName: fallbackProfile.preferStudentName
      ? fallbackStudentName || rowStudentName
      : rowStudentName || fallbackStudentName,
    studentEmail: normalize(row[csvHeaders.studentEmail]) || normalize(fallbackProfile.studentEmail),
    department: normalize(row[csvHeaders.department]) || normalize(fallbackProfile.department),
    type,
    action: normalize(row[csvHeaders.action]),
    section: normalize(row[csvHeaders.section]),
    sectionLabel: normalize(row[csvHeaders.sectionLabel]),
    category: normalize(row[csvHeaders.category]),
    itemId: normalize(row[csvHeaders.itemId]),
    itemName: normalize(row[csvHeaders.itemName]),
    completed: parseBoolean(row[csvHeaders.completed]),
    questionId: normalize(row[csvHeaders.questionId]),
    question: normalize(row[csvHeaders.question]),
    selectedOption: normalize(row[csvHeaders.selectedOption]),
    correctOption: normalize(row[csvHeaders.correctOption]),
    isCorrect: parseBoolean(row[csvHeaders.isCorrect]),
  };
}

export function parseImportedCsv(text, fallbackProfile = {}) {
  const rows = parseCsv(text);
  return csvRowsToObjects(rows)
    .map((row) => normalizeImportedRecord(row, fallbackProfile))
    .filter((record) => record.createdAt && record.type);
}

export function mergeRecords(existingRecords, nextRecords) {
  const merged = new Map();
  [...existingRecords, ...nextRecords].forEach((record) => {
    merged.set(getRecordKey(record), record);
  });

  return [...merged.values()].sort((left, right) => timestamp(right.createdAt) - timestamp(left.createdAt));
}

export function buildStudentSummaries(records, sectionCollections) {
  const sectionMeta = Object.entries(sectionCollections).map(([section, items]) => ({
    section,
    label: sectionLabels[section] || records.find((record) => record.section === section)?.sectionLabel || section,
    total: items.length,
  }));
  const sectionByItem = new Map();
  sectionMeta.forEach(({ section }) => {
    (sectionCollections[section] ?? []).forEach((item) => {
      sectionByItem.set(item.id, section);
    });
  });
  const totalItems = sectionMeta.reduce((sum, section) => sum + section.total, 0);
  const studentMap = new Map();

  records.forEach((record) => {
    const email = normalizeKey(record.studentEmail);
    const name = normalizeKey(record.studentName);
    const studentKey = name || email || "unknown-student";
    if (!studentMap.has(studentKey)) {
      studentMap.set(studentKey, {
        studentKey,
        studentName: record.studentName || "未命名學員",
        studentEmail: record.studentEmail,
        department: record.department,
        records: [],
      });
    }

    const student = studentMap.get(studentKey);
    if (record.studentName && student.studentName === "未命名學員") {
      student.studentName = record.studentName;
    }
    student.studentEmail = student.studentEmail || record.studentEmail;
    student.department = student.department || record.department;
    student.records.push(record);
  });

  const students = [...studentMap.values()].map((student) => {
    const sortedRecords = [...student.records].sort(
      (left, right) => timestamp(right.createdAt) - timestamp(left.createdAt),
    );
    const latestCompletionByItem = new Map();

    sortedRecords
      .filter((record) => record.type === "completion" && record.itemId)
      .forEach((record) => {
        if (!latestCompletionByItem.has(record.itemId)) {
          latestCompletionByItem.set(record.itemId, record);
        }
      });

    const completedRecords = [...latestCompletionByItem.values()].filter((record) => record.completed === true);
    const completedItemIds = new Set(completedRecords.map((record) => record.itemId));
    const sectionCompleted = new Map(sectionMeta.map(({ section }) => [section, 0]));

    completedRecords.forEach((record) => {
      const section = record.section || sectionByItem.get(record.itemId);
      if (sectionCompleted.has(section)) {
        sectionCompleted.set(section, sectionCompleted.get(section) + 1);
      }
    });

    const quizRecords = sortedRecords.filter((record) => record.type === "quiz");
    const quizCorrect = quizRecords.filter((record) => record.isCorrect === true).length;
    const completionRate = totalItems ? Math.round((completedItemIds.size / totalItems) * 100) : 0;
    const quizAccuracy = quizRecords.length ? Math.round((quizCorrect / quizRecords.length) * 100) : 0;
    const sectionProgress = sectionMeta.map(({ section, label, total }) => {
      const completed = sectionCompleted.get(section) ?? 0;
      return {
        section,
        label,
        total,
        completed,
        percent: total ? Math.round((completed / total) * 100) : 0,
      };
    });

    const badges = buildSkillBadges({
      sectionProgress,
      quizAnswered: quizRecords.length,
      quizAccuracy,
    });

    return {
      ...student,
      records: sortedRecords,
      recentRecords: sortedRecords.slice(0, 5),
      completedItems: completedItemIds.size,
      totalItems,
      completionRate,
      quizAnswered: quizRecords.length,
      quizCorrect,
      quizAccuracy,
      latestAt: sortedRecords[0]?.createdAt ?? "",
      sectionProgress,
      badges,
    };
  });

  const sortedStudents = students.sort((left, right) => timestamp(right.latestAt) - timestamp(left.latestAt));
  const quizTakers = sortedStudents.filter((student) => student.quizAnswered > 0);
  const totalBadges = sortedStudents.reduce((sum, student) => sum + student.badges.length, 0);
  const averageCompletionRate = sortedStudents.length
    ? Math.round(sortedStudents.reduce((sum, student) => sum + student.completionRate, 0) / sortedStudents.length)
    : 0;
  const averageQuizAccuracy = quizTakers.length
    ? Math.round(quizTakers.reduce((sum, student) => sum + student.quizAccuracy, 0) / quizTakers.length)
    : 0;

  return {
    students: sortedStudents,
    summary: {
      studentCount: sortedStudents.length,
      recordCount: records.length,
      averageCompletionRate,
      averageQuizAccuracy,
      averageBadgeCount: sortedStudents.length ? Math.round((totalBadges / sortedStudents.length) * 10) / 10 : 0,
      totalBadges,
      latestAt: sortedStudents[0]?.latestAt ?? "",
    },
  };
}
