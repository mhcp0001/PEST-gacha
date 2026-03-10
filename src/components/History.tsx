import type { HistoryItem } from "../types";

interface HistoryProps {
  items: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}

const categoryColor: Record<string, string> = {
  MEGA: "text-mega",
  MIDDLE: "text-middle",
  MICRO: "text-micro",
};

export default function History({ items, onClear, onSelect }: HistoryProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs tracking-[0.15em] uppercase text-text-muted font-medium">
          History
        </h2>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            CLEAR
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">
          まだ履歴がありません
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={`${item.trend.id}-${index}`}>
              <button
                onClick={() => onSelect(item)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm cursor-pointer flex items-center gap-2"
              >
                <span className="text-text-muted">•</span>
                <span>{item.trend.icon}</span>
                <span className="text-text-primary truncate flex-1">
                  {item.trend.titleJa}
                </span>
                <span
                  className={`text-xs ${
                    categoryColor[item.trend.category] ?? "text-text-muted"
                  }`}
                >
                  {item.trend.category}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
