# 活動前設定與現場操作手冊

分成三塊：**活動前要做的**、**現場當天怎麼開**、**三個畫面各自怎麼用**。
最後附上出事時的備援作法。

---

## 一、活動前

### 1. 建 Firebase（讓三個畫面連在一起）

沒有這一步，投影幕還是能用鍵盤跑完全部流程，但後臺遙控不了、比劃猴的手機也不會拿到題目。

1. 到 <https://console.firebase.google.com>，用社團的 Google 帳號登入，**新增專案**
   （名字隨便取，例如 `cdvc-welcome`；Google Analytics 可以關掉）。
2. 左側選 **建構 → Realtime Database → 建立資料庫**。
   - 位置選 **`asia-southeast1`（新加坡）**，離台灣最近。
   - 安全性規則先選「以測試模式啟動」，等一下會換掉。
3. 左上角齒輪 **專案設定 → 一般 → 您的應用程式**，點 **`</>`（網頁）**，
   隨便取個暱稱、**不要**勾 Firebase Hosting，按註冊。
4. 畫面會出現一段 `const firebaseConfig = { ... }`。**先放著，下一節會用到。**
5. 回到 **Realtime Database → 規則**，整段換成：

   ```json
   {
     "rules": {
       "rooms": {
         "$room": {
           ".read": true,
           ".write": true
         }
       }
     }
   }
   ```

   按發布。

**關於這份規則**：它是開放讀寫的，只是限制在 `rooms/` 底下。
這樣比劃猴掃了 QR 就能直接看題目，不用登入、不用註冊。代價是活動期間任何知道網址的人
都能寫入這個房間。裡面只有題目和主持人自己貼的名單，沒有其他個資，所以可以接受，但是：

- **活動結束後**請回 Firebase 主控台，把 `rooms` 節點整個刪掉，
  再把規則改回 `".read": false, ".write": false`。
- 免費方案同時上線人數上限是 100 人，這個活動只有三個畫面在連，綽綽有餘。

### 2. 把 Firebase 設定存成 repo secret（不進 git）

先說清楚一件事：**Firebase 的 web API key 本來就不是密碼**。
它只用來識別是哪一個專案，不授權任何存取；網站部署出去之後，任何人打開開發者工具
都看得到它。真正的防線是上面那份資料庫規則，以及活動後把資料刪掉。

即使如此，把它留在公開 repo 裡還是會被爬蟲掃到、被拿去亂打流量。所以這個專案的作法是：
**設定值存在 GitHub secret，部署時才寫進網站。**

1. repo → **Settings → Secrets and variables → Actions → New repository secret**
2. Name 填 **`FIREBASE_CONFIG`**
3. Secret 填一段 **JSON**（注意是 JSON，key 要加雙引號，跟 Firebase 給你的 JS 物件寫法略有不同）：

   ```json
   {
     "apiKey": "AIza....",
     "authDomain": "cdvc-welcome.firebaseapp.com",
     "databaseURL": "https://cdvc-welcome-default-rtdb.asia-southeast1.firebasedatabase.app",
     "projectId": "cdvc-welcome",
     "appId": "1:123456789:web:abc123"
   }
   ```

   > `databaseURL` 一定要有。它在 Realtime Database 頁面上方，
   > 長得像 `https://xxx-default-rtdb.asia-southeast1.firebasedatabase.app`。
   > 少了這一行，網頁會安靜地退回本機模式。

4. **Settings → Pages → Build and deployment → Source** 選 **`GitHub Actions`**
   （不是「Deploy from a branch」）。

之後每次 push 到 `main`，[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
會把 secret 寫成 `assets/firebase-config.js` 再部署。網站會在：

```
https://ntustcdvc1979.github.io/WelcomeParty/
```

> 改了 secret 之後要重新跑一次部署才會生效：
> repo → Actions → Deploy to GitHub Pages → Run workflow。

### 3. 想在自己電腦上測

複製一份設定檔，把值填進去：

```bash
cp assets/firebase-config.sample.js assets/firebase-config.js
```

`assets/firebase-config.js` 在 `.gitignore` 裡，不會被 commit 上去。
不想連 Firebase 的話這支檔案不用建，會走本機模式——
同一個瀏覽器的分頁之間還是會同步，一個人開三個分頁就能把整場走一遍。

本機模式要用 `http://` 開，不能用 `file://`（分頁之間會連不起來）。隨便起一個靜態伺服器：

```bash
npx serve .
```

房號、社群連結這些不敏感的設定放在 [`assets/settings.js`](../assets/settings.js)，那支是進 git 的。

### 4. 換掉指導老師的佔位資料

[`assets/teachers-data.js`](../assets/teachers-data.js) 裡面現在是兩位範例老師。
把姓名、頭銜、介紹換成真的，照片放進 `media/`（建議轉成 webp，直式或方形都可以）。
一位老師一頁投影片，順序就是陣列的順序。照片檔案找不到不會破圖，會自動用社徽頂著。

### 5. 準備題庫與名單

題庫和名單都可以現場再貼，但事先弄好比較不慌：

- **三隻猴子**：預設 12 題在 [`assets/monkeys-data.js`](../assets/monkeys-data.js)。
  第一次打開後臺會自動把它推上資料庫，之後在後臺改就好，不用重新部署。
- **抽獎名單**：一行一個名字。後臺那個輸入框永遠留著完整名單，
  抽走的人只從投影幕的名單移除，所以隨時可以按「重設抽獎」把全部人放回去。
- **獎項**：一行一個，數量寫在後面，例如 `頭獎 全聯禮券 x1`。沒寫數量就當作 1 個。

### 6. 印 QR code

[`index.html`](../index.html) 上有比劃猴要掃的 QR。投影幕的「三隻猴子規則」那一頁
也有同一個 QR，現場直接讓他們掃就好，不一定要印。

---

## 二、現場當天

1. **投影幕的電腦**開 `https://ntustcdvc1979.github.io/WelcomeParty/stage.html`，
   按 <kbd>F</kbd> 全螢幕。確認右下角顯示 **● 已連線**。
   - 顯示「● 本機模式」代表沒讀到 Firebase 設定，後臺和手機不會同步。
   - 顯示「● 連線中斷」代表設定讀到了但連不上，先檢查網路。
2. **主持人的手機**開 `.../WelcomeParty/admin.html`。
   確認最上面那塊顯示得出投影幕現在在第幾頁——顯示得出來就代表兩邊通了。
   - **不要把後臺投出去**，題目和抽獎名單都在上面。
3. **比劃猴**在三隻猴子那一關掃投影幕上的 QR，開 `.../WelcomeParty/phone.html`。
   每一組換人的時候，手機交給下一個比劃猴就好，不用重整。

> 同一天要跑兩場、不想互相干擾的話，三個網址都加上 `?r=WELCOME2`
> （房號隨便取，三邊要一致）。

---

## 三、三個畫面怎麼用

### 投影幕（鍵盤）

| 鍵 | 做什麼 |
|---|---|
| <kbd>→</kbd> <kbd>空白</kbd> <kbd>Enter</kbd> | 下一頁 |
| <kbd>←</kbd> | 上一頁 |
| <kbd>Esc</kbd> | 跳頁選單，點一下直接跳過去 |
| <kbd>F</kbd> | 全螢幕 |
| <kbd>T</kbd> | 看情況：三隻猴子 = 計時 90 秒（再按一次暫停）／抽獎 = 抽一位／大合照 = 3・2・1 倒數 |
| <kbd>R</kbd> | 重設本頁（計時器歸零、清掉畫面上的中獎者） |

滑鼠不動三秒，下面那條工具列會自己淡掉，晃一下滑鼠就回來。

### 後臺

- **投影幕遙控**：上一頁／下一頁，或用下拉直接跳到任何一頁。
- **三隻猴子**：點題庫上的任何一題就直接跳過去，或用上一題／下一題。
  改完題庫要按「套用題庫」才會生效。「打亂順序」是每一場換不同順序用的。
- **抽獎**：貼名單 → 套用名單 → 貼獎項 → 套用獎項 → 選現在要抽哪一個獎 →
  投影幕翻到「★ 抽獎進行中」→ 按「開始抽獎」。
  - 中獎者會從名單移除，不會重複中獎。
  - 某個獎抽滿了還是可以繼續抽（現場臨時加碼很常見），只會提醒一聲。
  - 「清空中獎紀錄」只清紀錄，名單不動；「重設抽獎」是全部人放回去、紀錄也清掉。

### 比劃猴的手機

打開就是題目，跟著後臺換。中途螢幕會盡量保持常亮（看瀏覽器支不支援）。

---

## 四、主持重點

**三隻猴子**。規則那一頁要講清楚三件事：比劃猴一個字都不能說、傳話猴手不能動、
猜題猴是**用畫的**不是用講的。答案不在投影幕上，所以全場都是觀眾，
猜題猴畫完再公布，那個落差就是笑點。一組大概 90 秒，計時器按 <kbd>T</kbd>。

**抽獎**。跑馬燈跑 2.6 秒才停，中間留白讓大家喊。中獎者是投影幕自己抽的，
不是後臺先選好再演——所以主持人也不知道會是誰。

**大合照**。先講好站位再按 <kbd>T</kbd>，倒數只有 3 秒。

---

## 五、出事的時候

**投影幕右下角顯示「連線中斷」**
　　投影幕自己還是能用鍵盤跑完全部流程。三隻猴子改成主持人口頭把題目給比劃猴看
　　（寫在紙上遞過去），抽獎改成投影幕上按 <kbd>T</kbd> 直接抽——那一顆不需要後臺。

**後臺遙控沒反應**
　　先看後臺最上面那塊有沒有顯示投影幕的頁碼。沒有就是沒連上，
　　重整後臺；還是不行就回去用投影幕的鍵盤，流程照樣跑得完。

**比劃猴的手機沒拿到題目**
　　確認手機網址列有 `?r=WELCOME`（房號跟投影幕一致）。
　　真的不行就讓比劃猴看後臺的手機，後臺上面也有目前的題目大字。

**投影幕整個掛掉**
　　重整就好，流程會回到第一頁，用 <kbd>Esc</kbd> 跳回剛剛那一關。
　　題庫、名單、中獎紀錄都存在資料庫，不會跟著消失。

**完全沒有網路**
　　投影幕單機就能跑。三隻猴子的題目用紙、抽獎用投影幕的 <kbd>T</kbd>，
　　題庫是 `assets/monkeys-data.js` 裡那 12 題。

---

## 六、活動之後

1. Firebase 主控台 → Realtime Database → 把 `rooms` 節點整個刪掉。
2. 規則改回 `".read": false, ".write": false`。
3. 想留紀錄的話，先把後臺的中獎名單截圖或抄下來再刪。
