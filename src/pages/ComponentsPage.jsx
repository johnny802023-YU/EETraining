import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ContentCard from "../components/ContentCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SearchSummary from "../components/SearchSummary.jsx";
import { componentCategories, components } from "../data/trainingData.js";
import { filterByCategory, itemMatchesQuery } from "../utils/search.js";

export default function ComponentsPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const { searchQuery, progress } = useOutletContext();

  const filteredItems = useMemo(() => {
    return filterByCategory(components, activeCategory).filter((item) => itemMatchesQuery(item, searchQuery));
  }, [activeCategory, searchQuery]);

  return (
    <div>
      <PageHeader
        eyebrow="Component Database"
        title="元件資料庫"
        description="以功能、關鍵規格、常見失效模式與 debug 檢查重點建立元件判讀基礎。"
      />
      <CategoryFilter categories={componentCategories} activeCategory={activeCategory} onChange={setActiveCategory} />
      <SearchSummary query={searchQuery} count={filteredItems.length} />

      {filteredItems.length ? (
        <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ContentCard
              key={item.id}
              itemId={item.id}
              title={item.name}
              subtitle={item.english}
              category={item.category}
              description={item.summary}
              isCompleted={progress.isCompleted(item.id)}
              onToggleComplete={progress.toggleCompletion}
              details={[
                { title: "重要規格", items: item.specs },
                { title: "常見失效模式", items: item.failures },
                { title: "Debug 檢查重點", items: item.debugFocus },
              ]}
            />
          ))}
        </section>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
