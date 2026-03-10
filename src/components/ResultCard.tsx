import { useEffect, useState } from "react";
import type { TrendItem } from "../types";

interface ResultCardProps {
  trend: TrendItem;
  onClose: () => void;
}

const badgeColorMap: Record<string, string> = {
  MEGA: "bg-mega/20 text-mega border-mega/40",
  MIDDLE: "bg-middle/20 text-middle border-middle/40",
  MICRO: "bg-micro/20 text-micro border-micro/40",
};

export default function ResultCard({ trend, onClose }: ResultCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`overlay${visible ? " overlay--visible" : ""}`}
      onClick={handleClose}
    >
      <div
        className="result-card"
        data-category={trend.category}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-1 text-xs font-medium rounded border ${
                badgeColorMap[trend.category] ?? ""
              }`}
            >
              {trend.category} TREND
            </span>
            <span className="text-xs text-text-muted">{trend.timeframe}</span>
          </div>
          <button
            onClick={handleClose}
            className="text-text-muted hover:text-text-primary text-xl leading-none cursor-pointer"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <div className="text-center">
          <span className="text-5xl block mb-4">{trend.icon}</span>
          <h2 className="text-2xl font-medium text-text-primary mb-1">
            {trend.titleJa}
          </h2>
          <p className="text-sm text-text-muted mb-4">{trend.titleEn}</p>
          <hr className="border-text-muted/20 mb-4" />
          <p className="text-sm text-text-primary/80 leading-relaxed">
            {trend.descriptionJa}
          </p>
        </div>
      </div>
    </div>
  );
}
