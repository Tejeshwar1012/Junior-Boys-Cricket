import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Your Supabase credentials
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Admin Password (obfuscated, not in HTML)
const ADMIN_PASSWORD = 'your_secure_admin_password';

const form = document.getElementById('playerForm');
const playersContainer = document.getElementById('playersContainer');
const darkModeToggle = document.getElementById('darkModeToggle');

// Toggle Dark Mode
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});

// Fetch Players on Load
window.addEventListener('DOMContentLoaded', async () => {
  await loadPlayers();
});

// Load All Players from Supabase
async function loadPlayers() {
  const { data, error } = await supabase.from('players').select('*');
  if (error) {
    console.error('Error fetching players:', error);
    return;
  }

  playersContainer.innerHTML = ''; // Clear before reload

  data.forEach(player => {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML = `
      <h3>${player.name}</h3>
      <p><strong>Matches:</strong> ${player.matches}</p>
      <p><strong>Runs:</strong> ${player.runs}</p>
      <p><strong>Wickets:</strong> ${player.wickets}</p>
    `;
    playersContainer.appendChild(card);
  });
}

// Handle Form Submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const matches = parseInt(document.getElementById('matches').value);
  const runs = parseInt(document.getElementById('runs').value);
  const wickets = parseInt(document.getElementById('wickets').value);
  const adminPass = document.getElementById('adminPass').value;

  if (adminPass !== ADMIN_PASSWORD) {
    alert('Incorrect admin password.');
    return;
  }

  const { data, error } = await supabase
    .from('players')
    .upsert({ name, matches, runs, wickets }, { onConflict: ['name'] });

  if (error) {
    alert('Error saving stats');
    console.error(error);
  } else {
    alert('Stats saved successfully!');
    form.reset();
    await loadPlayers();
  }
});
