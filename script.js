import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase Configuration
const supabaseUrl = 'https://your-project.supabase.co';  // Replace with your URL
const supabaseKey = 'your-anon-key';                     // Replace with your key
const supabase = createClient(supabaseUrl, supabaseKey);

// Admin Password (hidden from HTML)
const ADMIN_PASSWORD = 'your_secure_admin_password';     // Change securely

// DOM References
const form = document.getElementById('playerForm');
const playerSelect = document.getElementById('playerSelect');

// Load Players on Page Load
window.addEventListener('DOMContentLoaded', async () => {
  await populatePlayerDropdown();
});

// Populate Select Dropdown
async function populatePlayerDropdown() {
  const { data, error } = await supabase.from('players').select('name');
  if (error) {
    console.error('Error loading players:', error);
    return;
  }

  playerSelect.innerHTML = '';
  data.forEach(player => {
    const option = document.createElement('option');
    option.value = player.name;
    option.textContent = player.name;
    playerSelect.appendChild(option);
  });
}

// Handle Form Submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const matches = parseInt(document.getElementById('matches').value);
  const runs = parseInt(document.getElementById('runs').value);
  const wickets = parseInt(document.getElementById('wickets').value);
  const adminPass = document.getElementById('adminPass').value.trim();

  if (adminPass !== ADMIN_PASSWORD) {
    alert('Incorrect admin password.');
    return;
  }

  if (!name || isNaN(matches) || isNaN(runs) || isNaN(wickets)) {
    alert('Please fill all fields correctly.');
    return;
  }

  const { error } = await supabase
    .from('players')
    .upsert({ name, matches, runs, wickets }, { onConflict: ['name'] });

  if (error) {
    alert('Failed to save player stats.');
    console.error(error);
  } else {
    alert('Stats saved successfully!');
    form.reset();
    await populatePlayerDropdown();
  }
});
