import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ContentCard from "../components/ContentCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SearchSummary from "../components/SearchSummary.jsx";
import { automotiveCategories, automotiveSystems } from "../data/trainingData.js";
import { filterByCategory, itemMatchesQuery } from "../utils/search.js";

export default function AutomotivePage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const { searchQuery, progress } = useOutletContext();

  const filteredItems = useMemo(() => {
    return filterByCategory(automotiveSystems, activeCategory).filter((item) =>
      itemMatchesQuery(item, searchQuery),
    );
  }, [activeCategory, searchQuery]);

  return (
    <div>
      <PageHeader
        eyebrow="Automotive Systems"
        title="車用系統"
        description="以 EV 整車系統角度整理 LV/HV、電池、充電、驅動、熱管理與 ADAS 的功能、關鍵元件、通訊與 debug 重點。"
      />
      <CategoryFilter categories={automotiveCategories} activeCategory={activeCategory} onChange={setActiveCategory} />
      <SearchSummary query={searchQuery} count={filteredItems.length} />

      {filteredItems.length ? (
        <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ContentCard
              key={item.id}
              itemId={item.id}
              section="automotive"
              sectionLabel="車用系統"
              title={item.name}
              subtitle={item.english}
              category={item.category}
              description={item.systemFunction}
              isCompleted={progress.isCompleted(item.id)}
              onToggleComplete={progress.toggleCompletion}
              details={[
                { title: "LV/HV 分類", items: [item.voltageClass] },
                { title: "關鍵元件", items: item.keyComponents },
                { title: "相關電路", items: item.relatedCircuits },
                { title: "相關通訊", items: item.relatedProtocols },
                { title: "常見失效模式", items: item.failures },
                { title: "Debug 檢查重點", items: item.debugFocus },
                { title: "Tesla Model Y 實車案例", items: [item.modelYCase] },
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
