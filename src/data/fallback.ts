import type { TrendItem } from "../types";

export const fallbackTrends: TrendItem[] = [
  {
    id: "mega-001",
    category: "MEGA",
    timeframe: "10—20 YEARS",
    icon: "🧬",
    titleJa: "ポストヒューマン労働市場",
    titleEn: "Post-Human Labor Market",
    descriptionJa: "AI・ロボットが労働の大半を担い、人間は創造性と意味付けに特化する経済。",
  },
  {
    id: "middle-001",
    category: "MIDDLE",
    timeframe: "5—10 YEARS",
    icon: "🏙️",
    titleJa: "15分シティ",
    titleEn: "15-Minute City",
    descriptionJa: "徒歩・自転車15分圏内で生活が完結する都市設計コンセプトの世界的普及。",
  },
  {
    id: "micro-001",
    category: "MICRO",
    timeframe: "1—5 YEARS",
    icon: "🤖",
    titleJa: "AIエージェント普及",
    titleEn: "AI Agent Adoption",
    descriptionJa: "自律的にタスクを実行するAIエージェントがビジネスツールとして一般化。",
  },
];
