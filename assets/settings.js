/* ============================================================
   活動設定（可以進 git，這裡沒有任何機密）

   Firebase 的連線設定不在這裡，在 assets/firebase-config.js，
   那支檔案由 GitHub Actions 從 repo secret 產生，不會進版本庫。
   詳見 docs/SETUP.md。
   ============================================================ */
window.CDVC_CONFIG = {

  /* 房號。寫死才能事先把 QR code 印出來；要換場次改這裡，
     或用 stage.html?r=WELCOME2 之類的臨時覆寫（後臺與手機也要帶同一個 r）。 */
  room: "WELCOME",

  /* 站台網址。留白就用目前網域推算（同一個資料夾下的 phone.html / admin.html）。
     若投影幕是本機開檔、手機要連線上版，就把正式網址填在這裡，
     例如 "https://ntustcdvc1979.github.io/WelcomeParty/"。 */
  baseUrl: "",

  /* 社群連結，結束卡的 QR 用。 */
  socialUrl: "https://www.instagram.com/ntustcdvc/",

  /* 由 assets/firebase-config.js 覆寫。留 null = 本機模式。 */
  firebase: null
};
