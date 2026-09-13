/* ============================================================
   連線層

   兩種模式，會自動往下退，投影幕永遠跑得動：

     firebase  assets/firebase-config.js 有填設定 → 跨裝置即時同步
     local     沒填或連不上 → 同一台瀏覽器的分頁之間同步
               （BroadcastChannel，退無可退還有 storage 事件）
               開發測試、以及現場只用一台電腦時用得到

   房間底下有四個節點，誰寫誰讀分得很清楚，才不會兩邊互相蓋掉：

     outline   整份流程的頁名清單          stage 寫，admin 讀
               （流程只定義在 stage.html 一個地方，
                 後臺的「跳到哪一頁」下拉跟著它長出來）
     state     投影幕現在在第幾頁          stage 寫，admin / phone 讀
     control   後臺的遙控指令              admin 寫，stage 讀
     monkey    三隻猴子的題庫與目前第幾題  admin 寫，stage / phone 讀
     lottery   抽獎的名單、獎項、結果      admin 寫名單與指令
                                           stage 寫抽出來的結果（見下）

   抽獎的亂數故意放在 stage：跑馬燈停在誰身上，跟寫進資料庫的中獎者
   必須是同一個人。讓後臺先抽好再叫投影幕演，中間斷線就會對不起來。
   ============================================================ */
(function (global) {
  "use strict";

  var CFG = global.CDVC_CONFIG || {};

  /** 房間底下的四個節點 */
  var NODES = ["outline", "state", "control", "monkey", "lottery"];

  /** 網址上的 ?r= 可以臨時換房號，方便同一天跑兩場不互相干擾 */
  function roomCode() {
    var q = new URLSearchParams(location.search).get("r");
    return (q || CFG.room || "CDVC").toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  }

  var ROOM = roomCode();

  function newId() {
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  var NET = {
    room: ROOM,
    role: "",
    mode: "local",          // "firebase" | "local"
    connected: false,       // firebase 模式下，線路是不是真的通的
    onStatus: null,         // 連線狀態變化時的回呼
    ready: false
  };

  /* ---------- 訂閱 ---------- */
  var subs = {};            // node -> [cb]
  var last = {};            // node -> 最後一次收到的值
  var lastJson = {};        // node -> 上面那份的 JSON，用來擋掉沒變化的重播

  NODES.forEach(function (n) { subs[n] = []; last[n] = null; lastJson[n] = ""; });

  function fire(node, value) {
    var json = JSON.stringify(value === undefined ? null : value);
    if (json === lastJson[node]) { return; }
    lastJson[node] = json;
    last[node] = value;
    subs[node].forEach(function (cb) {
      try { cb(value); } catch (e) { console.error(e); }
    });
  }

  /* ---------- local：同瀏覽器分頁同步 ----------

     一個節點存一支 localStorage key，寫的時候也只碰自己那一支。

     一開始是整個房間存成一包的，結果投影幕每翻一頁就寫一次 state，
     那一次寫會把它讀到的整包房間原封不動存回去——包含後臺剛剛才刪掉的
     中獎紀錄。跨分頁的「讀-改-寫」本來就不是不可分割的動作，
     於是刪掉的東西會自己跑回來。拆開存就沒有這回事了。
     ------------------------------------------------- */
  var LS_PREFIX = "cdvc:" + ROOM + ":";
  var chan = null;

  function lsGet(node) {
    try {
      var raw = localStorage.getItem(LS_PREFIX + node);
      return raw === null ? null : JSON.parse(raw);
    } catch (e) { return null; }
  }

  function lsSet(node, value) {
    try { localStorage.setItem(LS_PREFIX + node, JSON.stringify(value)); }
    catch (e) { /* 無痕模式或空間滿了，就只靠 BroadcastChannel 撐著 */ }
  }

  function localInit() {
    NET.mode = "local";
    try { chan = new BroadcastChannel("cdvc:" + ROOM); } catch (e) { chan = null; }

    if (chan) {
      chan.onmessage = function (ev) {
        var m = ev.data || {};
        if (NODES.indexOf(m.node) >= 0) { fire(m.node, m.value); }
      };
    }

    // 沒有 BroadcastChannel 的瀏覽器還有 storage 事件可以撐著
    global.addEventListener("storage", function (ev) {
      if (!ev.key || ev.key.indexOf(LS_PREFIX) !== 0) { return; }
      var node = ev.key.slice(LS_PREFIX.length);
      if (NODES.indexOf(node) >= 0) { fire(node, lsGet(node)); }
    });

    NODES.forEach(function (n) { fire(n, lsGet(n)); });
  }

  /** 在物件上照 "a/b/c" 走下去，需要的話補出中間的物件 */
  function dig(obj, parts) {
    var at = obj;
    for (var n = 0; n < parts.length; n++) {
      if (typeof at[parts[n]] !== "object" || at[parts[n]] === null) { at[parts[n]] = {}; }
      at = at[parts[n]];
    }
    return at;
  }

  function localWrite(p, value, merge) {
    var parts = p.split("/");
    var node = parts.shift();
    if (NODES.indexOf(node) < 0) { return; }

    var next;

    if (!parts.length) {
      // 整個節點換掉（或併進去）
      var old = lsGet(node);
      next = (merge && old && typeof old === "object")
        ? Object.assign({}, old, value)
        : value;
    } else {
      next = lsGet(node);
      if (!next || typeof next !== "object") { next = {}; }

      var leaf = parts.pop();
      var box = dig(next, parts);

      if (value === null) { delete box[leaf]; }
      else if (merge && box[leaf] && typeof box[leaf] === "object") {
        box[leaf] = Object.assign({}, box[leaf], value);
      } else {
        box[leaf] = value;
      }
    }

    lsSet(node, next);
    if (chan) { chan.postMessage({ node: node, value: next }); }
    fire(node, next);
  }

  /* ---------- firebase ---------- */
  var fb = null;

  function hasFirebaseConfig() {
    var f = CFG.firebase || {};
    return !!(f.apiKey && f.databaseURL);
  }

  function firebaseInit() {
    var V = "https://www.gstatic.com/firebasejs/10.12.2/";

    return Promise.all([
      import(V + "firebase-app.js"),
      import(V + "firebase-database.js")
    ]).then(function (mods) {
      var app = mods[0].initializeApp(CFG.firebase);
      var d = mods[1];
      fb = {
        db: d.getDatabase(app),
        ref: d.ref,
        set: d.set,
        update: d.update,
        remove: d.remove,
        push: d.push,
        onValue: d.onValue
      };
      NET.mode = "firebase";
    });
  }

  function path(sub) { return "rooms/" + ROOM + (sub ? "/" + sub : ""); }

  /* ============================================================
     對外
     ============================================================ */

  /**
   * @param {"stage"|"admin"|"phone"} role
   * @returns {Promise<{mode:string}>} 一定 resolve；連不上就退到 local
   */
  NET.init = function (role) {
    NET.role = role;

    var start = hasFirebaseConfig()
      ? firebaseInit()["catch"](function (err) {
          console.warn("[cdvc] Firebase 連不上，改用本機模式：", err && err.message);
          fb = null;
        })
      : Promise.resolve();

    return start.then(function () {
      if (!fb) {
        localInit();
        NET.ready = true;
        return { mode: NET.mode };
      }

      // 連線真的通了沒有。設定填錯的話 initializeApp 不會報錯，
      // 要靠這裡才看得出來，主持人才不會以為一切正常。
      fb.onValue(fb.ref(fb.db, ".info/connected"), function (snap) {
        NET.connected = !!snap.val();
        if (NET.onStatus) { NET.onStatus(NET.connected); }
      });

      // 每個節點的第一份快照都到齊了才 resolve。
      // 訂閱的人要拿「開機當下的值」當基準，才不會把上一場留在資料庫裡的
      // 舊指令當成新指令又執行一次。
      var snapshots = NODES.map(function (n) {
        return new Promise(function (done) {
          var first = true;
          fb.onValue(fb.ref(fb.db, path(n)), function (snap) {
            fire(n, snap.val());
            if (first) { first = false; done(); }
          });
        });
      });

      // 連不上的時候 onValue 不會響。投影幕不能卡在這裡等，等一下就先上路。
      var giveUp = new Promise(function (done) { setTimeout(done, 4000); });

      return Promise.race([Promise.all(snapshots), giveUp]).then(function () {
        NET.ready = true;
        return { mode: NET.mode };
      });
    });
  };

  /**
   * 訂閱一個節點。
   * 一定會先用目前的值回呼一次（沒有值就是 null），訂閱的人靠這一次抓基準。
   */
  NET.on = function (node, cb) {
    subs[node].push(cb);
    try { cb(last[node]); } catch (e) { console.error(e); }
  };

  /** 整包覆蓋。path 可以是 "lottery/pool" 這種深一層的位置。 */
  NET.set = function (p, value) {
    if (fb) {
      return fb.set(fb.ref(fb.db, path(p)), value)["catch"](function (e) {
        console.warn("[cdvc] set " + p + " 失敗", e);
      });
    }
    localWrite(p, value, false);
    return Promise.resolve();
  };

  /** 只蓋指定欄位，其他留著。 */
  NET.update = function (p, patch) {
    if (fb) {
      return fb.update(fb.ref(fb.db, path(p)), patch)["catch"](function (e) {
        console.warn("[cdvc] update " + p + " 失敗", e);
      });
    }
    localWrite(p, patch, true);
    return Promise.resolve();
  };

  /** 往清單塞一筆，key 自動產生。 */
  NET.push = function (p, value) {
    if (fb) {
      return fb.push(fb.ref(fb.db, path(p)), value)["catch"](function (e) {
        console.warn("[cdvc] push " + p + " 失敗", e);
      });
    }
    localWrite(p + "/" + newId(), value, false);
    return Promise.resolve();
  };

  NET.remove = function (p) { return NET.set(p, null); };

  /** 活動結束或重跑一場：整個房間清掉 */
  NET.clearRoom = function () {
    if (fb) { return fb.remove(fb.ref(fb.db, path(""))); }
    NODES.forEach(function (n) {
      try { localStorage.removeItem(LS_PREFIX + n); } catch (e) { /* 清不掉就算了 */ }
      if (chan) { chan.postMessage({ node: n, value: null }); }
      fire(n, null);
    });
    return Promise.resolve();
  };

  /** 手機／後臺要掃的網址。page 例如 "phone.html" */
  NET.url = function (page) {
    var base = CFG.baseUrl || location.href.replace(/[^/]*$/, "");
    if (base.slice(-1) !== "/") { base += "/"; }
    return base + page + "?r=" + ROOM;
  };

  global.CDVC_NET = NET;
})(window);
