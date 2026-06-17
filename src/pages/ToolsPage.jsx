import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ContentCard from "../components/ContentCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SearchSummary from "../components/SearchSummary.jsx";
import { measurementTools, toolCategories } from "../data/trainingData.js";
import { filterByCategory, itemMatchesQuery } from "../utils/search.js";

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const { searchQuery, progress } = useOutletContext();

  const filteredItems = useMemo(() => {
    return filterByCategory(measurementTools, activeCategory).filter((item) =>
      itemMatchesQuery(item, searchQuery),
    );
  }, [activeCategory, searchQuery]);

  return (
    <div>
      <PageHeader
        eyebrow="Measurement Tools"
        title="量測儀器與工具"
        description="整理 EE debug 常用儀器的用途、設定、量測陷阱與安全注意事項，建立可重複的量測方法。"
      />
      <CategoryFilter categories={toolCategories} activeCategory={activeCategory} onChange={setActiveCategory} />
      <SearchSummary query={searchQuery} count={filteredItems.length} />

      {filteredItems.length ? (
        <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ContentCard
              key={item.id}
              itemId={item.id}
              section="tools"
              sectionLabel="量測工具"
              title={item.name}
              subtitle={item.english}
              category={item.category}
              description={item.purpose}
              isCompleted={progress.isCompleted(item.id)}
              onToggleComplete={progress.toggleCompletion}
              details={[
                { title: "常見應用", items: item.applications },
                { title: "關鍵設定", items: item.keySettings },
                { title: "常見量測錯誤", items: item.mistakes },
                { title: "Debug 檢查重點", items: item.debugFocus },
                { title: "安全注意事項", items: item.safety },
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
