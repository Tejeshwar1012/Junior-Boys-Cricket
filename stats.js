import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Your Supabase credentials
const supabaseUrl = 'https://ojahcuzryaeladpmrbyb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qYWhjdXpyeWFlbGFkcG1yYnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MDM4ODQsImV4cCI6MjA1OTE3OTg4NH0.EJ8P2NW6YTiYHhnkIbdnBgQZ_kOqdkvOjl21MLIAyVY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Dark Mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});

// Fetch and render player stats charts
window.addEventListener('DOMContentLoaded', async () => {
  const { data, error } = await supabase.from('players').select('*');

  if (error) {
    console.error('Error fetching stats:', error);
    return;
  }

  const playerNames = data.map(p => p.name);
  const playerRuns = data.map(p => p.runs);
  const playerWickets = data.map(p => p.wickets);

  // Runs Chart
  const runsCtx = document.getElementById('runsChart').getContext('2d');
  new Chart(runsCtx, {
    type: 'bar',
    data: {
      labels: playerNames,
      datasets: [{
        label: 'Runs Scored',
        data: playerRuns,
        backgroundColor: 'rgba(0, 255, 231, 0.5)',
        borderColor: '#00ffe7',
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Wickets Chart
  const wicketsCtx = document.getElementById('wicketsChart').getContext('2d');
  new Chart(wicketsCtx, {
    type: 'bar',
    data: {
      labels: playerNames,
      datasets: [{
        label: 'Wickets Taken',
        data: playerWickets,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
