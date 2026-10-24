(function () {
    if (window.__quickSelectRanksLoaded) return;
    window.__quickSelectRanksLoaded = true;

    const KEY = 'qsr-enabled';
    let enabled = true;
    try { enabled = localStorage.getItem(KEY) !== '0'; } catch (e) { }

    const quick = document.getElementById('quickSelect');

    function applyRanks() {
        observer.disconnect();
        const sorted = data.data.filter(Boolean).slice().sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
        const ranks = {};
        sorted.forEach((c, i) => { ranks[c.id] = i + 1; });
        const channelOpts = [];
        for (const opt of quick.options) {
            const c = data.data.find(x => x && x.id === opt.value);
            if (!c) continue;
            channelOpts.push({ opt, rank: ranks[c.id] });
            const text = enabled ? '#' + ranks[c.id] + ' ' + c.name : c.name;
            if (opt.textContent !== text) opt.textContent = text;
        }
        if (enabled) {
            channelOpts.sort((a, b) => a.rank - b.rank);
            const current = [...quick.options].filter(o => channelOpts.some(x => x.opt === o));
            if (channelOpts.some((x, i) => x.opt !== current[i])) {
                const value = quick.value;
                for (const x of channelOpts) quick.appendChild(x.opt);
                quick.value = value;
            }
        }
        observer.observe(quick, { childList: true });
    }

    const observer = new MutationObserver(applyRanks);
    observer.observe(quick, { childList: true });

    const col = document.querySelector('#designSettings .half-column') || document.getElementById('designSettings');
    const label = document.createElement('label');
    label.innerHTML = 'Show rank in quick select: <input type="checkbox" id="qsr-toggle">';
    col.appendChild(label);
    if (typeof adjustColors === 'function') adjustColors();

    const toggle = label.querySelector('#qsr-toggle');
    toggle.checked = enabled;
    toggle.addEventListener('change', () => {
        enabled = toggle.checked;
        try { localStorage.setItem(KEY, enabled ? '1' : '0'); } catch (e) { }
        applyRanks();
    });

    applyRanks();
})();