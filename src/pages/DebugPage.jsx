import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ContentCard from "../components/ContentCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SearchSummary from "../components/SearchSummary.jsx";
import { debugCases, debugCategories } from "../data/trainingData.js";
import { filterByCategory, itemMatchesQuery } from "../utils/search.js";

export default function DebugPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const { searchQuery, progress } = useOutletContext();

  const filteredItems = useMemo(() => {
    return filterByCategory(debugCases, activeCategory).filter((item) => itemMatchesQuery(item, searchQuery));
  }, [activeCategory, searchQuery]);

  return (
    <div>
      <PageHeader
        eyebrow="Failure Analysis"
        title="FA Debug 訓練"
        description="用案例卡片整理現象、可能原因、量測點、流程與工具，建立可追蹤的 debug 方法。"
      />
      <CategoryFilter categories={debugCategories} activeCategory={activeCategory} onChange={setActiveCategory} />
      <SearchSummary query={searchQuery} count={filteredItems.length} />

      {filteredItems.length ? (
        <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ContentCard
              key={item.id}
              itemId={item.id}
              section="debug"
              sectionLabel="FA Debug"
              title={item.name}
              category={item.category}
              description={item.symptom}
              isCompleted={progress.isCompleted(item.id)}
              onToggleComplete={progress.toggleCompletion}
              details={[
                { title: "可能原因", items: item.causes },
                { title: "量測點", items: item.measurementPoints },
                { title: "Debug 流程", items: item.flow },
                { title: "建議工具", items: item.tools },
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
