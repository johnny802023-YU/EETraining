import { useEffect, useMemo, useState } from "react";
import { sectionCollections } from "../data/trainingData.js";

const STORAGE_KEY = "ee-training-progress-v1";

function loadProgress() {
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

export function useLearningProgress() {
  const [completedIds, setCompletedIds] = useState(loadProgress);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
  }, [completedIds]);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const allIds = useMemo(
    () => Object.values(sectionCollections).flatMap((collection) => collection.map((item) => item.id)),
    [],
  );

  const total = allIds.length;
  const completed = allIds.filter((id) => completedSet.has(id)).length;

  function toggleCompletion(id) {
    setCompletedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    );
  }

  function isCompleted(id) {
    return completedSet.has(id);
  }

  function getSectionProgress(section) {
    const collection = sectionCollections[section] ?? [];
    const sectionTotal = collection.length;
    const sectionCompleted = collection.filter((item) => completedSet.has(item.id)).length;
    return {
      completed: sectionCompleted,
      total: sectionTotal,
      percent: sectionTotal ? Math.round((sectionCompleted / sectionTotal) * 100) : 0,
    };
  }

  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    completedIds,
    toggleCompletion,
    isCompleted,
    getSectionProgress,
  };
}
