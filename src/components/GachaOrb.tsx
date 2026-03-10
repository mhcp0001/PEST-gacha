import type { FilterCategory } from "../types";

interface GachaOrbProps {
  isSpinning: boolean;
  currentIcon: string | null;
  activeCategory: FilterCategory;
}

export default function GachaOrb({
  isSpinning,
  currentIcon,
  activeCategory,
}: GachaOrbProps) {
  const spinClass = isSpinning ? " orb-ring--spinning" : "";

  return (
    <div
      className="orb-container"
      data-category={activeCategory}
      style={{ width: "clamp(220px, 60vw, 320px)", height: "clamp(220px, 60vw, 320px)" }}
    >
      <div className={`orb-ring orb-ring--outer${spinClass}`} />
      <div className={`orb-ring orb-ring--middle${spinClass}`} />
      <div className={`orb-ring orb-ring--inner${spinClass}`} />
      <div className="orb-core">
        <span className="orb-icon">{currentIcon ?? "🎯"}</span>
      </div>
    </div>
  );
}
