import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ContentCard from "../components/ContentCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SearchSummary from "../components/SearchSummary.jsx";
import { circuitCategories, circuits } from "../data/trainingData.js";
import { filterByCategory, itemMatchesQuery } from "../utils/search.js";

export default function CircuitsPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const { searchQuery, progress } = useOutletContext();

  const filteredItems = useMemo(() => {
    return filterByCategory(circuits, activeCategory).filter((item) => itemMatchesQuery(item, searchQuery));
  }, [activeCategory, searchQuery]);

  return (
    <div>
      <PageHeader
        eyebrow="Circuit Fundamentals"
        title="電路基礎"
        description="用目的、原理、應用、設計錯誤與量測提示快速掌握常見基礎電路。"
      />
      <CategoryFilter categories={circuitCategories} activeCategory={activeCategory} onChange={setActiveCategory} />
      <SearchSummary query={searchQuery} count={filteredItems.length} />

      {filteredItems.length ? (
        <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ContentCard
              key={item.id}
              itemId={item.id}
              section="circuits"
              sectionLabel="電路基礎"
              title={item.name}
              category={item.category}
              description={item.purpose}
              isCompleted={progress.isCompleted(item.id)}
              onToggleComplete={progress.toggleCompletion}
              details={[
                { title: "基本原理", items: [item.principle] },
                { title: "常見應用", items: item.applications },
                { title: "常見設計錯誤", items: item.mistakes },
                { title: "Debug 提示", items: item.debugTips },
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
