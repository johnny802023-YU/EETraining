export function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function flattenSearchText(item) {
  return Object.values(item)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value) => typeof value === "string" || typeof value === "number")
    .join(" ");
}

export function itemMatchesQuery(item, query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return true;
  }

  return normalizeText(flattenSearchText(item)).includes(normalizedQuery);
}

export function filterByCategory(items, category) {
  if (!category || category === "全部") {
    return items;
  }

  return items.filter((item) => item.category === category);
}
