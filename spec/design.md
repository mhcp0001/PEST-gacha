# Design Document — Trend Gacha

> SDD Phase: **Design**  
> Status: **Approved**  
> Depends on: `specs/requirements.md` (= trend-gacha-spec.md v2)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  index.html                                         │
│  └─ main.tsx                                        │
│     └─ App.tsx                                      │
│        ├─ useTrends() ← fetch /data/trends.json     │
│        ├─ useGacha(trends)                           │
│        │   state: filter, history, currentResult,    │
│        │          isSpinning, showCard               │
│        │                                             │
│        ├─ <Header />                                 │
│        ├─ <CategoryFilter                            │
│        │     filter, onFilterChange />               │
│        ├─ <GachaOrb                                  │
│        │     isSpinning, currentIcon, categoryColor />│
│        ├─ <DrawButton                                │
│        │     onDraw, isSpinning />                   │
│        ├─ <ResultCard                                │
│        │     trend, showCard, onClose />             │
│        └─ <History                                   │
│              history, onClear, onSelect />           │
└─────────────────────────────────────────────────────┘
```

**データフロー**: 一方向。`useGacha` がすべての状態を保持し、各コンポーネントに props として渡す。コンポーネント間の直接通信はない。

---

## 2. Component Interfaces

### 2.1 App.tsx

ルートコンポーネント。フックを呼び出し、子コンポーネントを合成する。

```typescript
export default function App() {
  const { trends, isLoading } = useTrends();
  const gacha = useGacha(trends);
  // gacha: { filter, setFilter, history, currentResult,
  //          isSpinning, showCard, draw, closeCard, clearHistory, selectHistory }

  return (
    <div className="app">
      <Header />
      <CategoryFilter filter={gacha.filter} onFilterChange={gacha.setFilter} />
      <GachaOrb
        isSpinning={gacha.isSpinning}
        currentIcon={gacha.currentResult?.icon ?? null}
        activeCategory={gacha.filter}
      />
      <DrawButton onDraw={gacha.draw} disabled={gacha.isSpinning || isLoading} />
      {gacha.showCard && gacha.currentResult && (
        <ResultCard trend={gacha.currentResult} onClose={gacha.closeCard} />
      )}
      <History
        items={gacha.history}
        onClear={gacha.clearHistory}
        onSelect={gacha.selectHistory}
      />
    </div>
  );
}
```

### 2.2 Header

純粋な表示コンポーネント。Props なし。

```typescript
interface HeaderProps {}
// Renders: FUTURE SIGNALS subtitle, "Trend Gacha" title, description line
```

### 2.3 CategoryFilter

```typescript
interface CategoryFilterProps {
  filter: FilterCategory;
  onFilterChange: (category: FilterCategory) => void;
}
```

- 4つのボタン: ALL / MEGA / MIDDLE / MICRO
- 選択中のボタンに `.active` クラスを付与 → 背景色がカテゴリカラーに変化
- 選択ピルは `transition: all 200ms ease-in-out`

### 2.4 GachaOrb

```typescript
interface GachaOrbProps {
  isSpinning: boolean;
  currentIcon: string | null;
  activeCategory: FilterCategory;
}
```

**DOM構造**:
```html
<div class="orb-container">
  <div class="orb-ring orb-ring--outer {spinning?}"></div>
  <div class="orb-ring orb-ring--middle {spinning?}"></div>
  <div class="orb-ring orb-ring--inner {spinning?}"></div>
  <div class="orb-core">
    <span class="orb-icon">{icon or default}</span>
  </div>
</div>
```

**アニメーション（CSS）**:
```css
/* 待機状態: 低速回転 */
.orb-ring { animation: spin 12s linear infinite; }
.orb-ring--middle { animation-duration: 18s; animation-direction: reverse; }
.orb-ring--inner { animation-duration: 25s; }

/* ドロー中: 加速 */
.orb-ring.orb-ring--spinning { animation-duration: 0.8s; }
.orb-ring--middle.orb-ring--spinning { animation-duration: 0.6s; }
.orb-ring--inner.orb-ring--spinning { animation-duration: 0.4s; }

/* カテゴリによるグロー色切替 */
.orb-container[data-category="MEGA"]   { --ring-color: var(--color-mega); }
.orb-container[data-category="MIDDLE"] { --ring-color: var(--color-middle); }
.orb-container[data-category="MICRO"]  { --ring-color: var(--color-micro); }
.orb-container[data-category="ALL"]    { --ring-color: var(--color-all); }
```

**リングの描画**: CSS `border` + `border-radius: 50%` + `box-shadow` でグロー表現。SVGは使わない（シンプルさ優先）。

### 2.5 DrawButton

```typescript
interface DrawButtonProps {
  onDraw: () => void;
  disabled: boolean;
}
```

- `disabled` 中はopacity下げ + `cursor: not-allowed`
- ヒントテキスト `Space / Enter でも引けます` は常時表示

### 2.6 ResultCard

```typescript
interface ResultCardProps {
  trend: TrendItem;
  onClose: () => void;
}
```

**DOM構造**:
```html
<!-- Overlay (backdrop) -->
<div class="overlay" onClick={onClose}>
  <!-- Card (stop propagation) -->
  <div class="result-card" data-category={trend.category} onClick={e => e.stopPropagation()}>
    <div class="result-card__header">
      <span class="badge">{CATEGORY} TREND</span>
      <span class="timeframe">{timeframe}</span>
      <span class="close-btn" onClick={onClose}>×</span>
    </div>
    <span class="result-card__icon">{icon}</span>
    <h2 class="result-card__title">{titleJa}</h2>
    <p class="result-card__subtitle">{titleEn}</p>
    <hr />
    <p class="result-card__description">{descriptionJa}</p>
  </div>
</div>
```

**アニメーション**:
- Overlay: `opacity 0→1`, `300ms ease-out`
- Card: `translateY(100%) → translateY(0)`, `400ms ease-out`
- 閉じる: 逆再生 `300ms ease-in`
- 実装: CSS transition on mount/unmount。mount 時は即座にクラス付与、unmount 時は `onTransitionEnd` でDOMから除去。
  - 簡易実装: `showCard` state + `setTimeout` で閉じアニメーション完了後に state を false にする。

### 2.7 History

```typescript
interface HistoryProps {
  items: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}
```

- `items` が空の場合は「履歴はまだありません」のプレースホルダー表示
- 各アイテムはクリック可能（`onSelect` でカードを再表示）

---

## 3. Hook Design

### 3.1 useTrends

```typescript
function useTrends(): {
  trends: TrendItem[];
  isLoading: boolean;
}
```

**動作**:
1. 初期値: `fallbackTrends`（`src/data/fallback.ts` からimport）
2. `useEffect` で `fetch(${import.meta.env.BASE_URL}data/trends.json)` を実行
3. 成功: `setTrends(data.trends)`
4. 失敗: `console.warn` → フォールバックデータのまま
5. いずれの場合も `setIsLoading(false)`

### 3.2 useGacha

```typescript
function useGacha(trends: TrendItem[]): {
  filter: FilterCategory;
  setFilter: (f: FilterCategory) => void;
  history: HistoryItem[];
  currentResult: TrendItem | null;
  isSpinning: boolean;
  showCard: boolean;
  draw: () => void;
  closeCard: () => void;
  clearHistory: () => void;
  selectHistory: (item: HistoryItem) => void;
}
```

**`draw()` ロジック**:
```
1. if isSpinning → return (二重実行防止)
2. setIsSpinning(true)
3. candidates = filter === "ALL" ? trends : trends.filter(t => t.category === filter)
4. if candidates.length === 0 → setIsSpinning(false), return
5. if candidates.length >= 2 && currentResult
     → candidates = candidates.filter(t => t.id !== currentResult.id)  // 直前回避
6. result = candidates[Math.floor(Math.random() * candidates.length)]
7. setTimeout(() => {
     setCurrentResult(result)
     setHistory(prev => [{ trend: result, drawnAt: new Date().toISOString() }, ...prev])
     setIsSpinning(false)
     setShowCard(true)
   }, 2000)  // スピン演出の待ち時間
```

**`closeCard()` ロジック**:
```
1. setShowCard(false)
   // currentResult は保持（オーブにアイコンを残すため）
```

**`selectHistory(item)` ロジック**:
```
1. setCurrentResult(item.trend)
2. setShowCard(true)
```

**キーボードショートカット**（`useEffect` 内）:
```
window.addEventListener("keydown", handler)
- Space / Enter → draw() （ただし入力フォーカス時は除外: e.target === document.body）
- Escape → closeCard()
```

---

## 4. Data Schema

### 4.1 trends.json

```json
{
  "version": "1.0.0",
  "updatedAt": "2026-03-10",
  "trends": [
    {
      "id": "mega-001",
      "category": "MEGA",
      "timeframe": "10—20 YEARS",
      "icon": "🧬",
      "titleJa": "ポストヒューマン労働市場",
      "titleEn": "Post-Human Labor Market",
      "descriptionJa": "AI・ロボットが労働の大半を担い、人間は創造性と意味付けに特化する経済。"
    }
  ]
}
```

**バリデーションルール**（実装時のガード）:
- `id`: 一意な文字列。`{category}-{number}` 形式を推奨
- `category`: `"MEGA"` | `"MIDDLE"` | `"MICRO"` のいずれか（それ以外は無視）
- `icon`: 単一の絵文字文字列
- `titleJa`, `titleEn`, `descriptionJa`: 非空文字列

### 4.2 fallback.ts

```typescript
// src/data/fallback.ts
import type { TrendItem } from "../types";

export const fallbackTrends: TrendItem[] = [
  // 動画内で確認できた4件をハードコード
  // fetch失敗時のみ使用される
];
```

---

## 5. Styling Architecture

### 5.1 ファイル構成

| ファイル | 役割 |
|---------|------|
| `src/index.css` | `@import "tailwindcss"` ディレクティブのみ |
| `src/App.css` | CSS custom properties (`:root`), `@keyframes`, オーブ関連のカスタムCSS |
| 各コンポーネント | Tailwind utility classes を `className` で適用 |

### 5.2 Tailwind v4 設定

Tailwind CSS v4 は CSS-first config を採用。`tailwind.config.ts` は不要。代わりに `src/index.css` で `@theme` を使う。

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-bg-primary: #0b0e17;
  --color-bg-card: #141824;
  --color-mega: #8b5cf6;
  --color-middle: #22d3ee;
  --color-micro: #4ade80;
}
```

`vite.config.ts` に `@tailwindcss/vite` プラグインを追加:

```typescript
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/trend-gacha/",
});
```

### 5.3 カスタムCSSが必要な箇所

Tailwindで表現できない箇所のみ `App.css` に記述:

1. **オーブのリング回転**: `@keyframes spin { to { transform: rotate(360deg) } }`
2. **グロー効果**: `box-shadow` with CSS variable `--ring-color`
3. **結果カードのスライド**: `transform: translateY(100%)` → `translateY(0)` transition
4. **Overlayのフェード**: `opacity` transition

---

## 6. GitHub Pages Deployment Design

### 6.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 6.2 index.html

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Trend Gacha — FUTURE SIGNALS</title>
  <meta name="description" content="未来の兆しをランダムに引く。Mega・Middle・Microの3スケールでトレンドを発見。" />
  <meta property="og:title" content="Trend Gacha — FUTURE SIGNALS" />
  <meta property="og:description" content="未来の兆しをランダムに引く" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

## 7. Performance Considerations

- **Bundle size target**: < 100KB gzipped（React + app code）
- **First Contentful Paint**: < 1.5s（静的サイトなので達成容易）
- **trends.json**: 初回ロード時のみfetch。re-renderではキャッシュされたstateを使用
- **フォント**: システムフォント優先。Google Fonts は使わない（ロード時間削減）
  - `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", sans-serif`
  - タイトル用に1つだけ軽量なGoogle Fontを入れるかは実装時に判断（400KB以下なら許容）

---

## 8. Accessibility

- カテゴリフィルター: `role="radiogroup"` + 各ボタンに `role="radio"`, `aria-checked`
- ドローボタン: `aria-label="トレンドを引く"`, `aria-disabled` when spinning
- 結果カード: `role="dialog"`, `aria-modal="true"`, フォーカストラップ
- Escキーでカード閉じ
- カラーコントラスト: テキスト on ダーク背景は WCAG AA (4.5:1) 以上を確保

---

## 9. Error Handling

| 状態 | 挙動 |
|------|------|
| trends.json fetch失敗 | fallback データを使用。コンソールにwarn。ユーザーには通知しない |
| trends.json が空配列 | ドローボタンを disabled化。「トレンドデータがありません」表示 |
| フィルター結果が0件 | ドローボタンを disabled化。「このカテゴリにはまだデータがありません」表示 |
| JSON parse エラー | fallback データを使用（fetch失敗と同じ扱い） |
