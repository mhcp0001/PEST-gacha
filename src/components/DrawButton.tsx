interface DrawButtonProps {
  onDraw: () => void;
  disabled: boolean;
}

export default function DrawButton({ onDraw, disabled }: DrawButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onDraw}
        disabled={disabled}
        aria-label="トレンドを引く"
        aria-disabled={disabled}
        className="px-8 py-3 rounded-lg border border-text-muted/40 text-text-primary text-sm tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer hover:border-text-primary/60 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-text-muted/40 disabled:hover:bg-transparent"
      >
        DRAW TREND
      </button>
      <p className="text-xs text-text-muted">
        Space / Enter でも引けます
      </p>
    </div>
  );
}
