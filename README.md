# 相見歡

台科大崇德志工社相見歡的現場互動簡報。投影幕跑流程、主持人用手機當後臺遙控，
三隻猴子的題目只出現在比劃猴的手機上。純靜態網頁，由 GitHub Actions 部署到 GitHub Pages。

**線上網址** <https://ntustcdvc1979.github.io/WelcomeParty/>

| 頁面 | 給誰 |
|---|---|
| [`stage.html`](stage.html) | 投影幕。接投影機的那台，主持人用鍵盤操作。 |
| [`admin.html`](admin.html) | 後臺。遙控翻頁、管三隻猴子的題目、填抽獎名單與獎項。要用核可過的 Google 帳號登入，**不要投出去**。 |
| [`phone.html`](phone.html) | 比劃猴的手機。只顯示目前的題目。 |
| [`index.html`](index.html) | 入口。三個頁面的連結、QR code、活動前的檢查清單。 |

## 流程

| | 段落 | 現場在做什麼 |
|---|---|---|
| | 首頁 | 社徽、社名、相見歡 |
| 🙈 | **三隻猴子** | 三人一組：比劃猴看手機比手畫腳、傳話猴用嘴巴描述、猜題猴閉眼把答案畫出來。題目由後臺換，投影幕只顯示第幾題與計時 |
| 🎓 | **指導老師** | 一位老師一頁，資料放在 `assets/teachers-data.js` |
| 🎁 | **抽獎** | 後臺貼名單與獎項，投影幕跑馬燈隨機抽，中獎者自動從名單移除 |
| 📸 | **大合照** | 按 <kbd>T</kbd> 跑 3・2・1・📸 |
| | 結束卡 | 社徽與 Instagram QR |

三隻猴子的題目**不會出現在投影幕上**。全場都不知道答案，猜題猴畫完才公布，
笑點才夠大——這也是為什麼比劃猴要用手機看題目。

## 開始之前

**必看** [`docs/SETUP.md`](docs/SETUP.md)：Firebase 設定、部署、現場操作、
以及網路出事時的備援作法。

最短路徑：

1. 建 Firebase 專案，開 Realtime Database。
2. 把設定存成 repo secret **`FIREBASE_CONFIG`**（JSON 格式），
   Settings → Pages → Source 選 **GitHub Actions**。push 之後會自動部署。
3. 把 [`assets/teachers-data.js`](assets/teachers-data.js) 的佔位資料換成真的老師，
   照片放進 `media/`。

沒設定 Firebase 也不會壞：投影幕會自動退到本機模式，鍵盤照樣跑完全部畫面，
只是後臺和手機不會同步。

## 鍵盤（投影幕）

<kbd>→</kbd> 下一頁　<kbd>←</kbd> 上一頁　<kbd>Esc</kbd> 跳頁選單　<kbd>F</kbd> 全螢幕

<kbd>T</kbd> 三隻猴子計時 90 秒／抽一位／大合照倒數　<kbd>R</kbd> 重設本頁

## 檔案

```
stage.html                     投影幕，流程的唯一真相來源
admin.html                     後臺
phone.html                     比劃猴的手機
index.html                     入口與檢查清單
assets/
  settings.js                  房號、社群連結等不敏感設定（進 git）
  firebase-config.sample.js    Firebase 設定範本
  firebase-config.js           實際設定，.gitignore 掉，由 CI 從 secret 產生
  net.js                       連線層：firebase → 本機模式自動降級
  theme.css                    色票與共用元件
  monkeys-data.js              三隻猴子的三個角色與預設題庫
  teachers-data.js             指導老師（姓名、頭銜、照片、介紹）
  qrcode.js                    自製 QR 產生器，不依賴任何外部服務
  logo1.webp logo2.webp        兩顆社徽
media/                         老師照片放這裡
docs/SETUP.md                  設定與現場操作手冊
docs/database.rules.json       Firebase 資料庫規則，直接貼進主控台
.github/workflows/deploy.yml   部署，順便把 secret 寫成 firebase-config.js
```

要換題目、換老師，動 `assets/*-data.js` 就好。
題庫還可以直接在後臺改，改完存在資料庫裡，不用重新部署。

## 資料怎麼流的

房間底下有五個節點，誰寫誰讀分得很清楚：

| 節點 | 誰寫 | 誰讀 |
|---|---|---|
| `outline` | 投影幕 | 後臺（跳頁下拉） |
| `state` | 投影幕 | 後臺、手機 |
| `control` | 後臺 | 投影幕 |
| `monkey` | 後臺 | 投影幕、手機 |
| `lottery/roster` `prizes` `prizeAt` `draw` | 後臺 | 投影幕 |
| `lottery/history` | 投影幕 | 兩邊 |

抽獎的亂數故意放在投影幕：跑馬燈停在誰身上，跟寫進資料庫的中獎者必須是同一個人。
讓後臺先抽好再叫投影幕演，中間斷線就會對不起來。

「還沒中獎的人」是 `roster` 減掉 `history` 算出來的，不另外存一份。
這樣投影幕只需要寫 `history`，名單本身就能鎖起來只讓登入過的管理員改
——不然投影幕沒登入，名單那個節點就得對所有人開放寫入。

## 後臺登入

後臺有題庫和抽獎名單，所以要 Google 登入，而且要社團核可過的帳號。
名單存在資料庫的 `admins/<uid>`，不進版本庫，所以幹部的 email 不會公開在 repo 上。

第一個管理員要在 Firebase 主控台手動加一筆（步驟在 SETUP 第 1.5 節），
之後新人自己登入一次，現任管理員在後臺按一下核可就好。

投影幕和比劃猴的手機**不用登入**——現場多一道登入就多一個會卡住的地方。
本機模式（沒設定 Firebase）整套登入都不會啟動。

## 關於那把 Firebase API key

Firebase 的 web API key 本來就不是密碼——它只識別專案，不授權存取，部署後在瀏覽器裡
本來就看得到。真正的防線是資料庫規則和活動後刪資料。這個 repo 仍然不把它寫進版本庫，
是為了不讓爬蟲從公開原始碼掃走亂打流量。詳見 SETUP.md 第二節。

## 資料與隱私

抽獎名單是主持人自己貼上去的，只有名字。不收系級、電話或任何聯絡方式。
資料存在社團自己的 Firebase 專案，活動結束後請照 SETUP.md 最後一節把它刪掉。
