import "./App.css";
import { useTrends } from "./hooks/useTrends";
import { useGacha } from "./hooks/useGacha";
import Header from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import GachaOrb from "./components/GachaOrb";
import DrawButton from "./components/DrawButton";
import ResultCard from "./components/ResultCard";
import History from "./components/History";

export default function App() {
  const { trends, isLoading } = useTrends();
  const gacha = useGacha(trends);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="max-w-[600px] w-full mx-auto px-4 flex flex-col items-center">
        <Header />

        <div className="mb-8">
          <CategoryFilter
            filter={gacha.filter}
            onFilterChange={gacha.setFilter}
          />
        </div>

        <div className="mb-8">
          <GachaOrb
            isSpinning={gacha.isSpinning}
            currentIcon={gacha.currentResult?.icon ?? null}
            activeCategory={gacha.filter}
          />
        </div>

        <div className="mb-10">
          <DrawButton
            onDraw={gacha.draw}
            disabled={gacha.isSpinning || isLoading}
          />
        </div>

        <div className="w-full pb-12">
          <History
            items={gacha.history}
            onClear={gacha.clearHistory}
            onSelect={gacha.selectHistory}
          />
        </div>
      </div>

      {gacha.showCard && gacha.currentResult && (
        <ResultCard trend={gacha.currentResult} onClose={gacha.closeCard} />
      )}
    </div>
  );
}
