import { useState, useEffect, useCallback, useRef } from "react";
import type { TrendItem, HistoryItem, FilterCategory } from "../types";

export function useGacha(trends: TrendItem[]) {
  const [filter, setFilter] = useState<FilterCategory>("ALL");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<TrendItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const currentResultRef = useRef(currentResult);

  currentResultRef.current = currentResult;

  const closeCard = useCallback(() => {
    setShowCard(false);
  }, []);

  const draw = useCallback(() => {
    if (isSpinning) return;

    let candidates =
      filter === "ALL"
        ? [...trends]
        : trends.filter((t) => t.category === filter);

    if (candidates.length === 0) return;

    if (candidates.length >= 2 && currentResultRef.current) {
      candidates = candidates.filter(
        (t) => t.id !== currentResultRef.current!.id
      );
    }

    const result = candidates[Math.floor(Math.random() * candidates.length)];

    setIsSpinning(true);

    setTimeout(() => {
      setCurrentResult(result);
      setHistory((prev) => [
        { trend: result, drawnAt: new Date().toISOString() },
        ...prev,
      ]);
      setIsSpinning(false);
      setShowCard(true);
    }, 2000);
  }, [isSpinning, filter, trends]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const selectHistory = useCallback((item: HistoryItem) => {
    setCurrentResult(item.trend);
    setShowCard(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCard();
        return;
      }

      if (
        (e.key === " " || e.key === "Enter") &&
        e.target === document.body
      ) {
        e.preventDefault();
        draw();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [draw, closeCard]);

  return {
    filter,
    setFilter,
    history,
    currentResult,
    isSpinning,
    showCard,
    draw,
    closeCard,
    clearHistory,
    selectHistory,
  };
}
