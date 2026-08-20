(function createSetCountGUI() {
    if (document.getElementById("setCountGUI") || document.getElementById("setCountToggle")) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "setCountToggle";
    toggleBtn.textContent = "Show Set Count";
    toggleBtn.style = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 999999;
        padding: 6px 10px;
        background: black;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: Arial;
    `;
    document.body.appendChild(toggleBtn);

    const gui = document.createElement("div");
    gui.id = "setCountGUI";
    gui.style = `
        position: fixed;
        top: 60px;
        left: 20px;
        background: white;
        padding: 12px;
        border: 2px solid black;
        border-radius: 8px;
        z-index: 999998;
        font-family: Arial;
        width: 240px;
        box-shadow: 0 0 10px rgba(0,0,0,0.25);
        display: none;
        cursor: default;
    `;

    gui.innerHTML = `
        <div id="dragHandle" style="cursor: move; padding: 4px; background: #eee; border-radius: 4px; margin-bottom: 8px;">
            <b style="font-size: 16px;">Set Count</b>
        </div>

        <label style="font-size: 13px;">Select Channel:</label><br>
        <select id="sc_dropdown" style="width: 100%; padding: 4px;"></select><br><br>

        <label style="font-size: 13px;">New Count:</label><br>
        <input id="sc_value" type="number" style="width: 100%; padding: 4px;"><br><br>

        <button id="sc_apply" style="
            width: 100%;
            padding: 6px;
            background: black;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        ">Apply</button>
    `;

    document.body.appendChild(gui);

    function populateDropdown() {
        const dropdown = document.getElementById("sc_dropdown");
        dropdown.innerHTML = "";
        if (!data || !data.data) return;
        data.data.forEach((ch) => {
            const opt = document.createElement("option");
            opt.value = ch.id;
            opt.textContent = ch.name;
            dropdown.appendChild(opt);
        });
    }

    populateDropdown();

    document.getElementById("sc_apply").onclick = () => {
        const selectedId = document.getElementById("sc_dropdown").value;
        const newValue = Number(document.getElementById("sc_value").value);

        if (!data || !data.data) {
            alert("Data not loaded.");
            return;
        }

        const channel = data.data.find(ch => ch.id === selectedId);
        if (!channel) {
            alert("Channel not found.");
            return;
        }

        channel.count = newValue;

        const card = document.getElementById(selectedId);
        if (card) {
            card.dataset.count = newValue;

            const numText = card.querySelector(".num_text");
            if (numText) numText.textContent = newValue.toLocaleString();

            const odo = card.querySelector(".odometer");
            if (odo && odo.innerText !== undefined) {
                odo.innerText = newValue;
            }
        }

        console.log("Set channel", channel.name, "to", newValue);
    };

    toggleBtn.onclick = () => {
        if (gui.style.display === "none") {
            gui.style.display = "block";
            toggleBtn.textContent = "Hide Set Count";
        } else {
            gui.style.display = "none";
            toggleBtn.textContent = "Show Set Count";
        }
    };

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const dragHandle = gui.querySelector("#dragHandle");

    dragHandle.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - gui.offsetLeft;
        offsetY = e.clientY - gui.offsetTop;
        document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        gui.style.left = (e.clientX - offsetX) + "px";
        gui.style.top = (e.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.style.userSelect = "auto";
    });

})();