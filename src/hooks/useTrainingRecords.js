import { useEffect, useMemo, useState } from "react";

const PROFILE_KEY = "ee-training-student-profile-v1";
const RECORDS_KEY = "ee-training-records-v1";

const emptyProfile = {
  name: "",
  email: "",
  department: "",
};

function loadJson(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "null");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function createRecord(type, profile, payload) {
  return {
    recordId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    createdAt: new Date().toISOString(),
    studentName: profile.name,
    studentEmail: profile.email,
    department: profile.department,
    ...payload,
  };
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function useTrainingRecords() {
  const [profile, setProfile] = useState(() => ({
    ...emptyProfile,
    ...loadJson(PROFILE_KEY, emptyProfile),
  }));
  const [records, setRecords] = useState(() => {
    const loaded = loadJson(RECORDS_KEY, []);
    return Array.isArray(loaded) ? loaded : [];
  });

  useEffect(() => {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  }, [records]);

  const profileComplete = Boolean(profile.name && profile.email && profile.department);

  const summary = useMemo(() => {
    const completionRecords = records.filter((record) => record.type === "completion");
    const quizRecords = records.filter((record) => record.type === "quiz");
    const completedItems = new Set(
      completionRecords
        .filter((record) => record.completed)
        .map((record) => record.itemId),
    );

    return {
      totalRecords: records.length,
      completionEvents: completionRecords.length,
      quizEvents: quizRecords.length,
      completedItems: completedItems.size,
      latestAt: records[0]?.createdAt ?? "",
    };
  }, [records]);

  function updateProfile(nextProfile) {
    setProfile({
      name: nextProfile.name.trim(),
      email: nextProfile.email.trim(),
      department: nextProfile.department.trim(),
    });
  }

  function addRecord(record) {
    setRecords((current) => [record, ...current]);
  }

  function recordCompletion({ completed, itemId, itemName, section, sectionLabel, category }) {
    addRecord(
      createRecord("completion", profile, {
        action: completed ? "completed" : "uncompleted",
        completed,
        itemId,
        itemName,
        section,
        sectionLabel,
        category,
      }),
    );
  }

  function recordQuizAnswer({ questionId, category, question, selectedOption, correctOption, isCorrect }) {
    addRecord(
      createRecord("quiz", profile, {
        action: "quiz_answered",
        questionId,
        category,
        question,
        selectedOption,
        correctOption,
        isCorrect,
      }),
    );
  }

  function exportCsv() {
    const header = [
      "Record ID",
      "Created At",
      "Student Name",
      "Student Email",
      "Department",
      "Type",
      "Action",
      "Section",
      "Section Label",
      "Category",
      "Item ID",
      "Item Name",
      "Completed",
      "Question ID",
      "Question",
      "Selected Option",
      "Correct Option",
      "Is Correct",
    ];

    const rows = records.map((record) => [
      record.recordId,
      record.createdAt,
      profile.name || record.studentName,
      profile.email || record.studentEmail,
      profile.department || record.department,
      record.type,
      record.action,
      record.section,
      record.sectionLabel,
      record.category,
      record.itemId,
      record.itemName,
      record.completed,
      record.questionId,
      record.question,
      record.selectedOption,
      record.correctOption,
      record.isCorrect,
    ]);

    const safeName = profile.name || "student";
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`EETraining-${safeName}-${date}.csv`, [header, ...rows]);
  }

  function clearRecords() {
    setRecords([]);
  }

  return {
    profile,
    profileComplete,
    records,
    summary,
    updateProfile,
    recordCompletion,
    recordQuizAnswer,
    exportCsv,
    clearRecords,
  };
}
