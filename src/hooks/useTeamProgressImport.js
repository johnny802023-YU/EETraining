import { useEffect, useMemo, useState } from "react";
import { sectionCollections } from "../data/trainingData.js";
import { buildStudentSummaries, mergeRecords, parseImportedCsv } from "../utils/teamProgress.js";

const STORAGE_KEY = "ee-training-team-records-v1";

function loadTeamRecords() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error(`${file.name} 讀取失敗。`));
    reader.readAsText(file);
  });
}

export function useTeamProgressImport() {
  const [records, setRecords] = useState(loadTeamRecords);
  const [importStatus, setImportStatus] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const report = useMemo(() => buildStudentSummaries(records, sectionCollections), [records]);

  async function importCsvFiles(fileList) {
    const files = [...(fileList ?? [])];
    if (!files.length) {
      return;
    }

    try {
      const importedRecords = [];
      for (const file of files) {
        const text = await readFileAsText(file);
        importedRecords.push(...parseImportedCsv(text));
      }

      const merged = mergeRecords(records, importedRecords);
      const added = merged.length - records.length;
      setRecords(merged);
      setImportStatus({
        type: "success",
        message: `已匯入 ${files.length} 個檔案，新增 ${Math.max(added, 0)} 筆紀錄，總計 ${merged.length} 筆。`,
      });
    } catch (error) {
      setImportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "CSV 匯入失敗。",
      });
    }
  }

  function clearImportedRecords() {
    setRecords([]);
    setImportStatus(null);
  }

  return {
    records,
    importStatus,
    report,
    importCsvFiles,
    clearImportedRecords,
  };
}
