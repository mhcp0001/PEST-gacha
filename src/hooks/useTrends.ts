import { useState, useEffect } from "react";
import type { TrendItem, TrendsData } from "../types";
import { fallbackTrends } from "../data/fallback";

export function useTrends(): { trends: TrendItem[]; isLoading: boolean } {
  const [trends, setTrends] = useState<TrendItem[]>(fallbackTrends);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/trends.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<TrendsData>;
      })
      .then((data) => {
        setTrends(data.trends);
      })
      .catch((err) => {
        console.warn("Failed to fetch trends.json, using fallback:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { trends, isLoading };
}
