
/* Livecountsedit — Channel Commands, Add Channel & Scaled Decay */
(function () {
  var old = document.getElementById("lc-command-panel");
  if (old) old.remove();

  var oldStyle = document.getElementById("lc-command-style");
  if (oldStyle) oldStyle.remove();

  if (window.lcGainDecayTimer) {
    clearInterval(window.lcGainDecayTimer);
    window.lcGainDecayTimer = null;
  }

  // Automatic decay settings
  var DECAY_INTERVAL_MS = 600000; // 10 minutes

  var style = document.createElement("style");
  style.id = "lc-command-style";
  style.textContent = `
    #lc-command-panel {
      position:fixed; right:20px; bottom:20px;
      width:310px; z-index:2147483647;
      background:#17191f; color:white;
      border:1px solid #454955; border-radius:12px;
      box-shadow:0 8px 30px #0008; overflow:hidden;
      font:14px Arial,sans-serif;
    }
    #lc-command-header {
      flex:1; display:flex; justify-content:space-between;
      padding:12px 14px; background:#242832; color:white;
      border:0; cursor:pointer; text-align:left;
    }
    #lc-command-body { padding:14px; }
    #lc-command-input {
      box-sizing:border-box; width:100%; padding:10px;
      margin:8px 0; background:#242832; color:white;
      border:1px solid #505665; border-radius:7px;
    }
    #lc-run {
      width:100%; padding:10px; background:#4b79ed;
      color:white; border:0; border-radius:7px;
      cursor:pointer; font-weight:bold;
    }
    #lc-command-status {
      margin-top:10px; color:#d0d5e2;
      white-space:pre-wrap; overflow-wrap:anywhere;
      font-size:12px;
    }
    #lc-command-close {
      background:#242832; color:#ddd; border:0;
      padding:0 12px; cursor:pointer; font-size:17px;
    }
  `;
  document.head.appendChild(style);

  var panel = document.createElement("div");
  panel.id = "lc-command-panel";
  panel.innerHTML = `
    <div style="display:flex">
      <button id="lc-command-header" type="button">
        <span>Channel Commands</span>
        <span id="lc-command-arrow">▼</span>
      </button>
      <button id="lc-command-close" type="button" title="Close">×</button>
    </div>
    <div id="lc-command-body">
      <div style="color:#b9bfce;font-size:12px">
        Name followed by + or - to change gains.
        <br><br>
        Add a channel: !add @handle
        <br>
        New channels start at 10M subscribers.
        <br>
        Automatic decay: every 10 minutes.
      </div>
      <input id="lc-command-input"
        placeholder="MrBeast+++ or !add @xdbygone">
      <button id="lc-run" type="button">Run Command</button>
      <div id="lc-command-status">Ready.</div>
    </div>
  `;
  document.body.appendChild(panel);

  var input = panel.querySelector("#lc-command-input");
  var status = panel.querySelector("#lc-command-status");
  var body = panel.querySelector("#lc-command-body");
  var arrow = panel.querySelector("#lc-command-arrow");

  panel.querySelector("#lc-command-header").addEventListener("click", function () {
    var collapsed = body.style.display === "none";
    body.style.display = collapsed ? "block" : "none";
    arrow.textContent = collapsed ? "▼" : "▲";
  });

  panel.querySelector("#lc-command-close").addEventListener("click", function () {
    panel.remove();

    var s = document.getElementById("lc-command-style");
    if (s) s.remove();

    if (window.lcGainDecayTimer) {
      clearInterval(window.lcGainDecayTimer);
      window.lcGainDecayTimer = null;
    }
  });

  function getChannelData() {
    if (typeof data === "undefined" || !Array.isArray(data.data)) {
      throw new Error("Could not access Livecountsedit channel data.");
    }
    return data.data;
  }

  function normalizeName(name) {
    return String(name || "")
      .trim()
      .replace(/^@/, "")
      .toLowerCase();
  }

  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function saveChanges() {
    if (typeof update === "function") {
      update(false);
    }

    if (typeof saveInBrowser === "function") {
      await saveInBrowser(COUNTER_THEME, false);
    } else {
      throw new Error("Browser save function was not found.");
    }
  }

  async function addChannel(rawName) {
    var channels = getChannelData();
    var name = rawName.trim();

    if (!name) {
      status.textContent = "Enter a channel name or YouTube handle.";
      return;
    }

    // Remove @ for the displayed channel name.
    var handle = name.replace(/^@/, "").trim();

    // Skip duplicates by channel name.
    var existing = channels.find(function (channel) {
      return normalizeName(channel.name) === normalizeName(handle);
    });

    if (existing) {
      status.textContent = 'Channel "' + existing.name + '" is already added!';
      return;
    }

    var minGain = randomInteger(-3, 10);
    var maxGain = randomInteger(minGain, 10);

    // A public avatar lookup service; no YouTube API key is used.
    var imageUrl =
      "https://unavatar.io/youtube/@" + encodeURIComponent(handle);

    // Generate a unique ID without relying on site-private functions.
    var id = (
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : "custom-" + Date.now() + "-" +
          Math.random().toString(36).slice(2)
    );

    var options = {
      id: id,
      name: handle,
      count: 10000000,
      image: imageUrl,
      min_gain: minGain,
      max_gain: maxGain,
      mean_gain: NaN,
      std_gain: NaN,
      mean_gain_value: 0,
      std_gain_value: 0,
      gain_type: "uniform",
      bg: "",
      banner: "/default_banner.png",
      gain_per: "updateInterval",
      gain_per_number: 1,
      custom_counter_data: {}
    };

    var newChannel;

    if (typeof Channel === "function") {
      newChannel = new Channel(options);
    } else {
      // Fallback if the Channel class is unavailable.
      newChannel = options;
    }

    channels.push(newChannel);

    try {
      await saveChanges();
    } catch (err) {
      // Keep the channel in memory, but report the save issue.
      status.textContent =
        "Channel was added, but saving failed: " + err.message;
      return;
    }

    status.textContent =
      "Channel added!\n" +
      "Name: " + handle +
      "\nSubscribers: 10,000,000" +
      "\nMin Gain: " + minGain +
      "\nMax Gain: " + maxGain +
      "\nLooking up profile picture...\n" +
      "Saved in browser.";

    // Check whether the avatar URL loads. Fall back to the site's default.
    var avatar = new Image();
    var settled = false;

    var timeout = setTimeout(function () {
      if (settled) return;
      settled = true;
      avatar.src = "";
      newChannel.image = "/default.png";
      saveChanges().catch(function (err) {
        console.error("Could not save fallback avatar:", err);
      });
      status.textContent +=
        "\nProfile picture lookup timed out; using the default image.";
    }, 12000);

    avatar.onload = function () {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      status.textContent =
        "Channel added!\n" +
        "Name: " + handle +
        "\nSubscribers: 10,000,000" +
        "\nMin Gain: " + minGain +
        "\nMax Gain: " + maxGain +
        "\nProfile picture loaded.\nSaved in browser.";
    };

    avatar.onerror = function () {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      newChannel.image = "/default.png";

      saveChanges().then(function () {
        status.textContent =
          "Channel added!\n" +
          "Name: " + handle +
          "\nSubscribers: 10,000,000" +
          "\nMin Gain: " + minGain +
          "\nMax Gain: " + maxGain +
          "\nProfile picture lookup failed; using the default image.";
      }).catch(function (err) {
        status.textContent =
          "Channel added, but avatar fallback could not be saved: " +
          err.message;
      });
    };

    avatar.src = imageUrl;
  }

  async function runCommand() {
    try {
      var command = input.value.trim();

      if (!command) {
        status.textContent = "Enter a command.";
        return;
      }

      // !add command
      var addMatch = command.match(/^!add\s+(.+)$/i);

      if (addMatch) {
        await addChannel(addMatch[1]);
        return;
      }

      var match = command.match(/^(.+?)(\++|-+)$/);

      if (!match) {
        status.textContent =
          "Use Name+++ to change gains, or !add @handle to add a channel.";
        return;
      }

      var name = match[1].trim();
      var symbols = match[2];
      var direction = symbols.charAt(0);
      var strength = symbols.length;

      var channels = getChannelData();
      var channel = channels.find(function (item) {
        return item &&
          normalizeName(item.name) === normalizeName(name);
      });

      if (!channel) {
        status.textContent = 'Channel not found: "' + name + '".';
        return;
      }

      var oldMin = Number(channel.min_gain);
      var oldMax = Number(channel.max_gain);

      if (!Number.isFinite(oldMin)) oldMin = 0;
      if (!Number.isFinite(oldMax)) oldMax = 0;

      // Random change: 1–200 per symbol.
      var amount = randomInteger(1, strength * 200);
      var change = direction === "+" ? amount : -amount;

      channel.min_gain = oldMin + change;
      channel.max_gain = oldMax + change;

      var minInput = document.getElementById("edit_min_gain");
      var maxInput = document.getElementById("edit_max_gain");
      var minCheck = document.getElementById("edit_min_gain_check");
      var maxCheck = document.getElementById("edit_max_gain_check");

      if (minInput) minInput.value = String(channel.min_gain);
      if (maxInput) maxInput.value = String(channel.max_gain);
      if (minCheck) minCheck.checked = true;
      if (maxCheck) maxCheck.checked = true;

      await saveChanges();

      status.textContent =
        channel.name +
        "\nCommand: " + symbols +
        "\nStrength: " + strength + " symbol(s)" +
        "\nRandom change: " + (change > 0 ? "+" : "") + change +
        "\nMin Gain: " + oldMin + " → " + channel.min_gain +
        "\nMax Gain: " + oldMax + " → " + channel.max_gain +
        "\nSaved in browser.";
    } catch (err) {
      status.textContent = "Error: " + err.message;
    }
  }

  // Scale decay based on each positive gain.
  function getDecayAmount(value) {
    if (value <= 10) return randomInteger(1, 2);
    if (value <= 50) return randomInteger(2, 5);
    if (value <= 100) return randomInteger(3, 8);
    if (value <= 500) return randomInteger(5, 15);
    return randomInteger(10, 25);
  }

  async function applyGradualDecay() {
    try {
      var channels = getChannelData();
      var changed = false;

      channels.forEach(function (channel) {
        if (!channel) return;

        var min = Number(channel.min_gain);
        var max = Number(channel.max_gain);

        if (!Number.isFinite(min)) min = 0;
        if (!Number.isFinite(max)) max = 0;

        var oldMin = min;
        var oldMax = max;

        // Positive gains decay, but never below zero.
        if (min > 0) {
          min = Math.max(0, min - getDecayAmount(min));
        }

        if (max > 0) {
          max = Math.max(0, max - getDecayAmount(max));
        }

        if (min !== oldMin || max !== oldMax) {
          channel.min_gain = min;
          channel.max_gain = max;
          changed = true;
        }
      });

      if (changed) {
        await saveChanges();
      }
    } catch (err) {
      console.error("Automatic gain decay error:", err);
    }
  }

  panel.querySelector("#lc-run").addEventListener("click", runCommand);

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") runCommand();
  });

  // Start decay while the page is open.
  window.lcGainDecayTimer = setInterval(
    applyGradualDecay,
    DECAY_INTERVAL_MS
  );
})();
