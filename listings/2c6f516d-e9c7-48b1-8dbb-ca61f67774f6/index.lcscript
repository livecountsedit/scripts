(function fakeEstimator(global) {
  if (typeof data === "undefined" || !data || !Array.isArray(data.data)) {
    console.error("[estimator] Open lcedit.com/top50, wait for load, paste again.");
    return;
  }
  const STORE = "_fakeEst", PANEL_ID = "lceditFakeEstPanel", EDIT_ID = "lceditFakeEstEdit", STYLE_ID = "lceditFakeEstCSS";
  function st() {
    if (!data[STORE]) data[STORE] = { enabled: true, mode: "exact", percent: 10, amount: 5000, step: 0, applyTo: "all", direction: "positive" };
    if (!data[STORE].direction) data[STORE].direction = "positive";
    if (Number(data[STORE].step) === 100000) data[STORE].step = 0;
    if (data[STORE].step == null) data[STORE].step = 0;
    return data[STORE];
  }
  function byId(id) { return document.getElementById(id); }
  function ytStep(n) {
    var override = Number(st().step);
    if (override > 0) return override;
    n = Math.abs(Math.floor(Number(n) || 0));
    if (n >= 1e11) return 1e9;
    if (n >= 1e10) return 1e8;
    if (n >= 1e9) return 1e7;
    if (n >= 1e8) return 1e6;
    if (n >= 1e7) return 1e5;
    if (n >= 1e6) return 1e4;
    if (n >= 1e5) return 1e3;
    if (n >= 1e4) return 100;
    if (n >= 1e3) return 10;
    return 1;
  }
  function bandFloor(n) { var s = ytStep(n); return Math.floor(Number(n) / s) * s; }
  function bandCapFrom(n) { var s = ytStep(n); return bandFloor(n) + s - 1; }
  function snapPositive(n) { n = Number(n) || 0; var s = ytStep(n); return Math.ceil((n + 1) / s) * s; }
  function snapNegative(n) { return bandFloor(Number(n) || 0) - 1; }
  function targets() {
    var list = data.data || [];
    if (st().applyTo === "selected") {
      var picked = list.filter(function (ch) { return ch.estimator; });
      return picked.length ? picked : list;
    }
    return list;
  }
  function capOf(ch) { var n = Number(ch.apiMax); return isFinite(n) ? n : null; }
  function ensureCap(ch) {
    if (capOf(ch) == null && ch.count != null) ch.apiMax = bandCapFrom(ch.count);
    return capOf(ch);
  }
  function appliesTo(ch) { return st().applyTo !== "selected" || !!ch.estimator; }
  function destFrom(cur, cap) {
    var next = st().mode === "percent"
      ? cur - Math.abs(cur * (Number(st().percent) || 0) / 100)
      : cur - Math.abs(Number(st().amount) || 0);
    if (!(next < cap)) next = cap - Math.max(1, Math.min(Math.abs(Number(st().amount) || 1), ytStep(cap) / 10));
    if (next < bandFloor(cap)) next = bandFloor(cap);
    if (next < 0) next = 0;
    return next;
  }
  function pushBack(ch) {
    if (!appliesTo(ch)) return false;
    var cap = ensureCap(ch); if (cap == null) return false;
    var cur = Number(ch.count) || 0;
    if (cur < cap) { ch._estHeld = false; return false; }
    var now = Date.now();
    if (ch._estHeld && now < (ch._estCool || 0)) return false;
    ch.count = destFrom(cur, cap);
    ch._estHeld = true;
    ch._estCool = now + 8000;
    return true;
  }
  function tick() { if (st().enabled) (data.data || []).forEach(pushBack); }
  function applyUpdate(ch, direction) {
    var next = direction === "negative" ? snapNegative(ch.count) : snapPositive(ch.count);
    if (next < 0) next = 0;
    ch.count = next; ch.apiMax = bandCapFrom(next); ch.estimator = true;
    ch._estHeld = false; ch._estCool = 0;
    return next;
  }
  function findSection(titleRe) {
    var hs = document.querySelectorAll("h1,h2,h3");
    for (var i = 0; i < hs.length; i++) if (titleRe.test((hs[i].textContent || "").trim())) return hs[i].parentElement;
    return null;
  }
  function selectedChannel() {
    var sec = findSection(/^edit channel$/i) || byId("editSettings");
    var sel = sec && sec.querySelector("select"), list = data.data || [];
    if (sel) {
      var opt = sel.options[sel.selectedIndex], val = sel.value, txt = opt ? opt.textContent.trim() : "";
      var hit = list.find(function (ch) { return ch.name === val || ch.id === val || ch.name === txt || String(ch.id) === String(val); });
      if (hit) return hit;
    }
    return list[0] || null;
  }
  function syncCountField(ch) {
    var sec = findSection(/^edit channel$/i) || byId("editSettings"); if (!sec) return;
    var countInp = null;
    sec.querySelectorAll("input").forEach(function (inp) {
      var v = Number(inp.value);
      if (isFinite(v) && v > 1000 && v === Math.round(v)) { if (!countInp || v > Number(countInp.value)) countInp = inp; }
    });
    if (countInp) {
      countInp.value = Math.round(ch.count);
      countInp.dispatchEvent(new Event("input", { bubbles: true }));
      countInp.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
  function status(msg) {
    var el = byId("feEditStatus"); if (el) el.textContent = msg;
    console.log("[estimator]", msg);
  }
  function renderCaps() {
    var box = byId("feCaps"); if (!box) return;
    box.textContent = (data.data || []).map(function (ch) {
      var cap = capOf(ch);
      return (ch.name || "?") + "  " + Math.round(Number(ch.count) || 0) + " / cap " + (cap == null ? "—" : Math.round(cap));
    }).join("\n") || "No channels.";
  }
  function updateSelected() {
    var ch = selectedChannel(); if (!ch) { status("No channel selected."); return; }
    var dir = (byId("feEditDir") && byId("feEditDir").value) || st().direction;
    var next = applyUpdate(ch, dir); syncCountField(ch);
    try { if (typeof updateOdo === "function") updateOdo(); } catch (e) {}
    if (typeof saveInBrowser === "function") { try { saveInBrowser(COUNTER_THEME, false); } catch (e) {} }
    status((ch.name || "channel") + " → " + Math.round(next) + " (cap " + Math.round(ch.apiMax) + ")");
  }
  function updateAll(direction) {
    targets().forEach(function (ch) { applyUpdate(ch, direction || st().direction); });
    try { if (typeof updateOdo === "function") updateOdo(); } catch (e) {}
    if (typeof saveInBrowser === "function") { try { saveInBrowser(COUNTER_THEME, false); } catch (e) {} }
    status("Updated " + targets().length + " channel(s).");
  }
  function injectEditBlock() {
    var old = byId(EDIT_ID); if (old) old.remove();
    var sec = findSection(/^edit channel$/i) || byId("editSettings"); if (!sec) return;
    var box = document.createElement("div"); box.id = EDIT_ID; box.style.cssText = "margin:12px 0;color:#fff;";
    box.innerHTML =
      '<label style="color:#fff;display:flex;align-items:center;gap:8px;margin:6px 0;"><input type="checkbox" id="feEditOn"> Enable estimator on this channel</label>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:6px 0;">' +
      '<select id="feEditDir"><option value="positive">Positive</option><option value="negative">Negative</option></select>' +
      '<button type="button" id="feEditUpd">Update API</button></div><p id="feEditStatus" style="margin:4px 0;font-size:12px;color:#fff;"></p>';
    sec.appendChild(box);
    function pull() { var ch = selectedChannel(), tog = byId("feEditOn"); if (ch && tog) tog.checked = !!ch.estimator; }
    byId("feEditOn").addEventListener("change", function () {
      var ch = selectedChannel(); if (!ch) return;
      ch.estimator = this.checked;
      if (ch.estimator && capOf(ch) == null) ch.apiMax = bandCapFrom(ch.count);
    });
    byId("feEditDir").value = st().direction;
    byId("feEditDir").addEventListener("change", function () { st().direction = this.value; });
    byId("feEditUpd").addEventListener("click", updateSelected);
    var sel = sec.querySelector("select");
    if (sel && !sel._feHooked) { sel.addEventListener("change", pull); sel._feHooked = true; }
    pull();
  }
  function injectPanel() {
    var old = byId(PANEL_ID); if (old) old.remove();
    var oldCss = byId(STYLE_ID); if (oldCss) oldCss.remove();
    var css = document.createElement("style"); css.id = STYLE_ID;
    css.textContent = "#" + PANEL_ID + "{color:#fff;margin:0 0 12px;}#" + PANEL_ID + " label,#" + PANEL_ID + " p,#" + PANEL_ID + " h2{color:#fff!important;}#" + PANEL_ID + " input[type=number],#" + PANEL_ID + " select{color:#000;}#" + PANEL_ID + " .fe-row{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:6px 0;}#" + EDIT_ID + " select{color:#000;}";
    document.head.appendChild(css);
    var host = byId("technicalSettings") || findSection(/^technical settings$/i) || document.body;
    var wrap = document.createElement("div"); wrap.id = PANEL_ID;
    wrap.innerHTML =
      "<h2>Sub estimator</h2>" +
      '<p style="margin:0 0 10px;font-size:13px;max-width:54em;line-height:1.45;">How it works: YouTube public counts only show 3 digits, so each channel is locked under the next milestone — 1.00M–9.99M by 10,000, 10.0M–99.9M by 100,000, 100M–999M by 1,000,000. Gains still run, but the count cannot cross that line. Update API confirms a new official number. If the estimate hits the cap, it is pushed back once, then the odometer is left alone for 8s so it can roll.</p>' +
      '<label><input type="checkbox" id="feOn"> Enable estimator</label>' +
      '<div class="fe-row"><label>Apply to <select id="feApply"><option value="all">All channels</option><option value="selected">Only channels with estimator checked</option></select></label>' +
      '<label>Step override <input id="feStep" type="number" class="s-width" min="0" step="1"></label>' +
      '<label>If cap hit, push back <select id="feMode"><option value="exact">exact amount</option><option value="percent">percent</option></select></label>' +
      '<label>Percent <input id="fePct" type="number" class="xs-width" min="0" max="100" step="0.1"></label>' +
      '<label>Exact <input id="feAmt" type="number" class="s-width" min="0" step="1"></label></div>' +
      '<div class="fe-row"><label>Direction <select id="feDir"><option value="positive">Positive</option><option value="negative">Negative</option></select></label>' +
      '<button type="button" id="feUpdate">Update API (all / marked)</button><button type="button" id="feLock">Lock current bands</button></div>';
    var h2 = host.querySelector && host.querySelector("h2");
    if (h2 && h2.nextSibling) host.insertBefore(wrap, h2.nextSibling);
    else if (host !== document.body) host.insertBefore(wrap, host.firstChild);
    else document.body.appendChild(wrap);
    var s = st();
    byId("feOn").checked = !!s.enabled; byId("feApply").value = s.applyTo; byId("feStep").value = s.step;
    byId("feMode").value = s.mode; byId("fePct").value = s.percent; byId("feAmt").value = s.amount; byId("feDir").value = s.direction;
    function read() {
      s.enabled = byId("feOn").checked; s.applyTo = byId("feApply").value; s.step = parseFloat(byId("feStep").value) || 0;
      s.mode = byId("feMode").value; s.percent = parseFloat(byId("fePct").value) || 0; s.amount = parseFloat(byId("feAmt").value) || 0; s.direction = byId("feDir").value;
    }
    ["feOn","feApply","feStep","feMode","fePct","feAmt","feDir"].forEach(function (id) { byId(id).addEventListener("change", read); });
    byId("feUpdate").addEventListener("click", function () { read(); updateAll(s.direction); });
    byId("feLock").addEventListener("click", function () {
      targets().forEach(function (ch) { ch.apiMax = bandCapFrom(ch.count); ch.estimator = true; });
      status("Locked current YouTube 3-digit bands.");
    });
    injectEditBlock();
  }
  if (global.__feTick) clearInterval(global.__feTick);
  global.__feTick = setInterval(tick, 1000);
  injectPanel();
  global.estimator = { update: updateSelected, updateAll: updateAll };
})(window);