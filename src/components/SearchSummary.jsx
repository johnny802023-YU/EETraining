export default function SearchSummary({ query, count }) {
  if (!query) {
    return null;
  }

  return (
    <div className="mb-5 rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm text-navy-800">
      搜尋「<span className="font-semibold">{query}</span>」找到 {count} 筆內容
    </div>
  );
}
