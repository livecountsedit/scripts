// 1. Clean up any existing tracker
if (window.fastestGainerTracker) {
  window.fastestGainerTracker.stopTracking();
  delete window.fastestGainerTracker;
}

// 2. Main tracker implementation
window.fastestGainerTracker = {
  previousCounts: {},
  currentLeader: null,
  updateInterval: null,
  isTracking: false,
  protectedContainer: null,
  displayObserver: null,
  currentDisplayHTML: '',
  fireIcon1Url: 'https://i.ibb.co/JSJh6Hb/fire-icon.png', // 1.0-1.49/sec
  fireIcon2Url: 'https://i.ibb.co/W1Lm87x/fire-icon-1.png', // 1.5-1.99/sec
  fireIcon3Url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDJnOWUxMGplNWY4M2Z0dDR6bTJtZXA2MWo3OTc1ZHdxdDc4OWJqciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eTHaHFKLWbghFsVRkI/giphy.gif', // 2.0-3.49/sec
  fireIcon4Url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnczNngwemY0eDlhYmZ1YXZraTQwYW0yZW55bHpxMW1lcmhyN3V3cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pFhaD6jk2uEtEhCrRR/giphy.gif', // 3.5-4.99/sec
  fireIcon5Url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXYxYTdmN3UwdmRzM21vZDdpNDR6Z2Zod2ZoN2hpZGM2dnVyc2x2MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eNRnYTkrXFhXAaqHzm/giphy.gif', // 5.0-9.99/sec
  fireIcon6Url: 'https://media3.giphy.com/media/8FIHivQ5aUABV5bzkK/giphy.gif', // 10.0-19.99/sec
  fireIcon7Url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTBtYzY2OXMwYzZrd3czeW83dWRlaGlxdXJnYTg3Z3RrZ2RmMzM5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pWr2FSBHZIa57w2MXJ/giphy.gif', // 20.0-34.99/sec
  fireIcon8Url: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHNlcTczZTNjYzA5ZjV4NWlxd2xzODd6dmdzcWMyeWdtaTNwbXBqOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0ehwzzlbEobgvUfaMu/giphy.gif', // 35.0-49.99/sec
  fireIcon9Url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm53eGE2YXo0amNkZGlzdG02ZGUzMjliZ21uZHJlN2M2MGNtdHQ2aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/D6JJUTW81Tms7zJiqC/giphy.gif', // 50.0-69.99/sec
  fireIcon10Url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmYzOGF5bzl5YnRtNmdtdjBqNTcwYXZnc2JydWNlbm9hYzcyN2tnbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pid94cf5XarlnKRFIV/giphy.gif', // 70.0-99.99/sec
  fireIcon11Url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2NzeWgzem4yaXB2bGpidW56eXViY2Rrd3drcHVwZnJ2eGZ2bmc5NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EGfndcuLN2G0X0q5UP/giphy.gif', // 100.0+/sec
  minThreshold: 1.0,
  midThreshold: 1.5,
  highThreshold: 2.0,
  ultraThreshold: 3.5,
  extremeThreshold: 5.0,
  insaneThreshold: 10.0,
  godlikeThreshold: 20.0,
  legendaryThreshold: 35.0,
  epicThreshold: 50.0,
  mythicalThreshold: 70.0,
  divineThreshold: 100.0,
  settings: {
    fireIconSize: 20,
    textSize: 10,
    profileImgSize: 30
  },

  // Start tracking
  startTracking: function() {
    if (this.isTracking) return;

    console.log('🚀 Starting permanent 2-second tracker...');
    this.isTracking = true;

    this.setupProtectedDisplay();
    this.updateCounts(true);

    this.updateInterval = setInterval(() => {
      try {
        this.updateCounts();
      } catch (error) {
        console.error('Update error:', error);
        this.recoverTracker();
      }
    }, 2000);
  },

  // Stop tracking
  stopTracking: function() {
    clearInterval(this.updateInterval);
    if (this.displayObserver) {
      this.displayObserver.disconnect();
    }
    this.isTracking = false;
    console.log('🛑 Tracker stopped');
  },

  // Create protected display area
  setupProtectedDisplay: function() {
    const oldContainer = document.querySelector('.fastest-gainer-protected');
    if (oldContainer) oldContainer.remove();

    this.protectedContainer = document.createElement('div');
    this.protectedContainer.className = 'fastest-gainer-protected';
    this.protectedContainer.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 9999;
      padding: 8px;
      background-image: url('https://i.ibb.co/67gmgQ1d/background-image.png');
      background-size: cover;
      background-repeat: no-repeat;
      color: white;
      border-radius: 4px;
      font-family: Arial, sans-serif;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;

    document.body.prepend(this.protectedContainer);
    this.setupDisplayProtection();
  },

  // Protect our display
  setupDisplayProtection: function() {
    if (this.displayObserver) {
      this.displayObserver.disconnect();
    }

    this.displayObserver = new MutationObserver((mutations) => {
      if (this.protectedContainer && this.protectedContainer.innerHTML !== this.currentDisplayHTML) {
        this.protectedContainer.innerHTML = this.currentDisplayHTML;
      }
    });

    this.displayObserver.observe(this.protectedContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });
  },

  // Update counts
  updateCounts: function(forceUpdate) {
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) {
      console.warn('No cards found');
      this.recoverTracker();
      return;
    }

    let maxGain = 0;
    let newLeader = null;
    const now = Date.now();

    cards.forEach(card => {
      try {
        const id = card.id;
        const currentCount = parseInt(card.getAttribute('data-count')) || 0;

        if (this.previousCounts[id]) {
          const timeDiff = (now - this.previousCounts[id].timestamp) / 1000;
          const countDiff = currentCount - this.previousCounts[id].count;
          const gainRate = timeDiff > 0 ? countDiff / timeDiff : 0;

          if (gainRate > maxGain) {
            maxGain = gainRate;
            newLeader = {
              element: card,
              rate: gainRate,
              count: currentCount,
              timestamp: now,
              id: id
            };
          }
        }

        this.previousCounts[id] = { count: currentCount, timestamp: now };
      } catch (e) {
        console.warn('Error processing card:', e);
      }
    });

    const shouldUpdate = forceUpdate || 
      !this.currentLeader || 
      (newLeader && newLeader.rate > this.currentLeader.rate) ||
      (now - (this.currentLeader?.timestamp || 0)) > 10000;

    if (shouldUpdate && (newLeader || this.currentLeader)) {
      this.currentLeader = newLeader || this.currentLeader;
      this.updateDisplay();
    }
  },

  // Update display with appropriate fire icon
  updateDisplay: function() {
    if (!this.protectedContainer || !this.currentLeader) return;

    const leader = this.currentLeader;
    const channelName = leader.element.querySelector('.name')?.textContent || 'Unknown';
    const formattedCount = leader.count.toLocaleString();
    const gainRate = Math.round(leader.rate * 100) / 100;
    const imgSrc = leader.element.querySelector('img')?.src || '';
    const showFireIcon = gainRate >= this.minThreshold;

    // Determine which fire icon to show based on gain rate
    let fireIconUrl = '';
    if (gainRate >= this.divineThreshold) {
      fireIconUrl = this.fireIcon11Url;
    } else if (gainRate >= this.mythicalThreshold) {
      fireIconUrl = this.fireIcon10Url;
    } else if (gainRate >= this.epicThreshold) {
      fireIconUrl = this.fireIcon9Url;
    } else if (gainRate >= this.legendaryThreshold) {
      fireIconUrl = this.fireIcon8Url;
    } else if (gainRate >= this.godlikeThreshold) {
      fireIconUrl = this.fireIcon7Url;
    } else if (gainRate >= this.insaneThreshold) {
      fireIconUrl = this.fireIcon6Url;
    } else if (gainRate >= this.extremeThreshold) {
      fireIconUrl = this.fireIcon5Url;
    } else if (gainRate >= this.ultraThreshold) {
      fireIconUrl = this.fireIcon4Url;
    } else if (gainRate >= this.highThreshold) {
      fireIconUrl = this.fireIcon3Url;
    } else if (gainRate >= this.midThreshold) {
      fireIconUrl = this.fireIcon2Url;
    } else if (gainRate >= this.minThreshold) {
      fireIconUrl = this.fireIcon1Url;
    }

    this.currentDisplayHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        ${showFireIcon ? `
          <div style="position: relative;">
            <img src="${fireIconUrl}" style="width: ${this.settings.fireIconSize}px; height: ${this.settings.fireIconSize}px; object-fit: contain;" alt="Fire">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
              font-size: ${this.settings.textSize}px; font-weight: bold; color: white; text-shadow: 0 0 2px black;
              width: 100%; text-align: center;">
              FASTEST CHANNEL
            </div>
          </div>
        ` : ''}
        <img src="${imgSrc}" style="width: ${this.settings.profileImgSize}px; height: ${this.settings.profileImgSize}px; border-radius: 50%;">
        <div>
          <div style="font-weight: bold; font-size: 14px;">${channelName}</div>
          <div style="font-size: 12px;">${formattedCount} (+${gainRate}/sec)</div>
        </div>
      </div>
    `;

    this.protectedContainer.innerHTML = this.currentDisplayHTML;
    console.log(`🏆 Updated: ${channelName} (+${gainRate}/sec)`);
  },

  // Recover from errors
  recoverTracker: function() {
    console.log('🔄 Recovering tracker...');
    this.stopTracking();
    this.startTracking();
  },

  // Customization functions
  setSizes: function(fireIconSize, textSize, profileImgSize) {
    if (fireIconSize !== undefined) this.settings.fireIconSize = fireIconSize;
    if (textSize !== undefined) this.settings.textSize = textSize;
    if (profileImgSize !== undefined) this.settings.profileImgSize = profileImgSize;
    if (this.isTracking) this.updateDisplay();
  },

  setThresholds: function(min, mid, high, ultra, extreme, insane, godlike, legendary, epic, mythical, divine) {
    this.minThreshold = min || this.minThreshold;
    this.midThreshold = mid || this.midThreshold;
    this.highThreshold = high || this.highThreshold;
    this.ultraThreshold = ultra || this.ultraThreshold;
    this.extremeThreshold = extreme || this.extremeThreshold;
    this.insaneThreshold = insane || this.insaneThreshold;
    this.godlikeThreshold = godlike || this.godlikeThreshold;
    this.legendaryThreshold = legendary || this.legendaryThreshold;
    this.epicThreshold = epic || this.epicThreshold;
    this.mythicalThreshold = mythical || this.mythicalThreshold;
    this.divineThreshold = divine || this.divineThreshold;
    if (this.isTracking) this.updateDisplay();
  }
};

// 3. Auto-start with recovery
function startTracker() {
  try {
    if (!window.fastestGainerTracker?.isTracking) {
      window.fastestGainerTracker.startTracking();
    }
  } catch (e) {
    console.error('Start failed:', e);
    setTimeout(startTracker, 3000);
  }
}

// 4. Health check every 30 seconds
setInterval(() => {
  if (!window.fastestGainerTracker?.isTracking) {
    console.log('⚕️ Health check - restarting...');
    startTracker();
  }
}, 30000);

// Start immediately
startTracker();

// 5. Global controls
window.startTracker = startTracker;
window.stopTracker = function() {
  if (window.fastestGainerTracker) {
    window.fastestGainerTracker.stopTracking();
  }
};

// 6. Customization controls
window.setSizes = function(fireIconSize, textSize, profileImgSize) {
  if (window.fastestGainerTracker) {
    window.fastestGainerTracker.setSizes(fireIconSize, textSize, profileImgSize);
  }
};

window.setThresholds = function(min, mid, high, ultra, extreme, insane, godlike, legendary, epic, mythical, divine) {
  if (window.fastestGainerTracker) {
    window.fastestGainerTracker.setThresholds(min, mid, high, ultra, extreme, insane, godlike, legendary, epic, mythical, divine);
  }
};
