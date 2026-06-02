# HCF 網站架構（Sitemap）

## 主要頁面
- `/index.html`
  - Hero：品牌主視覺、預約 CTA、版本提示
  - 六大課程卡片：桌面多欄 / 手機 snap 橫滑 / PWA safe-area 友善
  - 互動式課表 `#schedule`：桌面雙欄＋完整切換、手機點擊切換卡片、PWA standalone 自動避開底部手勢區
  - 價格預覽、教練預覽、新手問答
- `/classes.html`
  - 六大課程總覽入口，統一導向各獨立子頁
- `/muaythai.html` `/kickboxing.html` `/sanda.html` `/strength.html` `/group-class.html` `/private-class.html`
  - 每頁都有 Hero、課程介紹、適合對象、訓練流程、效益亮點、圖片與預約 CTA
- `/pricing.html`
  - 團體課、私人課、一對二、打靶課價格表與選課建議
- `/coaches.html`（`/team.html` 同步內容）
  - 響應式教練卡片牆、桌面 hover 灰階轉色、手機 / APP 點擊展開詳情
- `/faq.html`
  - 新手問答與第一次到館流程
- `/philosophy.html`
  - 品牌精神與文案核心訊號
- `/news.html`
  - 網站與課程更新整理
- `/offline.html`
  - 離線 fallback，保留同一套視覺語彙與聯絡入口

## 共用互動
- 固定導覽列 `#navbar`
  - 桌面：課程介紹 hover 下拉 `.dropdown-menu`
  - 手機：`#nav-drawer` 抽屜
  - 品牌介紹：`#brand-drawer`
- `#booking-modal`
  - `openBooking()` / `submitBooking()`，串接 `/.netlify/functions/bookings`
- `#ai-fab` + `#ai-chat-panel`
  - 串接 `/.netlify/functions/chat-claude`
- `toggleTheme()`
  - 切換 light-mode
- `.fade-up`
  - IntersectionObserver 進場動畫
- `.magnetic-btn`
  - 桌面細指標裝置磁吸效果
- PWA / standalone
  - `display-mode: standalone` 透過 JS 與 CSS 套用 `.is-standalone`
  - 處理 `env(safe-area-inset-top/bottom)`，避免導覽列、抽屜、AI 與底部 CTA 遮擋

## 三種版本呈現
- 桌面版
  - 完整導覽列、課程下拉、hover 發光、磁吸按鈕、自訂游標
- 行動版
  - 行動抽屜、底部固定 CTA、課程卡片 snap、課表點擊切換、教練卡片點擊展開
- APP 版（PWA standalone）
  - safe-area 優化、固定元件位置修正、離線頁與首頁課表皆可正常顯示
