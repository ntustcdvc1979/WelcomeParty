/* ============================================================
   三隻猴子（相見歡的破冰遊戲）

   三個人一組，站成一直線：

     🙊 比劃猴  題目只出現在他手機上（phone.html）。只能比手畫腳，一個字都不能說
     🙉 傳話猴  只看得到比劃猴的動作，用嘴巴描述給猜題猴聽
     🙈 猜題猴  閉上眼睛只能用聽的，然後把答案「畫」出來

   跟去年迎新最大的差別：題目不再上投影幕。
   全場都不知道答案，猜題猴畫完才公布，笑點才夠大。

   這裡的 TERMS 只是「第一次開後臺時的預設題庫」。
   現場真正用的題目存在 Firebase，由 admin.html 增刪修改，
   所以改完題目不用重新部署網站。要換整份預設題庫才動這支檔案。
   ============================================================ */
(function (global) {
  "use strict";

  var TERMS = [
    "太陽",
    "甜甜圈",
    "淨灘",
    "珍珠奶茶",
    "打瞌睡",
    "洗碗",
    "台北101",
    "掃地機器人",
    "搶頭香",
    "夜市撈金魚",
    "考試作弊被抓",
    "捷運上讓座"
  ];

  var ROLES = [
    {
      emoji: "🙊",
      name: "比劃猴",
      en: "The Mime",
      short: "只能比，不能說",
      shortEn: "Gesture only, no words",
      rule: "拿手機看題目。只能比手畫腳，發出任何一個字就算犯規。",
      ruleEn: "Read the word on the phone. Act it out. One spoken word and you are out."
    },
    {
      emoji: "🙉",
      name: "傳話猴",
      en: "The Teller",
      short: "只能說，不能比",
      shortEn: "Words only, no hands",
      rule: "只看得到比劃猴。用嘴巴把你看到的動作講給猜題猴聽，手不能動。",
      ruleEn: "You can only watch the Mime. Describe what you see out loud. Keep your hands still."
    },
    {
      emoji: "🙈",
      name: "猜題猴",
      en: "The Guesser",
      short: "閉眼，用畫的",
      shortEn: "Eyes shut, draw it",
      rule: "閉上眼睛，只能用聽的，然後把聽到的東西畫在紙上。",
      ruleEn: "Close your eyes, listen, then draw what you heard on paper."
    }
  ];

  global.CDVC_MONKEYS = { TERMS: TERMS, ROLES: ROLES };
})(window);
