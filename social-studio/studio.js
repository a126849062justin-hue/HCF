/* ============================================================
   HCF 社群貼文模板工作室 — studio.js
   - 多種模板（課程 / 選手 / 賽事 / 課表 / 金句 / 限動）
   - 即時預覽 + html2canvas 匯出 PNG
   ============================================================ */
(function () {
  "use strict";

  // 共用工具：HTML 跳脫，避免使用者輸入破壞版面
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // 將「{紅字}」語法轉成紅色描邊字
  const hi = (s) => esc(s).replace(/\{([^}]+)\}/g, '<i>$1</i>');
  const nl = (s) => esc(s).replace(/\n/g, "<br>");

  // ---------- 模板定義 ----------
  // size: sq(1:1) / pt(4:5) / st(9:16)
  const TEMPLATES = {
    course: {
      name: "課程宣傳",
      size: "sq",
      desc: "推廣單一課程或體驗班。標題可用 {大括號} 把字標紅。",
      fields: [
        { k: "tag", label: "右上標籤", v: "NEW CLASS" },
        { k: "kick", label: "英文小標", v: "MUAY THAI / 泰拳" },
        { k: "title", label: "主標題", v: "新手{體驗班}\n開班招生", type: "textarea" },
        { k: "sub", label: "副標／說明", v: "零基礎也能上！專業教練帶你打出第一拳。", type: "textarea" },
        { k: "chip1", label: "資訊標籤 1", v: "每週二・四 19:30" },
        { k: "chip2", label: "資訊標籤 2", v: "首堂 NT$0" },
        { k: "cta", label: "行動呼籲", v: "立即{預約}" },
        { k: "at", label: "帳號 / 標記", v: "@HCF.FIGHT" },
      ],
      render: (d) => topShell(d) + `
        <div class="body">
          <div class="kick">${esc(d.kick)}</div>
          <h1>${hi(d.title)}</h1>
          <div class="sub">${nl(d.sub)}</div>
          <div class="meta">
            ${chip(d.chip1, true)}${chip(d.chip2)}
          </div>
          ${foot(d)}
        </div>`,
    },

    fighter: {
      name: "選手聚焦",
      size: "pt",
      desc: "介紹館內選手 / 教練，建議上傳人物照當背景。",
      fields: [
        { k: "tag", label: "右上標籤", v: "FIGHTER" },
        { k: "kick", label: "英文小標", v: "TEAM HCF" },
        { k: "title", label: "選手名", v: "高{敏倫}", type: "textarea" },
        { k: "sub", label: "稱號 / 一句話", v: "WBC 國家代表隊・泰拳選手", type: "textarea" },
        { k: "chip1", label: "戰績標籤 1", v: "12 勝 2 敗" },
        { k: "chip2", label: "戰績標籤 2", v: "5 KO" },
        { k: "cta", label: "底部標語", v: "永不{退讓}" },
        { k: "at", label: "帳號 / 標記", v: "@HCF.FIGHT" },
      ],
      render: (d) => topShell(d) + `
        <div class="body">
          <div class="kick">${esc(d.kick)}</div>
          <h1>${hi(d.title)}</h1>
          <div class="sub">${nl(d.sub)}</div>
          <div class="meta">${chip(d.chip1, true)}${chip(d.chip2)}</div>
          ${foot(d)}
        </div>`,
    },

    fight: {
      name: "賽事公告",
      size: "sq",
      desc: "宣布出賽 / 賽事結果。日期、對戰組合一目了然。",
      fields: [
        { k: "tag", label: "右上標籤", v: "FIGHT NIGHT" },
        { k: "kick", label: "賽事名稱", v: "MAX FC 113" },
        { k: "title", label: "主標題", v: "HCF 出戰\n{越南}站", type: "textarea" },
        { k: "sub", label: "對戰 / 說明", v: "高敏倫 vs. Nguyen — 75kg 泰拳對決", type: "textarea" },
        { k: "chip1", label: "日期", v: "2026.07.12 SAT" },
        { k: "chip2", label: "地點", v: "胡志明市" },
        { k: "cta", label: "行動呼籲", v: "為他們{加油}" },
        { k: "at", label: "帳號 / 標記", v: "@HCF.FIGHT" },
      ],
      render: (d) => topShell(d) + `
        <div class="body">
          <div class="kick">${esc(d.kick)}</div>
          <h1>${hi(d.title)}</h1>
          <div class="sub">${nl(d.sub)}</div>
          <div class="meta">${chip(d.chip1, true)}${chip(d.chip2)}</div>
          ${foot(d)}
        </div>`,
    },

    schedule: {
      name: "每週課表",
      size: "pt",
      desc: "一週課程一次貼出。每行格式：星期 | 課程 | 時間。",
      fields: [
        { k: "tag", label: "右上標籤", v: "SCHEDULE" },
        { k: "kick", label: "英文小標", v: "WEEKLY TIMETABLE" },
        { k: "title", label: "主標題", v: "本週{課表}", type: "textarea" },
        {
          k: "rows", label: "課程（每行：星期 | 課程 | 時間）", type: "textarea",
          v: "MON | 泰拳基礎 | 19:30\nTUE | 散打技術 | 20:00\nWED | 自由搏擊 | 19:30\nTHU | 體能訓練 | 18:00\nFRI | 實戰對練 | 20:00\nSAT | 兒童班 | 10:00",
        },
        { k: "cta", label: "底部標語", v: "本週{見}" },
        { k: "at", label: "帳號 / 標記", v: "@HCF.FIGHT" },
      ],
      render: (d) => topShell(d) + `
        <div class="body">
          <div class="kick">${esc(d.kick)}</div>
          <h1>${hi(d.title)}</h1>
          <div class="rows">${schedRows(d.rows)}</div>
          ${foot(d)}
        </div>`,
      extraClass: "sched",
    },

    quote: {
      name: "金句語錄",
      size: "sq",
      desc: "勵志金句 / 教練語錄，乾淨有力。",
      fields: [
        { k: "tag", label: "右上標籤", v: "MINDSET" },
        { k: "title", label: "金句", v: "你不是在訓練{身體}\n而是在鍛鍊{意志}", type: "textarea" },
        { k: "author", label: "署名", v: "— 黃教練" },
        { k: "at", label: "帳號 / 標記", v: "@HCF.FIGHT" },
      ],
      render: (d) => topShell(d, true) + `
        <div class="body">
          <div class="qmark">“</div>
          <h1>${hi(d.title)}</h1>
          <div class="author">${esc(d.author)}</div>
          ${foot(d, true)}
        </div>`,
      extraClass: "quote",
    },

    story: {
      name: "限時動態",
      size: "st",
      desc: "9:16 直式，適合 IG / FB 限時動態。",
      fields: [
        { k: "tag", label: "右上標籤", v: "TODAY" },
        { k: "kick", label: "英文小標", v: "OPEN MAT" },
        { k: "title", label: "主標題", v: "今晚\n{自由對練}", type: "textarea" },
        { k: "sub", label: "說明", v: "20:00 開始・歡迎舊生回來打卡", type: "textarea" },
        { k: "chip1", label: "資訊標籤 1", v: "免費參加" },
        { k: "chip2", label: "資訊標籤 2", v: "名額 12 人" },
        { k: "cta", label: "行動呼籲", v: "上滑{報名}" },
        { k: "at", label: "帳號 / 標記", v: "@HCF.FIGHT" },
      ],
      render: (d) => topShell(d) + `
        <div class="body">
          <div class="kick">${esc(d.kick)}</div>
          <h1>${hi(d.title)}</h1>
          <div class="sub">${nl(d.sub)}</div>
          <div class="meta">${chip(d.chip1, true)}${chip(d.chip2)}</div>
          ${foot(d)}
        </div>`,
    },
  };

  // ---------- 片段組裝 ----------
  function topShell(d, noGhost) {
    return `
      <div class="bg" id="bgSlot"></div>
      <div class="scrim"></div>
      <div class="dot"></div>
      ${noGhost ? "" : `<div class="ghost">HCF</div>`}
      <div class="edge"></div>
      <div class="inner">
        <div class="topline">
          <div class="logo">
            <img src="../shark_logo.png" alt="" onerror="this.style.display='none'">
            <b>HCF<i>.</i></b>
          </div>
          ${d.tag ? `<div class="tag">${esc(d.tag)}</div>` : ""}
        </div>`;
    // 注意：inner 由各模板的 body 接續、最後統一補 </div> 收尾
  }
  function chip(t, red) {
    return t ? `<div class="chip${red ? " red" : ""}">${esc(t)}</div>` : "";
  }
  function foot(d, center) {
    if (!d.cta && !d.at) return `</div>`; // 收掉 inner
    return `
      <div class="foot"${center ? ' style="justify-content:center;gap:40px"' : ""}>
        ${d.cta ? `<div class="cta">${hi(d.cta)}</div>` : ""}
        ${d.at ? `<div class="at">${esc(d.at)}</div>` : ""}
      </div>
    </div>`; // 收掉 inner
  }
  function schedRows(raw) {
    return String(raw || "").split("\n").filter((l) => l.trim()).map((line) => {
      const p = line.split("|").map((x) => x.trim());
      return `<div class="r">` +
        `<div class="d">${esc(p[0] || "")}</div>` +
        `<div class="n">${esc(p[1] || "")}</div>` +
        `<div class="t">${esc(p[2] || "")}</div>` +
        `</div>`;
    }).join("");
  }

  // ---------- 狀態 ----------
  let current = "course";
  let bgDataUrl = null; // 使用者上傳的背景圖
  const data = {};      // 目前模板的欄位值

  const post = document.getElementById("post");
  const scaler = document.getElementById("scaler");
  const form = document.getElementById("form");
  const tabsEl = document.getElementById("tabs");
  const sizePill = document.getElementById("sizePill");

  // ---------- 建立分頁 ----------
  Object.entries(TEMPLATES).forEach(([key, t]) => {
    const b = document.createElement("button");
    b.className = "tab" + (key === current ? " on" : "");
    b.type = "button";
    b.textContent = t.name;
    b.dataset.key = key;
    b.addEventListener("click", () => switchTemplate(key));
    tabsEl.appendChild(b);
  });

  function switchTemplate(key) {
    current = key;
    bgDataUrl = null;
    document.getElementById("bgUpload").value = "";
    [...tabsEl.children].forEach((c) => c.classList.toggle("on", c.dataset.key === key));
    buildForm();
    render();
  }

  // ---------- 依模板產生表單 ----------
  function buildForm() {
    const t = TEMPLATES[current];
    document.getElementById("tplTitle").textContent = t.name;
    document.getElementById("tplDesc").textContent = t.desc;
    form.innerHTML = "";
    Object.keys(data).forEach((k) => delete data[k]);

    t.fields.forEach((f) => {
      data[f.k] = f.v;
      const wrap = document.createElement("div");
      wrap.className = "field";
      const id = "f_" + f.k;
      const input = f.type === "textarea"
        ? `<textarea id="${id}">${escAttr(f.v)}</textarea>`
        : `<input id="${id}" type="text" value="${escAttr(f.v)}">`;
      wrap.innerHTML = `<label for="${id}">${f.label}</label>${input}`;
      form.appendChild(wrap);
      const el = wrap.querySelector("#" + CSS.escape(id));
      el.addEventListener("input", () => { data[f.k] = el.value; render(); });
    });
  }
  const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  // ---------- 渲染預覽 ----------
  function render() {
    const t = TEMPLATES[current];
    post.className = "post " + t.size + (t.extraClass ? " " + t.extraClass : "");
    post.innerHTML = t.render(data);

    // 套用背景圖
    const slot = post.querySelector("#bgSlot");
    if (slot && bgDataUrl) {
      const img = document.createElement("img");
      img.src = bgDataUrl;
      slot.appendChild(img);
    }

    // 尺寸資訊 + 縮放符合舞台
    const dims = { sq: [1080, 1080], pt: [1080, 1350], st: [1080, 1920] }[t.size];
    sizePill.innerHTML = `輸出尺寸 <b>${dims[0]} × ${dims[1]}</b> px`;
    fitScale(dims);
  }

  function fitScale(dims) {
    const stage = document.querySelector(".stage");
    const avail = Math.min(stage.clientWidth - 8, 560);
    const scale = Math.min(1, avail / dims[0]);
    scaler.style.transform = `scale(${scale})`;
    scaler.style.height = dims[1] * scale + "px";
    scaler.style.width = dims[0] * scale + "px";
  }
  window.addEventListener("resize", () => render());

  // ---------- 背景上傳 ----------
  document.getElementById("bgUpload").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { bgDataUrl = ev.target.result; render(); };
    reader.readAsDataURL(file);
  });

  // ---------- 重設 ----------
  document.getElementById("resetBtn").addEventListener("click", () => switchTemplate(current));

  // ---------- 匯出 PNG ----------
  document.getElementById("exportBtn").addEventListener("click", async () => {
    const btn = document.getElementById("exportBtn");
    const old = btn.textContent;
    btn.textContent = "匯出中…";
    btn.disabled = true;
    // 匯出時暫時取消縮放，擷取原始尺寸
    const prev = scaler.style.transform;
    scaler.style.transform = "scale(1)";
    try {
      const canvas = await html2canvas(post, {
        backgroundColor: "#111111",
        scale: 1,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `HCF_${current}_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      alert("匯出失敗：" + err.message);
    } finally {
      scaler.style.transform = prev;
      btn.textContent = old;
      btn.disabled = false;
    }
  });

  // ---------- 啟動 ----------
  buildForm();
  render();
})();
