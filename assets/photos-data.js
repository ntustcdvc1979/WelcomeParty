/* ============================================================
   投影幕上的照片

   兩種版面：

   CLUB   社團介紹。照片的位置直接照 0915 茶會那份「封面.pptx」排，
          每一張的 l/t/w/h 是佔投影片寬高的百分比（原稿是 20 x 11.25 吋），
          所以在任何解析度下看起來都跟原本的簡報一樣。
          超出邊界的那幾張本來就是滿出去的，不是算錯。

   WALLS  照片牆，沿用迎新那一套「等高 justified」排法：
          同一列的照片高度一樣、寬度依原始比例，所以每一張都完整呈現，
          不會被裁掉。照片張數多少都排得出來，載不到的那張會自己消失。

   檔案都在 media/photos/，一律 webp。
   ============================================================ */
(function (global) {
  "use strict";

  var P = "media/photos/";

  /* ---------- 社團介紹（照 pptx 的排版） ---------- */
  var CLUB = [
    {
      title: "志工・環保",
      align: "center",
      titleAt: { l: 8.84, t: 8.49, w: 84.38 },
      shots: [
        { src: P + "eco1.webp", alt: "環保志工服務", l: 32.32, t: 30.90, w: 35.35, h: 41.89 },
        { src: P + "eco2.webp", alt: "海邊淨灘", l: 0.84, t: 30.97, w: 31.37, h: 41.82 },
        { src: P + "eco3.webp", alt: "環保志工合影", l: 67.68, t: 30.90, w: 34.15, h: 41.82 }
      ]
    },
    {
      title: "志工・生命教育",
      align: "center",
      titleAt: { l: 8.84, t: 8.61, w: 84.38 },
      shots: [
        { src: P + "life1.webp", alt: "生命教育活動現場", l: 3.55, t: 27.35, w: 44.32, h: 59.11 },
        { src: P + "life2.webp", alt: "生命教育課程", l: 47.87, t: 27.35, w: 24.94, h: 59.11 },
        { src: P + "life3.webp", alt: "生命教育合影", l: 72.81, t: 27.35, w: 24.94, h: 59.11 }
      ]
    },
    {
      title: "STEAM 科學營",
      titleAt: { l: 6.40, t: 5.11, w: 38.74 },
      shots: [
        { src: P + "steam1.webp", alt: "科學營課程", l: 48.97, t: 6.50, w: 44.08, h: 52.18 },
        { src: P + "steam2.webp", alt: "小朋友動手做實驗", l: 36.69, t: 53.99, w: 49.95, h: 49.97 },
        { src: P + "steam3.webp", alt: "科學營帶隊", l: 3.77, t: 22.73, w: 46.87, h: 46.89 }
      ]
    },
    {
      title: "STEAM 科學營（竹圍）",
      titleAt: { l: 3.62, t: 3.30, w: 49.27 },
      shots: [
        { src: P + "zhuwei1.webp", alt: "竹圍科學營課堂", l: 6.37, t: 23.44, w: 41.70, h: 49.44 },
        { src: P + "zhuwei2.webp", alt: "竹圍科學營活動", l: 48.07, t: 4.12, w: 42.54, h: 50.43 },
        { src: P + "zhuwei3.webp", alt: "竹圍科學營合影", l: 44.02, t: 54.55, w: 39.75, h: 47.12 }
      ]
    },
    {
      title: "療愈手作社課",
      titleAt: { l: 1.65, t: 1.16, w: 38.74 },
      shots: [
        { src: P + "craft1.webp", alt: "手作社課現場", l: 34.46, t: 2.55, w: 35.70, h: 47.45 },
        { src: P + "craft2.webp", alt: "手作成品", l: 50.00, t: 50.00, w: 20.16, h: 47.59 },
        { src: P + "craft3.webp", alt: "專心手作中", l: 70.16, t: 21.11, w: 20.21, h: 47.86 },
        { src: P + "craft4.webp", alt: "大家一起做", l: 15.41, t: 50.00, w: 34.59, h: 46.17 }
      ]
    },
    {
      title: "甜蜜時光社課",
      titleAt: { l: 5.63, t: 5.11, w: 38.74 },
      shots: [
        { src: P + "sweet1.webp", alt: "甜點社課現場", l: 4.69, t: 28.53, w: 42.88, h: 50.81 },
        { src: P + "sweet2.webp", alt: "一起做甜點", l: 47.57, t: 6.50, w: 40.05, h: 47.44 },
        { src: P + "sweet3.webp", alt: "完成的甜點", l: 47.57, t: 50.00, w: 40.05, h: 47.45 }
      ]
    }
  ];

  /* ---------- 照片牆（沿用迎新的 p.42 / p.48 / p.49） ---------- */
  var WALLS = {

    /* 迎新 p.48 */
    relief: {
      eyebrow: "服務不挑地點",
      title: "賑災在哪，我們就在哪",
      lede: "醫療關懷隊帶著血壓計、血氧機和物資出隊。<br>" +
            "不是等一切都好了才去，是<b>需要的時候就在</b>。",
      items: [
        { src: P + "10.webp", alt: "醫療關懷隊在災區服務" }
      ]
    },

    /* 迎新 p.49 */
    global: {
      eyebrow: "而且不只在台灣",
      title: "我們也去海外義診交流",
      lede: "跟著團隊出國做義診、做交流，<br>" +
            "你會發現<b>需要幫忙的人到處都有</b>，<br>" +
            "而你的手可以伸得比想像中更遠。",
      items: [
        { src: P + "08.webp", alt: "海外義診服務現場" },
        { src: P + "09.webp", alt: "海外交流合影" }
      ]
    },

    /* 迎新 p.42 */
    kitchen: {
      eyebrow: "伙食團",
      title: "這就是我們平常開伙的樣子",
      lede: "每週三 18:30，蔬食開伙，歡迎下課後來用餐。<br>" +
            "如果早一點來，學長姐手把手教你煮飯喔。",
      items: [
        { src: P + "a0.webp", alt: "伙食團開伙" },
        { src: P + "a1.webp", alt: "一起備料" },
        { src: P + "a2.webp", alt: "廚房裡的日常" },
        { src: P + "a3.webp", alt: "一起煮飯" },
        { src: P + "a4.webp", alt: "上菜前" },
        { src: P + "a5.webp", alt: "圍在一起吃飯" }
      ]
    }
  };

  global.CDVC_PHOTOS = { CLUB: CLUB, WALLS: WALLS };
})(window);
