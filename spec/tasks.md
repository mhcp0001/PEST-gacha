# Tasks — Trend Gacha

> SDD Phase: **Tasks**  
> Status: **Approved**  
> Depends on: `specs/design.md`

---

## Overview

全タスクは依存関係に基づき順序付けされている。各タスクは **atomic commit** として実装し、タスク完了ごとに `git add -A && git commit` する。

**並列実行可能なグループ**は `[P]` マークで示す。

---

## Task 1: Project Scaffolding

**Goal**: Vite + React + TypeScript の初期プロジェクトをセットアップし、ビルドが通る状態にする。

**Steps**:
1. `npm create vite@latest . -- --template react-ts` でプロジェクト初期化（既存ファイルを上書きしないよう注意）
2. `npm install`
3. `npm install -D @tailwindcss/vite` をインストール
4. `vite.config.ts` を編集:
   - `@tailwindcss/vite` プラグインを追加
   - `base: "/trend-gacha/"` を設定
5. `src/index.css` を Tailwind v4 用に書き換え:
   ```css
   @import "tailwindcss";
   ```
6. 不要なデフォルトファイルを削除: `src/App.css`（後で再作成）, `src/assets/`, デフォルトの `App.tsx` 内容
7. `src/App.tsx` を最小限の内容に置き換え（"Hello Trend Gacha" 表示のみ）
8. `npm run dev` で起動確認
9. `npm run build` でビルド確認

**Commit**: `chore: scaffold Vite + React + TS + Tailwind v4`

**Acceptance**:
- [x] `npm run dev` でブラウザにページが表示される
- [x] `npm run build` がエラーなく完了する
- [x] Tailwind のユーティリティクラスが適用される

---

## Task 2: Type Definitions & Data Layer

**Goal**: TypeScript型定義、フォールバックデータ、trends.json、useTrends フックを作成する。

**Steps**:
1. `src/types/index.ts` を作成:
   - `TrendItem`, `TrendsData`, `HistoryItem`, `FilterCategory` を定義
2. `public/data/trends.json` を作成:
   - 仕様書の11件のサンプルデータ4件 + MEGA カテゴリを含む追加データで合計12件以上
   - 各カテゴリ最低4件ずつ
3. `src/data/fallback.ts` を作成:
   - 各カテゴリから1件ずつ、計3件のフォールバックデータ
4. `src/hooks/useTrends.ts` を作成:
   - `import.meta.env.BASE_URL` を使った fetch
   - try/catch でフォールバック
5. `src/App.tsx` で `useTrends()` を呼び出し、`trends.length` を画面に表示して動作確認

**Commit**: `feat: add type definitions, trends data, and useTrends hook`

**Acceptance**:
- [x] `trends.json` が valid JSON として parse できる
- [x] 各カテゴリに最低4件のデータがある
- [x] 開発サーバーで trends の件数が画面に表示される
- [x] `public/data/trends.json` を一時的にリネームしてもフォールバックデータが使われる

---

## Task 3: useGacha Hook

**Goal**: ガチャのコアロジック（フィルター、ドロー、履歴、カード表示制御）を実装する。

**Steps**:
1. `src/hooks/useGacha.ts` を作成
2. State: `filter`, `history`, `currentResult`, `isSpinning`, `showCard`
3. `draw()`: design.md §3.2 の仕様通りに実装
   - フィルター適用 → 直前回避 → ランダム選出 → 2秒遅延 → 結果セット
4. `closeCard()`: showCard を false にする（currentResult は保持）
5. `clearHistory()`: history を空配列にする
6. `selectHistory(item)`: currentResult をセットし showCard を true にする
7. キーボードイベント:
   - `useEffect` 内で `keydown` リスナー登録
   - Space/Enter → `draw()`（`document.body` がフォーカス時のみ）
   - Escape → `closeCard()`
   - クリーンアップで `removeEventListener`
8. `src/App.tsx` でフックを使い、JSON で state をダンプ表示して動作確認

**Commit**: `feat: implement useGacha hook with draw, filter, and history logic`

**Acceptance**:
- [x] フィルター切替で候補が絞られる
- [x] ドロー実行で 2 秒後に結果が出る
- [x] 同じ結果が連続しない（候補2件以上の場合）
- [x] 履歴が新しい順で蓄積される
- [x] Space/Enter でドロー、Escape でカード閉じが動作する

---

## Task 4: CSS Foundation

**Goal**: カラートークン、グローバルスタイル、オーブのキーフレームアニメーションを定義する。

**Steps**:
1. `src/App.css` を作成:
   - `:root` に CSS custom properties（design.md §5 のカラートークン全部）
   - `body` に `background-color: var(--bg-primary)`, `color: var(--text-primary)`
   - `@keyframes spin { to { transform: rotate(360deg) } }`
   - `.orb-ring` のベーススタイル（border, border-radius, position, animation）
   - `.orb-ring--spinning` の加速スタイル
   - `.orb-container[data-category]` によるグロー色切替
   - `.overlay` のスタイル（position fixed, bg overlay, opacity transition）
   - `.result-card` のスライドアニメーション（translateY transition）
2. `src/index.css` に `@theme` ブロックでTailwindカスタムカラーを登録
3. フォント設定: `font-family` をシステムフォントスタックに

**Commit**: `style: add CSS custom properties, keyframes, and base styles`

**Acceptance**:
- [x] ページ背景がダークネイビー (#0b0e17)
- [x] テキストが明るい色で表示される
- [x] `.orb-ring` にアニメーションが適用される（要素を仮配置して確認）

---

## Task 5: Header Component `[P]`

**Goal**: ヘッダー部分を実装する。

**Steps**:
1. `src/components/Header.tsx` を作成
2. 3段構成: サブタイトル `FUTURE SIGNALS` → タイトル `Trend Gacha` → 説明文
3. Tailwind classes:
   - サブタイトル: `uppercase tracking-[0.3em] text-sm` + muted color
   - タイトル: `text-5xl font-light` + primary color
   - 説明文: `text-sm` + muted color
4. 中央揃え: `text-center`
5. App.tsx に組み込み

**Commit**: `feat: add Header component`

**Acceptance**:
- [x] 3段のテキストが中央揃えで表示される
- [x] letter-spacing, サイズ, 色が仕様通り

---

## Task 6: CategoryFilter Component `[P]`

**Goal**: カテゴリフィルターのセグメントコントロールを実装する。

**Steps**:
1. `src/components/CategoryFilter.tsx` を作成
2. Props: `filter`, `onFilterChange`
3. 4つのボタンを `flex` で横並び
4. 外枠: 角丸ピル、subtle border
5. 選択状態: 背景色をカテゴリカラーに（ALL=slate, MEGA=purple, MIDDLE=cyan, MICRO=green）
6. 非選択状態: 透過背景、テキストのみ
7. transition: `transition-all duration-200`
8. `role="radiogroup"`, 各ボタンに `role="radio"`, `aria-checked`
9. App.tsx に組み込み、`useGacha` の `filter`/`setFilter` を接続

**Commit**: `feat: add CategoryFilter component`

**Acceptance**:
- [x] 4つのボタンが表示される
- [x] クリックでフィルターが切り替わる
- [x] 選択中のボタンにカテゴリカラーが適用される
- [x] トランジションアニメーションがスムーズ

---

## Task 7: GachaOrb Component

**Goal**: ガチャオーブ（回転リング + 中央アイコン）を実装する。

**Depends on**: Task 4 (CSS Foundation)

**Steps**:
1. `src/components/GachaOrb.tsx` を作成
2. Props: `isSpinning`, `currentIcon`, `activeCategory`
3. DOM構造: design.md §2.4 の通り
   - `.orb-container` に `data-category` 属性
   - 3つの `.orb-ring`（outer, middle, inner）— 各サイズ・速度が異なる
   - `.orb-core` に絵文字アイコン表示（null時はデフォルトアイコンまたは空）
4. `isSpinning` が true のとき、各リングに `.orb-ring--spinning` クラスを追加
5. リングのサイズ:
   - outer: 280px (モバイル) / 320px (デスクトップ)
   - middle: 220px / 260px
   - inner: 160px / 200px
6. リングの見た目: `border: 2px solid` + `box-shadow` with `var(--ring-color)`
7. レスポンシブ: `clamp()` で中間サイズを補間
8. App.tsx に組み込み

**Commit**: `feat: add GachaOrb component with ring animations`

**Acceptance**:
- [x] 3つのリングが同心円状に表示される
- [x] 待機中はゆっくり回転している
- [x] `isSpinning` で回転が高速化する
- [x] カテゴリに応じてリングのグロー色が変わる
- [x] 中央にアイコンが表示される

---

## Task 8: DrawButton Component `[P]`

**Goal**: ドローボタンを実装する。

**Steps**:
1. `src/components/DrawButton.tsx` を作成
2. Props: `onDraw`, `disabled`
3. ボタン: `DRAW TREND` テキスト、角丸矩形、border、`tracking-[0.15em] uppercase`
4. ヒントテキスト: `Space / Enter でも引けます`（小文字、muted）
5. disabled 時: opacity 50%, cursor not-allowed
6. hover: subtle な光沢効果（border-color の変化 or background の微変化）
7. App.tsx に組み込み、`useGacha` の `draw`/`isSpinning` を接続

**Commit**: `feat: add DrawButton component`

**Acceptance**:
- [x] ボタンが表示される
- [x] クリックで onDraw が呼ばれる
- [x] disabled 時は見た目が変わりクリック不可
- [x] ヒントテキストが表示される

---

## Task 9: ResultCard Component

**Goal**: 結果カード（モーダル/ボトムシート）を実装する。

**Depends on**: Task 4 (CSS Foundation — overlay/slide styles)

**Steps**:
1. `src/components/ResultCard.tsx` を作成
2. Props: `trend`, `onClose`
3. DOM構造: design.md §2.6 の通り
   - overlay (背景dim) + card
   - カテゴリバッジ、タイムフレーム、閉じるボタン、アイコン、タイトル（日/英）、区切り線、説明文
4. overlay click → `onClose`、card click → `e.stopPropagation()`
5. カード枠: `border: 1px solid` カテゴリカラー + `box-shadow` glow
6. アニメーション:
   - mount 時: overlay opacity 0→1, card translateY(100%)→0
   - `useEffect` + `requestAnimationFrame` で mount 直後にクラス付与
7. `Escape` キーでの閉じは `useGacha` 側で処理済み
8. App.tsx に組み込み

**Commit**: `feat: add ResultCard component with slide-up animation`

**Acceptance**:
- [x] ドロー後にカードがボトムからスライドアップする
- [x] カテゴリバッジ・タイムフレーム・アイコン・タイトル・説明が正しく表示される
- [x] ×ボタン or 背景クリック or Escapeで閉じる
- [x] カード枠がカテゴリカラーで光っている
- [x] 閉じるアニメーションが動作する

---

## Task 10: History Component

**Goal**: 履歴リストを実装する。

**Steps**:
1. `src/components/History.tsx` を作成
2. Props: `items`, `onClear`, `onSelect`
3. ヘッダー行: `HISTORY` (左) + `CLEAR` (右)
4. リスト: 各アイテム → `• {icon} {titleJa}  CATEGORY`
   - カテゴリラベルの色分け
   - クリックで `onSelect(item)`
5. 空状態: 「まだ履歴がありません」
6. CLEAR ボタン: items が空の場合は非表示 or disabled
7. App.tsx に組み込み

**Commit**: `feat: add History component`

**Acceptance**:
- [x] ドロー後に履歴が追加される
- [x] 新しい順で表示される
- [x] カテゴリカラーが正しい
- [x] アイテムクリックでカードが再表示される
- [x] CLEAR で全履歴が消える

---

## Task 11: Full Integration & Polish

**Goal**: 全コンポーネントを統合し、レイアウト・間隔・レスポンシブを仕上げる。

**Steps**:
1. App.tsx のレイアウト整理:
   - 全体: `min-h-screen flex flex-col items-center`
   - max-width 制約: `max-w-[600px] w-full mx-auto px-4`
   - セクション間の spacing 調整
2. レスポンシブ確認:
   - 375px (iPhone SE)
   - 390px (iPhone 14)
   - 768px (iPad)
   - 1024px+ (Desktop)
3. オーブの `clamp()` サイジングを微調整
4. フィルター切替時のオーブカラー変化が滑らかか確認
5. ドロー→結果表示→閉じる→履歴追加 の一連フローをE2Eで確認
6. 連打テスト（isSpinning ガードが効いているか）
7. Edge cases: フィルターをMEGAにしてデータが1件しかない場合の挙動

**Commit**: `feat: integrate all components and polish layout`

**Acceptance**:
- [x] 全コンポーネントが正しく配置されている
- [x] モバイル〜デスクトップで崩れない
- [x] ドローのフルフローが正常動作する
- [x] 連打しても壊れない

---

## Task 12: GitHub Pages Deployment Setup

**Goal**: GitHub Actions ワークフローを作成し、自動デプロイを設定する。

**Steps**:
1. `.github/workflows/deploy.yml` を design.md §6.1 の内容で作成
2. `index.html` の OGP メタタグを確認・調整
3. `public/favicon.svg` を作成（シンプルなガチャアイコン or 🎯 のSVG化）
4. README.md を作成:
   - プロジェクト概要
   - ライセンス注記（Code: MIT, Data: proprietary注記）
   - 開発手順 (`npm run dev`, `npm run build`)
   - trends.json の編集方法
5. `npm run build` でローカルビルド最終確認
6. git push → GitHub Actions でデプロイ

**Commit**: `ci: add GitHub Actions workflow for Pages deployment`

**Acceptance**:
- [x] push to main で GitHub Actions が起動する
- [x] ビルドが成功する
- [x] GitHub Pages でサイトが表示される
- [x] trends.json が正しく読み込まれる（BASE_URL パスが機能している）

---

## Task Summary

| # | Task | Depends | Est. |
|---|------|---------|------|
| 1 | Project Scaffolding | — | 10min |
| 2 | Type Definitions & Data Layer | 1 | 15min |
| 3 | useGacha Hook | 2 | 20min |
| 4 | CSS Foundation | 1 | 15min |
| 5 | Header Component `[P]` | 4 | 5min |
| 6 | CategoryFilter Component `[P]` | 4 | 10min |
| 7 | GachaOrb Component | 4 | 20min |
| 8 | DrawButton Component `[P]` | 4 | 5min |
| 9 | ResultCard Component | 4 | 15min |
| 10 | History Component | 4 | 10min |
| 11 | Full Integration & Polish | 3,5,6,7,8,9,10 | 20min |
| 12 | GitHub Pages Deployment | 11 | 10min |

**Total estimated**: ~2.5 hours

**Dependency graph**:
```
1 → 2 → 3 ─────────────────────┐
1 → 4 → 5 [P] ─────────────────┤
       → 6 [P] ─────────────────┤
       → 7 ─────────────────────┤→ 11 → 12
       → 8 [P] ─────────────────┤
       → 9 ─────────────────────┤
       → 10 ────────────────────┘
```
