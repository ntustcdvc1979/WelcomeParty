/* ============================================================
   投影幕上的照片

   兩種版面：

   CLUB   社團介紹。照片的位置直接照 0915 茶會那份「封面.pptx」排，
          每一張的 l/t/w/h 是佔投影片寬高的百分比（原稿是 20 x 11.25 吋，
          剛好 16:9），所以在任何解析度下看起來都跟原本的簡報一樣。
          超出邊界的那幾張本來就是滿出去的，不是算錯。

          deco 是畫在照片後面的裝飾，圖形在 stage.html 的 DECO 裡，
          l/t/w/h 一樣是百分比。SVG 會等比例縮進那個框，不會被拉變形。

   WALLS  照片牆，沿用迎新那一套「等高 justified」排法：
          同一列的照片高度一樣、寬度依原始比例，所以每一張都完整呈現，
          不會被裁掉。照片張數多少都排得出來，載不到的那張會自己消失。

   每一段文字都配一句英文（en），版面上排在中文下面一行。

   檔案都在 media/photos/，一律 webp。
   ============================================================ */
(function (global) {
  "use strict";

  var P = "media/photos/";

  /* ---------- 社團介紹（照 pptx 的排版） ---------- */
  var CLUB = [
    {
      title: "志工・環保",
      en: "Environmental Volunteering",
      align: "center",
      titleAt: { l: 8.84, t: 6.5, w: 84.38 },
      deco: [
        { kind: "sun", l: 84, t: 1, w: 14, h: 25 },
        { kind: "wave", l: -2, t: 74, w: 104, h: 26 }
      ],
      shots: [
        { src: P + "eco1.webp", alt: "環保志工服務", l: 32.32, t: 30.90, w: 35.35, h: 41.89 },
        { src: P + "eco2.webp", alt: "海邊淨灘", l: 0.84, t: 30.97, w: 31.37, h: 41.82 },
        { src: P + "eco3.webp", alt: "環保志工合影", l: 67.68, t: 30.90, w: 34.15, h: 41.82 }
      ]
    },
    {
      title: "志工・生命教育",
      en: "Life Education",
      align: "center",
      titleAt: { l: 8.84, t: 6.5, w: 84.38 },
      // 照片下緣在 86.5%，狗整隻放在那條空白帶裡，不要被壓掉半顆頭
      deco: [
        { kind: "dog", l: 6, t: 86.8, w: 11, h: 13 },
        { kind: "dog", l: 83, t: 86.8, w: 11, h: 13 }
      ],
      shots: [
        { src: P + "life1.webp", alt: "生命教育活動現場", l: 3.55, t: 27.35, w: 44.32, h: 59.11 },
        { src: P + "life2.webp", alt: "生命教育課程", l: 47.87, t: 27.35, w: 24.94, h: 59.11 },
        { src: P + "life3.webp", alt: "生命教育合影", l: 72.81, t: 27.35, w: 24.94, h: 59.11 }
      ]
    },
    {
      title: "STEAM 科學營",
      en: "STEAM Science Camp",
      titleAt: { l: 6.40, t: 3.5, w: 40 },
      deco: [
        { kind: "beaker", l: 87.5, t: 61, w: 11, h: 20 },
        { kind: "rocket", l: 92.5, t: 0.5, w: 7, h: 14 }
      ],
      shots: [
        { src: P + "steam2.webp", alt: "小朋友動手做實驗", l: 36.69, t: 53.99, w: 49.95, h: 49.97 },
        { src: P + "steam3.webp", alt: "科學營帶隊", l: 3.77, t: 22.73, w: 46.87, h: 46.89 },
        { src: P + "rocket.webp", alt: "水火箭發射瞬間", l: 1.50, t: 66.50, w: 34, h: 32 }
      ]
    },
    {
      title: "創藝營隊",
      en: "Creative Arts Camp",
      titleAt: { l: 3.62, t: 2.0, w: 49.27 },
      deco: [
        { kind: "grass", l: -1, t: 74, w: 30, h: 26 },
        { kind: "grass", l: 88, t: 76, w: 24, h: 24 },
        { kind: "mango", l: 91, t: 20, w: 9, h: 18 }
      ],
      shots: [
        { src: P + "zhuwei1.webp", alt: "創藝營隊課堂", l: 6.37, t: 23.44, w: 41.70, h: 49.44 },
        { src: P + "zhuwei2.webp", alt: "創藝營隊活動", l: 48.07, t: 4.12, w: 42.54, h: 50.43 },
        { src: P + "zhuwei3.webp", alt: "創藝營隊合影", l: 44.02, t: 54.55, w: 39.75, h: 47.12 }
      ]
    },
    {
      title: "紓壓手做",
      en: "Crafts to Unwind",
      titleAt: { l: 1.65, t: 1.16, w: 33 },
      deco: [
        { kind: "flower", l: 2.5, t: 14, w: 11, h: 20 },
        { kind: "pompom", l: 3.5, t: 62, w: 10, h: 18 },
        { kind: "flower", l: 91.5, t: 74, w: 8, h: 15 }
      ],
      // 原稿四張疊得很緊，這裡拉開留出間隔，每一張才看得完整
      shots: [
        { src: P + "craft1.webp", alt: "手作社課現場", l: 31.50, t: 2.00, w: 34.00, h: 45.20 },
        { src: P + "craft2.webp", alt: "手作成品", l: 52.00, t: 52.00, w: 19.00, h: 44.90 },
        { src: P + "craft3.webp", alt: "專心手作中", l: 74.50, t: 19.00, w: 19.50, h: 46.20 },
        { src: P + "craft4.webp", alt: "大家一起做", l: 15.00, t: 52.00, w: 33.00, h: 44.00 }
      ]
    },
    {
      title: "甜蜜食光社課",
      en: "Sweet Time Workshop",
      titleAt: { l: 5.63, t: 3.5, w: 40 },
      deco: [
        { kind: "donut", l: 88.5, t: 10, w: 11, h: 20 },
        { kind: "tiramisu", l: 7, t: 80, w: 14, h: 19 }
      ],
      shots: [
        { src: P + "sweet1.webp", alt: "甜點社課現場", l: 4.69, t: 28.53, w: 42.88, h: 50.81 },
        { src: P + "sweet2.webp", alt: "一起做甜點", l: 47.57, t: 6.50, w: 40.05, h: 47.44 },
        { src: P + "sweet3.webp", alt: "完成的甜點", l: 47.57, t: 50.00, w: 40.05, h: 47.45 }
      ]
    }
  ];

  /* ---------- 照片牆 ---------- */
  var WALLS = {

    /* 原本是一張九宮格拼貼，每一格都小到看不清楚。
       沿著白底切成八張分開放，等高排版就會把每一張撐大。
       第一張大合照用的是原始檔，不是從拼貼圖切下來的。 */
    relief: {
      title: "災難在哪，我們就在哪",
      titleEn: "Disaster Relief",
      items: [
        { src: P + "relief1.webp", alt: "醫療關懷隊全隊合影" },
        { src: P + "relief5.webp", alt: "APUVA STEM+M 醫療關懷隊" },
        { src: P + "relief6.webp", alt: "帶著物資出隊" },
        { src: P + "relief2.webp", alt: "量血氧" },
        { src: P + "relief3.webp", alt: "量血壓" },
        { src: P + "relief4.webp", alt: "準備醫材" },
        { src: P + "relief8.webp", alt: "現場檢測" }
      ]
    },

    global: {
      title: "海外交流，開拓視野",
      titleEn: "Overseas Exchange",
      items: [
        { src: P + "08.webp", alt: "海外義診服務現場" },
        { src: P + "09.webp", alt: "海外交流合影" },
        { src: P + "hoian.webp", alt: "越南惠安古鎮合影" }
      ]
    },

    /* 社遊：pptx 裡本來是兩頁九張，這裡挑四張代表性的併成一頁 */
    outing: {
      title: "社遊",
      titleEn: "Club Outings",
      items: [
        { src: P + "outing1.webp", alt: "平溪放天燈" },
        { src: P + "outing2.webp", alt: "擎天崗大合照" },
        { src: P + "outing3.webp", alt: "草地上野餐" },
        { src: P + "outing4.webp", alt: "蔬適 BBQ" }
      ]
    },

    kitchen: {
      title: "這就是我們平常開伙的樣子",
      titleEn: "This is how we cook together",
      lede: "每週三 18:30，蔬食開伙，歡迎下課後來用餐。",
      ledeEn: "Vegetarian cooking every Wednesday at 18:30.",
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
