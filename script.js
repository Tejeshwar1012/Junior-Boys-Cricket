// Supabase Configuration
const SUPABASE_URL = "https://your-supabase-url.supabase.co";
const SUPABASE_KEY = "your-supabase-secret-key";  // Store this securely in the backend
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const playerSelect = document.getElementById("playerSelect");
const playerNameInput = document.getElementById("playerName");
const matchesInput = document.getElementById("matches");
const runsInput = document.getElementById("runs");
const wicketsInput = document.getElementById("wickets");
const playerAvatar = document.getElementById("playerAvatar");
const statsForm = document.getElementById("statsForm");
const resetButton = document.getElementById("resetStats");
const darkModeToggle = document.getElementById("darkModeToggle");
const chartCanvas = document.getElementById("playerChart");

// Admin Password (Hidden from Inspect Element)
const ADMIN_PASSWORD_HASH = "5d41402abc4b2a76b9719d911017c592"; // MD5 Hash for "hello"

// Global Variables
let players = [];
let chart;

// Fetch Players from Supabase
async function fetchPlayers() {
    const { data, error } = await supabase.from("players").select("*");
    if (error) {
        console.error("Error fetching players:", error);
        return;
    }
    players = data;
    updatePlayerDropdown();
}

// Update Player Dropdown
function updatePlayerDropdown() {
    playerSelect.innerHTML = "";
    players.forEach(player => {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = player.name;
        playerSelect.appendChild(option);
    });
}

// Load Selected Player's Stats
async function loadPlayerStats(playerId) {
    const { data, error } = await supabase.from("players").select("*").eq("id", playerId).single();
    if (error) {
        console.error("Error loading player stats:", error);
        return;
    }

    playerNameInput.value = data.name;
    matchesInput.value = data.matches;
    runsInput.value = data.runs;
    wicketsInput.value = data.wickets;
    playerAvatar.src = data.avatar_url || "default-avatar.png";
    
    updateChart(data);
}

// Update Player Stats in Supabase
async function updateStats(event) {
    event.preventDefault();
    
    const password = prompt("Enter Admin Password:");
    if (md5(password) !== ADMIN_PASSWORD_HASH) {
        alert("Incorrect Password!");
        return;
    }

    const playerId = playerSelect.value;
    const updatedStats = {
        name: playerNameInput.value,
        matches: parseInt(matchesInput.value),
        runs: parseInt(runsInput.value),
        wickets: parseInt(wicketsInput.value)
    };

    const { error } = await supabase.from("players").update(updatedStats).eq("id", playerId);
    if (error) {
        console.error("Error updating stats:", error);
        return;
    }

    alert("Stats updated successfully!");
    fetchPlayers();
}

// Reset Player Stats
async function resetStats() {
    const password = prompt("Enter Admin Password:");
    if (md5(password) !== ADMIN_PASSWORD_HASH) {
        alert("Incorrect Password!");
        return;
    }

    const playerId = playerSelect.value;
    const resetData = { matches: 0, runs: 0, wickets: 0 };
    
    const { error } = await supabase.from("players").update(resetData).eq("id", playerId);
    if (error) {
        console.error("Error resetting stats:", error);
        return;
    }

    alert("Stats reset!");
    loadPlayerStats(playerId);
}

// Toggle Dark Mode
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Update Chart with New Data
function updateChart(data) {
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: ["Matches", "Runs", "Wickets"],
            datasets: [{
                label: `${data.name}'s Performance`,
                data: [data.matches, data.runs, data.wickets],
                backgroundColor: ["#ffcc00", "#ff5733", "#007BFF"]
            }]
        }
    });
}

// Event Listeners
playerSelect.addEventListener("change", () => loadPlayerStats(playerSelect.value));
statsForm.addEventListener("submit", updateStats);
resetButton.addEventListener("click", resetStats);

// Fetch Initial Data
fetchPlayers();
