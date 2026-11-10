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

## 整合互動地圖

`explorer.js`/`explorer.css` 提供關東全程地圖、14家車店、日期公休提示、5公里直線附近搜尋、候選車連結及本機標記備份。未預約的建議不視為確認行程。

`shops-data.js` 由2026/11/10車店調查整理，位置使用Geolonia japanese-addresses公開全國資料在本機比對町丁目代表點，並非店門口。來源：https://github.com/geolonia/japanese-addresses （CC BY 4.0）。景點座標與各自來源見`tour-geo.js`，未指定小湊鐵道上下車站不放定位；汐留僅區域代表點。Google Maps搜尋地址確認入口。

本機Leaflet 1.9.4（BSD-2-Clause，見vendor/LICENSE）呈現國土地理院圖磚；離線預載僅原有都心20張z13圖磚，其他區域圖磚需先連網，Service Worker最多保留250張。標記/日期/店家筆記使用獨立儲存鍵，不覆寫原有行程筆記，可JSON匯入匯出。沒有自動公開上傳。

手機390×844實測地圖、詳細卡、全畫面與標記重開保留。
