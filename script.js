const SUPABASE_URL = "https://ojahcuzryaeladpmrbyb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qYWhjdXpyeWFlbGFkcG1yYnliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzYwMzg4NCwiZXhwIjoyMDU5MTc5ODg0fQ.KAeVpn8O7Luwz1cCiquTWib3urtubFFXIpBehVbUOXE";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const playerSelect = document.getElementById("playerSelect");
const statsForm = document.getElementById("statsForm");
const darkModeToggle = document.getElementById("darkModeToggle");
const chartCanvas = document.getElementById("playerChart");
const ADMIN_PASSWORD_HASH = "5d41402abc4b2a76b9719d911017c592";

let players = [];
let chart;

async function fetchPlayers() {
    const { data, error } = await supabase.from("players").select("*");
    if (error) return console.error("Error fetching players:", error);
    players = data;
    updatePlayerDropdown();
}

function updatePlayerDropdown() {
    playerSelect.innerHTML = "";
    players.forEach(player => {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = player.name;
        playerSelect.appendChild(option);
    });
}

async function updateStats(event) {
    event.preventDefault();
    const password = prompt("Enter Admin Password:");
    if (md5(password) !== ADMIN_PASSWORD_HASH) return alert("Incorrect Password!");

    const playerId = playerSelect.value;
    const updatedStats = {
        matches: parseInt(document.getElementById("matches").value),
        runs: parseInt(document.getElementById("runs").value),
        wickets: parseInt(document.getElementById("wickets").value)
    };

    const { error } = await supabase.from("players").update(updatedStats).eq("id", playerId);
    if (error) return console.error("Error updating stats:", error);
    alert("Stats updated successfully!");
    fetchPlayers();
}

function updateChart(data) {
    if (chart) chart.destroy();
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

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

fetchPlayers();
