import { useTrends } from "./hooks/useTrends";

export default function App() {
  const { trends, isLoading } = useTrends();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0e17] text-[#f1f5f9]">
      <h1 className="text-4xl font-light mb-4">Hello Trend Gacha</h1>
      <p className="text-lg">
        {isLoading ? "Loading..." : `Trends loaded: ${trends.length}`}
      </p>
    </div>
  );
}
