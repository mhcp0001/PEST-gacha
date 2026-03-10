import "./App.css";
import { useTrends } from "./hooks/useTrends";
import { useGacha } from "./hooks/useGacha";

export default function App() {
  const { trends, isLoading } = useTrends();
  const gacha = useGacha(trends);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0e17] text-[#f1f5f9] p-4">
      <h1 className="text-4xl font-light mb-4">Hello Trend Gacha</h1>
      <p className="text-lg mb-4">
        {isLoading ? "Loading..." : `Trends loaded: ${trends.length}`}
      </p>
      <pre className="text-xs text-left max-w-md overflow-auto bg-[#141824] p-4 rounded">
        {JSON.stringify(
          {
            filter: gacha.filter,
            isSpinning: gacha.isSpinning,
            showCard: gacha.showCard,
            currentResult: gacha.currentResult?.titleJa ?? null,
            historyCount: gacha.history.length,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
