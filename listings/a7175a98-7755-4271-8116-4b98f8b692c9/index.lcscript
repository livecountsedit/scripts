(function lceditLayoutScale(global) {
  if (typeof data === "undefined" || !data || !data.cardStyles) {
    console.error("[layout-scale] Open https://lcedit.com/top50/ and wait for the counter to finish loading, then paste again.");
    return;
  }

  const STORE = "_layoutScale";
  const PANEL_ID = "lceditLayoutScalePanel";
  const ZOOM_STYLE_ID = "lceditLayoutScaleZoom";
  const DEFAULT_OPTS = { cards: true, differences: true, container: false, header: false, fireMargins: false };

  function num(v, fallback) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }
  function scaled(value, factor, decimals) {
    const n = parseFloat(value);
    if (!Number.isFinite(n) || n === 0) return value;
    const out = Math.max(n * factor, n > 0 ? 0.01 : n * factor);
    const rounded = Number(out.toFixed(decimals));
    return typeof value === "string" ? String(rounded) : rounded;
  }
  function snapFactor(factor) {
    let f = parseFloat(factor);
    if (!Number.isFinite(f) || f <= 0) return 1;
    if (f > 3) f = f / 100;
    if (f < 0.1) f = 0.1;
    if (f > 3) f = 3;
    return Math.round(f * 10000) / 10000;
  }
  function readScalePercent() {
    const range = document.getElementById("lceditScaleRange");
    const box = document.getElementById("lceditScaleNum");
    const r = range ? parseFloat(range.value) : NaN;
    const n = box ? parseFloat(box.value) : NaN;
    if (Number.isFinite(r) && r > 0) return r;
    if (Number.isFinite(n) && n > 0) return n;
    return 100;
  }
  function captureBaseline(force) {
    if (!data[STORE]) data[STORE] = {};
    if (data[STORE].baseline && !force) return data[STORE].baseline;
    const cs = data.cardStyles || {}, ds = data.differenceStyles || {}, hs = data.headerSettings || {};
    data[STORE].baseline = {
      cardWidth: cs.cardWidth, cardHeight: cs.cardHeight, imageSize: cs.imageSize,
      nameSize: cs.nameSize, nameWidth: cs.nameWidth, countSize: cs.countSize, rankSize: cs.rankSize,
      containerHeight: cs.containerHeight, containerWidth: cs.containerWidth,
      boxSpacing: data.boxSpacing, rankingsWidth: data.rankingsWidth,
      differenceSize: ds.differenceSize, differenceImageSize: ds.imageSize,
      headerHeight: hs.headerHeight, sectionGap: hs.sectionGap, footerHeight: hs.footerHeight, footerGap: hs.footerGap,
      headerItems: (hs.items || []).map(function (item) {
        const a = item.attributes || {};
        return { name: item.name, fontSize: a.fontSize, imageSize: a.imageSize, size: a.size, width: a.width, height: a.height };
      }),
      fireMargins: ((data.fireIcons || {}).created || []).map(function (icon) {
        return { name: icon.name, margin: icon.margin, marginLeft: icon.marginLeft };
      })
    };
    if (data[STORE].factor == null) data[STORE].factor = 1;
    if (!data[STORE].opts) data[STORE].opts = Object.assign({}, DEFAULT_OPTS);
    return data[STORE].baseline;
  }
  function mergeOpts(extra) {
    return Object.assign({}, DEFAULT_OPTS, (data[STORE] && data[STORE].opts) || {}, extra || {});
  }
  function applyHeader(b, factor, opts) {
    if (!opts.header || !data.headerSettings) return;
    data.headerSettings.headerHeight = scaled(b.headerHeight, factor, 1);
    data.headerSettings.sectionGap = scaled(b.sectionGap, factor, 1);
    data.headerSettings.footerHeight = scaled(b.footerHeight, factor, 1);
    data.headerSettings.footerGap = scaled(b.footerGap, factor, 1);
    (data.headerSettings.items || []).forEach(function (item) {
      const snap = (b.headerItems || []).find(function (h) { return h.name === item.name; }) || {};
      const a = item.attributes || (item.attributes = {});
      ["fontSize", "imageSize", "size", "width", "height"].forEach(function (key) {
        if (snap[key] != null && snap[key] !== "") a[key] = scaled(snap[key], factor, 1);
      });
    });
    if (typeof loadTopSettings === "function") { try { loadTopSettings(); } catch (e) {} }
    if (typeof loadHeader === "function") { try { loadHeader(); } catch (e) {} }
  }
  function applyFireMargins(b, factor, opts) {
    if (!opts.fireMargins || !data.fireIcons || !data.fireIcons.created) return;
    data.fireIcons.created.forEach(function (icon) {
      const snap = (b.fireMargins || []).find(function (f) { return f.name === icon.name; });
      if (!snap) return;
      if (snap.margin !== "" && snap.margin != null) icon.margin = scaled(snap.margin, factor, 1);
      if (snap.marginLeft !== "" && snap.marginLeft != null) icon.marginLeft = scaled(snap.marginLeft, factor, 1);
    });
  }
  function writeNativeInputs(opts) {
    const map = [];
    if (opts.cards) map.push(["cardWidth", data.cardStyles.cardWidth], ["cardHeight", data.cardStyles.cardHeight], ["imageSize", data.cardStyles.imageSize], ["nameSize", data.cardStyles.nameSize], ["nameWidth", data.cardStyles.nameWidth], ["countSize", data.cardStyles.countSize], ["rankSize", data.cardStyles.rankSize], ["boxSpacing", data.boxSpacing], ["rankingsWidth", data.rankingsWidth]);
    if (opts.container) map.push(["containerHeight", data.cardStyles.containerHeight], ["containerWidth", data.cardStyles.containerWidth]);
    if (opts.differences && data.differenceStyles) map.push(["differenceSize", data.differenceStyles.differenceSize], ["differenceImageSize", data.differenceStyles.imageSize]);
    map.forEach(function (pair) {
      const el = document.getElementById(pair[0]);
      if (el && pair[1] != null) el.value = pair[1];
    });
  }
  function writeSizeCss(opts) {
    const cs = data.cardStyles || {};
    const cardEl = document.getElementById("cardStyles");
    if (cardEl && opts.cards) {
      cardEl.innerText = ".main .name{font-size:" + cs.nameSize + "vw;line-height:" + (parseFloat(cs.nameSize) * 1.15) + "vw;max-width:" + cs.nameWidth + "vw;}.main .count{font-size:" + cs.countSize + "vw;}.main .image{height:" + cs.imageSize + "vw;width:" + cs.imageSize + "vw;}.card{height:" + cs.cardHeight + "vw;width:" + cs.cardWidth + "vw;}";
    }
    const rankEl = document.getElementById("rankSizeStyles");
    if (rankEl && opts.cards) rankEl.innerText = ".num_text{font-size:" + cs.rankSize + "px;}.num{width:" + data.rankingsWidth + "px;}";
    const main = document.getElementById("main");
    if (main && opts.container) {
      main.style.height = cs.containerHeight + "vh";
      main.style.width = cs.containerWidth + "vw";
    }
    if (main && opts.cards) {
      Array.from(main.children).forEach(function (child) {
        if (data.theme && String(data.theme).includes("H")) child.style.margin = data.boxSpacing + "vw";
        else Array.from(child.children).forEach(function (card) { card.style.margin = data.boxSpacing + "vw"; });
      });
    }
  }
  function applyScale(factor, extraOpts) {
    const f = snapFactor(factor);
    captureBaseline(false);
    const b = data[STORE].baseline;
    const opts = mergeOpts(extraOpts);
    data[STORE].opts = opts;
    data[STORE].factor = f;
    if (opts.cards) {
      data.cardStyles.cardWidth = scaled(b.cardWidth, f, 3);
      data.cardStyles.cardHeight = scaled(b.cardHeight, f, 3);
      data.cardStyles.imageSize = scaled(b.imageSize, f, 3);
      data.cardStyles.nameSize = scaled(b.nameSize, f, 3);
      data.cardStyles.nameWidth = scaled(b.nameWidth, f, 3);
      data.cardStyles.countSize = scaled(b.countSize, f, 3);
      data.cardStyles.rankSize = scaled(b.rankSize, f, 2);
      data.boxSpacing = scaled(b.boxSpacing, f, 3);
      data.rankingsWidth = scaled(b.rankingsWidth, f, 2);
    }
    if (opts.container) {
      data.cardStyles.containerHeight = scaled(b.containerHeight, f, 2);
      data.cardStyles.containerWidth = scaled(b.containerWidth, f, 2);
    }
    if (opts.differences && data.differenceStyles) {
      data.differenceStyles.differenceSize = scaled(b.differenceSize, f, 3);
      data.differenceStyles.imageSize = scaled(b.differenceImageSize, f, 2);
    }
    applyHeader(b, f, opts);
    applyFireMargins(b, f, opts);
    writeNativeInputs(opts);
    writeSizeCss(opts);
    try { if (typeof fix === "function") fix(); } catch (err) { console.warn("[layout-scale] fix() threw; sizes were still written", err); }
    try { if (typeof iso !== "undefined" && iso && typeof iso.layout === "function") iso.layout(); } catch (e) {}
    if (typeof saveInBrowser === "function") { try { saveInBrowser(COUNTER_THEME, false); } catch (e) {} }
    syncPanel();
    return f;
  }
  function setZoom(factor) {
    let f = factor == null ? 1 : Number(factor);
    if (!Number.isFinite(f) || f <= 0) f = 1;
    if (f > 3) f = f / 100;
    let style = document.getElementById(ZOOM_STYLE_ID);
    if (f === 1) { if (style) style.remove(); return 1; }
    if (!style) { style = document.createElement("style"); style.id = ZOOM_STYLE_ID; document.head.appendChild(style); }
    style.textContent = "#main{zoom:" + f + ";transform-origin:top left;}@supports not (zoom:1){#main{transform:scale(" + f + ");transform-origin:top left;}}";
    return f;
  }
  function injectPanel() {
    const old = document.getElementById(PANEL_ID);
    if (old) old.remove();
    const host = document.getElementById("designSettings");
    if (!host) return;
    const oldCss = document.getElementById("lceditLayoutScaleCSS");
    if (oldCss) oldCss.remove();
    const css = document.createElement("style");
    css.id = "lceditLayoutScaleCSS";
    css.textContent =
      "#" + PANEL_ID + "{color:#fff !important;margin:0 0 12px;padding:0;border:0;background:transparent;}" +
      "#" + PANEL_ID + " .lcedit-scale-title,#" + PANEL_ID + " .lcedit-scale-help,#" + PANEL_ID + " #lceditScaleStatus,#" + PANEL_ID + " label,#" + PANEL_ID + " span{color:#fff !important;}" +
      "#" + PANEL_ID + " .lcedit-scale-title{margin:0 0 6px;font-size:15px;font-weight:700;}" +
      "#" + PANEL_ID + " .lcedit-scale-help,#" + PANEL_ID + " #lceditScaleStatus{margin:0 0 8px;font-size:13px;}" +
      "#" + PANEL_ID + " input[type=number]{color:#000 !important;}";
    document.head.appendChild(css);
    const wrap = document.createElement("div");
    wrap.id = PANEL_ID;
    wrap.innerHTML =
      '<div class="lcedit-scale-title">Layout Scale</div>' +
      '<div class="lcedit-scale-help">Scales card / rank / spacing sizes together from a saved 100% baseline.</div>' +
      '<label class="setting-group-container">Scale ' +
      '<span class="no-wrap" style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
      '<input id="lceditScaleRange" type="range" min="10" max="150" step="1" style="width:220px;">' +
      '<input id="lceditScaleNum" type="number" min="10" max="300" step="1" class="xs-width">' +
      '<span>%</span></span></label>' +
      '<label><input type="checkbox" id="lceditScaleCards"> Cards + ranks + spacing</label>' +
      '<label><input type="checkbox" id="lceditScaleDiffs"> Differences</label>' +
      '<label><input type="checkbox" id="lceditScaleContainer"> Container (vh/vw)</label>' +
      '<label><input type="checkbox" id="lceditScaleHeader"> Header / footer</label>' +
      '<div style="margin:6px 0 4px;">' +
      '<button type="button" id="lceditScaleApply">Apply</button>' +
      '<button type="button" id="lceditScaleReset">Reset to 100%</button>' +
      '<button type="button" id="lceditScaleBaseline">Set current as 100%</button>' +
      '</div><div id="lceditScaleStatus" class="lcedit-scale-help"></div>';
    const heading = host.querySelector("h2");
    if (heading && heading.nextSibling) host.insertBefore(wrap, heading.nextSibling);
    else host.insertBefore(wrap, host.firstChild);
    function readOptsFromPanel() {
      return {
        cards: document.getElementById("lceditScaleCards").checked,
        differences: document.getElementById("lceditScaleDiffs").checked,
        container: document.getElementById("lceditScaleContainer").checked,
        header: document.getElementById("lceditScaleHeader").checked
      };
    }
    var liveTimer = null;
    function applyFromControls(immediate) {
      var run = function () { applyScale(readScalePercent(), readOptsFromPanel()); };
      if (immediate) return run();
      clearTimeout(liveTimer);
      liveTimer = setTimeout(run, 40);
    }
    document.getElementById("lceditScaleRange").addEventListener("input", function () {
      document.getElementById("lceditScaleNum").value = this.value;
      applyFromControls(false);
    });
    document.getElementById("lceditScaleRange").addEventListener("change", function () {
      document.getElementById("lceditScaleNum").value = this.value;
      applyFromControls(true);
    });
    document.getElementById("lceditScaleNum").addEventListener("input", function () {
      var v = parseFloat(this.value);
      if (Number.isFinite(v)) document.getElementById("lceditScaleRange").value = String(Math.max(10, Math.min(150, v)));
    });
    document.getElementById("lceditScaleNum").addEventListener("change", function () { applyFromControls(true); });
    document.getElementById("lceditScaleNum").addEventListener("keydown", function (e) { if (e.key === "Enter") applyFromControls(true); });
    document.getElementById("lceditScaleApply").addEventListener("click", function () { applyFromControls(true); });
    document.getElementById("lceditScaleReset").addEventListener("click", function () {
      document.getElementById("lceditScaleRange").value = "100";
      document.getElementById("lceditScaleNum").value = "100";
      applyScale(1, readOptsFromPanel());
    });
    document.getElementById("lceditScaleBaseline").addEventListener("click", function () {
      captureBaseline(true);
      data[STORE].factor = 1;
      if (typeof saveInBrowser === "function") saveInBrowser(COUNTER_THEME, false);
      syncPanel();
    });
    syncPanel();
  }
  function syncPanel() {
    if (!document.getElementById(PANEL_ID)) return;
    captureBaseline(false);
    const pct = Math.round(num(data[STORE].factor, 1) * 100);
    const opts = mergeOpts();
    document.getElementById("lceditScaleRange").value = String(pct);
    document.getElementById("lceditScaleNum").value = String(pct);
    document.getElementById("lceditScaleCards").checked = !!opts.cards;
    document.getElementById("lceditScaleDiffs").checked = !!opts.differences;
    document.getElementById("lceditScaleContainer").checked = !!opts.container;
    document.getElementById("lceditScaleHeader").checked = !!opts.header;
    document.getElementById("lceditScaleStatus").textContent = "Applied " + pct + "%";
  }

  captureBaseline(false);
  injectPanel();
  function scaleTop50(factor, opts) { return applyScale(factor, opts); }
  scaleTop50.reset = function (opts) { return applyScale(1, opts); };
  scaleTop50.setBaseline = function () {
    captureBaseline(true);
    data[STORE].factor = 1;
    if (typeof saveInBrowser === "function") saveInBrowser(COUNTER_THEME, false);
    syncPanel();
    return data[STORE].baseline;
  };
  scaleTop50.zoom = setZoom;
  global.scaleTop50 = scaleTop50;
  console.log("[layout-scale] ready. Drag the slider — 30% applies while you drag.");
})(window);