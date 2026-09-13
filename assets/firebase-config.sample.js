/* ============================================================
   範本。複製成 assets/firebase-config.js 再把值填進去，
   本機測試就會連得上 Firebase。

   這支檔案在 .gitignore 裡，不會進版本庫。
   正式站的值來自 GitHub repo secret FIREBASE_CONFIG，
   由 .github/workflows/deploy.yml 在部署時產生同名檔案。
   ============================================================ */
window.CDVC_CONFIG.firebase = {
  apiKey: "AIza...",
  authDomain: "你的專案.firebaseapp.com",
  databaseURL: "https://你的專案-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "你的專案",
  appId: "1:000000000000:web:0000000000000000000000"
};
