let players = JSON.parse(localStorage.getItem("players")) ?? [];
let selectedPlayer = "";
const adminPassword = "Tejadiya@711"; // Change this to your password

// Disable inputs until login
function disableEditing(status) {
    document.getElementById("playerName").disabled = status;
    document.getElementById("matches").disabled = status;
    document.getElementById("runs").disabled = status;
    document.getElementById("wickets").disabled = status;
    document.getElementById("saveButton").disabled = status;
    document.getElementById("addButton").disabled = status;
    document.getElementById("resetButton").disabled = status;
}

// Check Admin Password
function checkPassword() {
    let enteredPass = document.getElementById("adminPass").value;
    if (enteredPass === adminPassword) {
        alert("Access Granted! You can now edit stats.");
        disableEditing(false);
    } else {
        alert("Access Denied! Incorrect password.");
        disableEditing(true);
    }
}

// Load players into dropdown
function updatePlayerDropdown() {
    let select = document.getElementById("playerSelect");
    select.innerHTML = `<option value="">-- Select a Player --</option>`;

    players.forEach(player => {
        let option = document.createElement("option");
        option.value = player.name;
        option.textContent = player.name;
        select.appendChild(option);
    });

    if (selectedPlayer) {
        select.value = selectedPlayer;
        loadPlayerStats();
    }
}

// Save player stats
function saveStats() {
    let name = document.getElementById("playerName").value.trim();
    let matches = parseInt(document.getElementById("matches").value);
    let runs = parseInt(document.getElementById("runs").value);
    let wickets = parseInt(document.getElementById("wickets").value);

    if (!name || isNaN(matches) || isNaN(runs) || isNaN(wickets)) {
        alert("Please enter valid values.");
        return;
    }

    let player = players.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (player) {
        player.matches = matches;
        player.runs = runs;
        player.wickets = wickets;
    } else {
        players.push({ name, matches, runs, wickets });
    }

    localStorage.setItem("players", JSON.stringify(players));
    selectedPlayer = name;
    updatePlayerDropdown();
    loadPlayerStats();
}

// Load selected player's stats
function loadPlayerStats() {
    let name = document.getElementById("playerSelect").value;
    let player = players.find(p => p.name === name);

    if (player) {
        document.getElementById("playerName").value = player.name;
        document.getElementById("matches").value = player.matches;
        document.getElementById("runs").value = player.runs;
        document.getElementById("wickets").value = player.wickets;

        document.getElementById("displayName").innerText = player.name;
        document.getElementById("displayMatches").innerText = player.matches;
        document.getElementById("displayRuns").innerText = player.runs;
        document.getElementById("displayWickets").innerText = player.wickets;

        selectedPlayer = name;
        updateGraph(player);
    }
}

// Add new player
function addNewPlayer() {
    document.getElementById("playerName").value = "";
    document.getElementById("matches").value = "";
    document.getElementById("runs").value = "";
    document.getElementById("wickets").value = "";
}

// Reset all data
function resetData() {
    if (confirm("Are you sure you want to reset all player data?")) {
        localStorage.removeItem("players");
        players = [];
        selectedPlayer = "";
        document.getElementById("playerSelect").innerHTML = "";
        updatePlayerDropdown();
        document.getElementById("displayName").innerText = "-";
        document.getElementById("displayMatches").innerText = "0";
        document.getElementById("displayRuns").innerText = "0";
        document.getElementById("displayWickets").innerText = "0";
        if (chart) chart.destroy();
    }
}

// Graph for Runs & Wickets
let chart;
function updateGraph(player) {
    let ctx = document.getElementById("statsChart").getContext("2d");

    if (!chart) {
        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Runs", "Wickets"],
                datasets: [{
                    label: player.name + " Performance",
                    data: [player.runs, player.wickets],
                    backgroundColor: ["blue", "red"]
                }]
            }
        });
    } else {
        chart.data.datasets[0].label = player.name + " Performance";
        chart.data.datasets[0].data = [player.runs, player.wickets];
        chart.update();
    }
}

// Disable editing by default until login
disableEditing(true);
window.onload = updatePlayerDropdown;

