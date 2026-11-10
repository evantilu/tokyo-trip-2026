# 關東跟團與東京自由行攻略

手機優先的靜態旅行網站，含11/12–17跟團重點（旅遊、建築與房地產觀察）、11/17–21自由行、真實離線底圖、導航、本機清單與筆記。

## 部署

網站檔案位於 `site/`，不需要安裝套件或建置。GitHub Pages 的發布來源設為 **GitHub Actions**，推送 `main` 後執行 `.github/workflows/pages.yml`。

首次連網開啟，待「已可離線使用」狀態出現，再加入主畫面。外部地圖導航仍需網路。清單與筆記只存在本機瀏覽器，不會同步到GitHub。

## 隱私

依使用者要求保留住宿、日期、訂房姓名與原有文件連結，沒有分析追蹤或後端。請勿將密碼、權杖或付款資料加入原始碼。旅遊日期與地點仍屬網站內容，原有ChatGPT文件連結保留其自身存取權限。`noindex` 是搜尋引擎提示，不是存取控制。

## 更新

修改 `site/index.html`、`site/tour.js` 或 `site/tour.css` 後同步更新 `site/sw.js` 的CACHE版本，確保離線版本更新。

## 地圖來源

底圖：日本國土地理院淡色地圖（地理院タイル），圖磚內嵌。https://maps.gsi.go.jp/development/ichiran.html#pale

## 檢查

`node tests/guide.cjs`：跟團／自由行切換、日期、離團銜接、地圖、列印與筆記保留。

`node tests/offline.cjs`：離線資源、快取更新與外部導航。
