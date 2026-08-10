// CONFIG
const FLASH_COLOR = "rgb(120, 255, 120)";   // green flash
const NORMAL_COLOR = "rgb(255, 255, 255)";  // white
const FLASH_INTERVAL = 500;                 // 0.5 seconds

let flashingIntervals = {}; // store intervals per card

// GET CARD BY RANK (1–50) → maps to card_0..card_49
function getCard(rank) {
    const index = rank - 1; // rank 1 -> card_0
    return document.querySelector(`.card.card_${index}`);
}

// START FLASHING (bottom user)
function startFlashing(rank) {
    if (rank === 50) return; // never flash rank 50

    const card = getCard(rank);
    if (!card) return;

    if (flashingIntervals[rank]) return; // already flashing

    let green = true;

    flashingIntervals[rank] = setInterval(() => {
        card.style.backgroundColor = green ? FLASH_COLOR : NORMAL_COLOR;
        card.style.borderColor = green ? FLASH_COLOR : NORMAL_COLOR;
        green = !green;
    }, FLASH_INTERVAL);
}

// STOP FLASHING
function stopFlashing(rank) {
    const card = getCard(rank);
    if (!card) return;

    if (!flashingIntervals[rank]) return;

    clearInterval(flashingIntervals[rank]);
    delete flashingIntervals[rank];

    card.style.backgroundColor = NORMAL_COLOR;
    card.style.borderColor = NORMAL_COLOR;
}

// MAIN CHECKER
function checkGaps() {
    for (let rank = 1; rank <= 49; rank++) {
        const topCard = getCard(rank);
        const bottomCard = getCard(rank + 1);

        if (!topCard || !bottomCard) continue;

        const topCount = Number(topCard.dataset.count);
        const bottomCount = Number(bottomCard.dataset.count);

        const gap = topCount - bottomCount;

        // bottom user is within 100 and not yet surpassed
        if (gap <= 100 && gap > 0) {
            startFlashing(rank + 1);
        }

        // bottom user surpassed top user → stop flashing
        if (bottomCount >= topCount) {
            stopFlashing(rank + 1);
        }

        // gap went above 100 again → stop flashing
        if (gap > 100) {
            stopFlashing(rank + 1);
        }
    }
}

// RUN CHECK EVERY SECOND
setInterval(checkGaps, 1000);
