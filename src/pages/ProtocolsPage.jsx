import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ContentCard from "../components/ContentCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SearchSummary from "../components/SearchSummary.jsx";
import { protocolCategories, protocols } from "../data/trainingData.js";
import { filterByCategory, itemMatchesQuery } from "../utils/search.js";

export default function ProtocolsPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const { searchQuery, progress } = useOutletContext();

  const filteredItems = useMemo(() => {
    return filterByCategory(protocols, activeCategory).filter((item) => itemMatchesQuery(item, searchQuery));
  }, [activeCategory, searchQuery]);

  return (
    <div>
      <PageHeader
        eyebrow="Communication Protocols"
        title="通訊協定"
        description="聚焦應用場景、訊號線、電氣特性、常見波形異常與 debug 量測重點。"
      />
      <CategoryFilter categories={protocolCategories} activeCategory={activeCategory} onChange={setActiveCategory} />
      <SearchSummary query={searchQuery} count={filteredItems.length} />

      {filteredItems.length ? (
        <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ContentCard
              key={item.id}
              itemId={item.id}
              title={item.name}
              category={item.category}
              description={item.signalLines}
              isCompleted={progress.isCompleted(item.id)}
              onToggleComplete={progress.toggleCompletion}
              details={[
                { title: "應用場景", items: item.useCases },
                { title: "主要電氣特性", items: [item.electrical] },
                { title: "常見波形異常", items: item.waveIssues },
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
