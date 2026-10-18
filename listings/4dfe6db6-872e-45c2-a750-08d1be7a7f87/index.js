(() => {
  if (window.__surpassInterval) clearInterval(window.__surpassInterval);

  if (window.__surpassResizeHandler) {
    window.removeEventListener("resize", window.__surpassResizeHandler);
    window.__surpassResizeHandler = null;
  }

  if (window.__surpassScrollHandler) {
    window.removeEventListener("scroll", window.__surpassScrollHandler);
    window.__surpassScrollHandler = null;
  }

  document.querySelectorAll("#roboto-card-monitor-style").forEach((element) => element.remove());
  document.querySelectorAll(".update-message").forEach((element) => element.remove());
  document.querySelectorAll(".surpass-dark-overlay").forEach((element) => element.remove());

  const CHECK_INTERVAL = 1000;
  const SURPASS_DELAY = 10;
  const REVEAL_DELAY = 150;
  const GAP_THRESHOLD = 1;
  const CARD_SELECTOR = ".card";

  let isActive = false;
  let surpassTimeout = null;
  let currentSurpassEvent = null;
  let previousValues = {};
  let previousRank = {};
  let updateMessage = null;
  let overlay = null;
  let lastTop50Id = null;

  const style = document.createElement("style");
  style.id = "roboto-card-monitor-style";

  style.textContent = `
    ${CARD_SELECTOR} {
      position: relative !important;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .update-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      color: #ffffff;
      padding: 0;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Roboto', sans-serif !important;
      font-weight: 600 !important;
      pointer-events: none;
      user-select: none;
      animation: update-message-fade-in 0.2s ease-out forwards;
    }

    @keyframes update-message-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .vertical-line-loader {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      height: 45px;
      margin-bottom: 22px;
      pointer-events: none;
      user-select: none;
    }

    .vertical-line-loader span {
      display: block;
      width: 6px;
      height: 35px;
      background: #ffffff;
      border-radius: 3px;
      animation: vertical-loader-bounce 1s infinite ease-in-out;
    }

    .vertical-line-loader span:nth-child(1) {
      animation-delay: 0s;
    }

    .vertical-line-loader span:nth-child(2) {
      animation-delay: 0.15s;
    }

    .vertical-line-loader span:nth-child(3) {
      animation-delay: 0.3s;
    }

    @keyframes vertical-loader-bounce {
      0%, 100% {
        transform: scaleY(0.45);
        opacity: 0.55;
      }

      50% {
        transform: scaleY(1);
        opacity: 1;
      }
    }

    .loading-title {
      font-size: 3.6rem;
      font-weight: 600 !important;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      color: #ffffff;
      font-family: 'Roboto', sans-serif !important;
      text-shadow: 0 3px 14px rgba(0, 0, 0, 0.95);
    }

    .loading-text {
      font-weight: 600 !important;
      text-align: center;
      font-size: 1.9rem;
      color: #ffffff;
      font-family: 'Roboto', sans-serif !important;
      text-shadow: 0 2px 11px rgba(0, 0, 0, 0.95);
      margin-bottom: 0;
    }

    ${CARD_SELECTOR}.card-hidden {
      background: transparent !important;
      background-color: transparent !important;
      border-color: transparent !important;
      box-shadow: none !important;
      outline: none !important;
      transform: none !important;
      will-change: auto !important;
      z-index: 5000 !important;
    }

    ${CARD_SELECTOR}.card-hidden > * {
      visibility: hidden !important;
      opacity: 0 !important;
    }

    ${CARD_SELECTOR}.card-hidden .num {
      visibility: visible !important;
      opacity: 1 !important;
      position: relative !important;
      z-index: 5001 !important;
    }

    ${CARD_SELECTOR}.card-hidden .num_text {
      visibility: visible !important;
      opacity: 1 !important;
      position: relative !important;
      z-index: 5002 !important;
    }

    ${CARD_SELECTOR}.card-updating {
      position: relative;
      z-index: 5000 !important;
    }

    ${CARD_SELECTOR}.pending-surpass {
      border-left: 4px solid gold;
    }
  `;

  document.head.appendChild(style);

  function getCardValue(card) {
    const numText = card.querySelector(".num_text");

    return numText
      ? parseInt(numText.textContent.replace(/,/g, ""), 10) || 0
      : 0;
  }

  function checkForSurpassingOrTop50() {
    if (isActive) return false;

    const cards = Array.from(document.querySelectorAll(CARD_SELECTOR));
    const currentValues = {};
    let hasChange = false;

    cards.forEach((card) => {
      const id = card.id;
      currentValues[id] = getCardValue(card);

      if (previousValues[id] !== currentValues[id]) {
        hasChange = true;
      }
    });

    if (Object.keys(previousValues).length === 0) {
      previousValues = currentValues;

      cards.forEach((card, index) => {
        previousRank[card.id] = index;
      });

      if (cards.length >= 50) {
        lastTop50Id = cards[49]?.id || null;
      }

      return false;
    }

    if (!hasChange) return false;

    const currentRanking = cards
      .map((card) => ({
        id: card.id,
        value: currentValues[card.id],
        element: card
      }))
      .sort((a, b) => b.value - a.value);

    let surpassEvent = null;

    currentRanking.forEach((card, newIndex) => {
      const oldIndex = previousRank[card.id];

      if (oldIndex !== undefined && oldIndex > newIndex) {
        const below = currentRanking[newIndex + 1];

        if (
          below &&
          card.value - below.value >= GAP_THRESHOLD
        ) {
          surpassEvent = {
            cards,
            timestamp: Date.now()
          };
        }
      }
    });

    let top50Changed = false;

    if (cards.length >= 50) {
      const top50Card = currentRanking[49];

      if (
        top50Card &&
        top50Card.id !== lastTop50Id
      ) {
        top50Changed = true;
        lastTop50Id = top50Card.id;
      }
    }

    previousValues = currentValues;

    currentRanking.forEach((card, index) => {
      previousRank[card.id] = index;
    });

    if (surpassEvent) {
      return surpassEvent;
    }

    if (top50Changed) {
      return {
        cards,
        timestamp: Date.now(),
        top50: true
      };
    }

    return false;
  }

  function createUpdateMessage() {
    if (updateMessage && updateMessage.parentElement) {
      updateMessage.remove();
    }

    updateMessage = document.createElement("div");
    updateMessage.className = "update-message";

    const loader = document.createElement("div");
    loader.className = "vertical-line-loader";

    loader.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    const title = document.createElement("div");
    title.className = "loading-title";
    title.textContent = "Please wait...";

    const text = document.createElement("div");
    text.className = "loading-text";
    text.textContent = "We are checking for changed information.";

    updateMessage.appendChild(loader);
    updateMessage.appendChild(title);
    updateMessage.appendChild(text);

    document.body.appendChild(updateMessage);
  }

  function removeUpdateMessage() {
    if (updateMessage && updateMessage.parentElement) {
      updateMessage.remove();
    }

    updateMessage = null;
  }

  function createOverlay() {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "surpass-dark-overlay";
      document.body.appendChild(overlay);
    }

    overlay.style.display = "none";
  }

  function removeOverlay() {
    if (!overlay) return;
    overlay.style.display = "none";
  }

  function executeUpdate(cards) {
    isActive = true;

    createUpdateMessage();

    cards.forEach((card) => {
      card.classList.add("card-hidden");
    });

    if (surpassTimeout) {
      clearTimeout(surpassTimeout);
      surpassTimeout = null;
    }

    setTimeout(() => {
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.remove("card-hidden");
          card.classList.add("card-updating");

          setTimeout(() => {
            card.classList.remove("card-updating");

            if (index === cards.length - 1) {
              setTimeout(() => {
                removeUpdateMessage();
                isActive = false;
              }, 300);
            }
          }, 300);
        }, index * REVEAL_DELAY);
      });
    }, 300);
  }

  function startMonitoring() {
    let lastSurpassTimestamp = 0;

    window.__surpassInterval = setInterval(() => {
      if (isActive) return;

      const newSurpassEvent = checkForSurpassingOrTop50();

      if (
        newSurpassEvent &&
        (
          !lastSurpassTimestamp ||
          Date.now() - lastSurpassTimestamp > 1000
        )
      ) {
        lastSurpassTimestamp = Date.now();

        if (surpassTimeout) {
          clearTimeout(surpassTimeout);
          surpassTimeout = null;
        }

        currentSurpassEvent = newSurpassEvent;

        currentSurpassEvent.cards.forEach((card) => {
          card.classList.add("pending-surpass");
        });

        surpassTimeout = setTimeout(() => {
          if (currentSurpassEvent) {
            currentSurpassEvent.cards.forEach((card) => {
              card.classList.remove("pending-surpass");
            });

            executeUpdate(currentSurpassEvent.cards);
            currentSurpassEvent = null;
          }
        }, SURPASS_DELAY);
      }
    }, CHECK_INTERVAL);
  }

  console.log("[Roboto Card Monitor] Started.");
  startMonitoring();
})();