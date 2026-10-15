(function () {
  if (window.__fireLockStop) window.__fireLockStop();

  var origCalc = calculateFires;
  var origApply = applyFire;
  var rankLock = [];

  function snapshot() {
    rankLock = [];
    var limit = data.max || data.data.length;
    for (var i = 0; i < limit; i++) {
      var ch = data.data[i];
      if (ch && fires.has(ch.id)) rankLock[i] = fires.get(ch.id);
      else rankLock[i] = null;
    }
  }

  calculateFires = function () {
    origCalc();
    snapshot();
  };

  applyFire = function (card, i, enable) {
    if (!enable || !data.fireIcons.enabled || !data.data[i]) {
      return origApply(card, i, enable);
    }
    var ch = data.data[i];
    var locked = rankLock[i];
    var had = fires.has(ch.id);
    var real = fires.get(ch.id);
    if (locked == null) fires.delete(ch.id);
    else fires.set(ch.id, locked);
    origApply(card, i, enable);
    if (had) fires.set(ch.id, real);
    else fires.delete(ch.id);
  };

  origCalc();
  snapshot();

  window.__fireLockStop = function () {
    calculateFires = origCalc;
    applyFire = origApply;
  };
})();