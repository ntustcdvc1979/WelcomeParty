/* ============================================================
   指導老師介紹

   現在放的是佔位範例，活動前把資料換成真的就好，版面不用動：

     name    姓名
     en      英文名或姓名的英文拼寫
     title   頭銜（系所、職稱）
     titleEn 頭銜的英文
     photo   照片路徑，放在 media/ 底下，建議轉成 webp、直式方形都可以
             留白的話會用社徽當底，不會破圖
     lines   介紹，一行一句。三到四句最好念，太長投影幕會擠
     linesEn 對應的英文，一句對一句；少寫的那幾句就只會有中文

   一位老師一頁投影片，順序就是這個陣列的順序。
   ============================================================ */
(function (global) {
  "use strict";

  var TEACHERS = [
    {
      name: "王小明",
      en: "Prof. Wang Hsiao-ming",
      title: "機械工程系 教授",
      titleEn: "Professor, Mechanical Engineering",
      photo: "media/teacher1.webp",
      lines: [
        "崇德志工社的指導老師，帶社團走過第 12 個年頭。",
        "研究做的是材料，假日做的是伙食團的飯。",
        "常說：「服務不是犧牲，是把自己填滿以後溢出來的那一點。」"
      ],
      linesEn: [
        "Our club advisor, now in his twelfth year with us.",
        "Materials research on weekdays, cooking with the kitchen team on weekends.",
        "“Service is not sacrifice. It is what spills over once you are full.”"
      ]
    }
  ];

  global.CDVC_TEACHERS = { TEACHERS: TEACHERS };
})(window);
