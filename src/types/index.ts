export interface TrendItem {
  id: string;
  category: "MEGA" | "MIDDLE" | "MICRO";
  timeframe: string;
  icon: string;
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
}

export interface TrendsData {
  version: string;
  updatedAt: string;
  trends: TrendItem[];
}

export interface HistoryItem {
  trend: TrendItem;
  drawnAt: string;
}

export type FilterCategory = "ALL" | "MEGA" | "MIDDLE" | "MICRO";
