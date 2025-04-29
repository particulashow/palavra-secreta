const params = new URLSearchParams(window.location.search);
const domain = params.get('domain') || 'http://localhost:3900';
const secretWord = (params.get('word') || 'misterio').toLowerCase();
const triesFromURL = parseInt(params.get('tries')) || 6;

const wordDisplay = document.getElementById('word-display');
const triesLeftEl = document.getElementById('tries-left');
const forcaFigure = document.getElementById('forca-figure');
const effectsContainer = document.getElementById('effects-container');

let maxTries = triesFromURL;
let currentTries = maxTries;
let guessedLetters = [];
let victoryAchieved = false;
let defeatAchieved = false;

// Desenha os espaços das letras como "_"
const letters = secretWord.split('').map(letter => {
  const span = document.createElement('span');
  span.classList.add('letter');
  span.textContent = '_';  // Mostra apenas _ no início
  wordDisplay.appendChild(span);
  return { letter: letter, element: span };
});

function fetchGuesses() {
  fetch(`${domain}/wordcloud`)
    .then(response => response.json())
    .then(data => {
      const guesses = (data.wordcloud || "").toLowerCase().split(',');

      guesses.forEach(guess => {
        guess = guess.trim();
        if (guess.length === 1 && !guessedLetters.includes(guess)) {
          guessedLetters.push(guess);

          if (!secretWord.includes(guess)) {
            currentTries--;
            updateForcaFigure();
          } else {
            letters.forEach(({ letter, element }) => {
              if (letter === guess) {
                element.classList.add('revealed');
                element.textContent = letter.toUpperCase();  // Revela a letra
              }
            });
          }
        }
      });

      checkVictoryOrDefeat();
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
}

function updateForcaFigure() {
  triesLeftEl.textContent = `Tentativas restantes: ${currentTries}`;

  const stages = [
    '',
    '😵\n',
    '😵\n |\n',
    '😵\n/|\n',
    '😵\n/|\\\n',
    '😵\n/|\\\n /\n',
    '😵\n/|\\\n/ \\'
  ];

  forcaFigure.textContent = stages[maxTries - currentTries] || stages[stages.length - 1];
}

function checkVictoryOrDefeat() {
  if (victoryAchieved || defeatAchieved) return;

  const allRevealed = letters.every(({ element }) => element.classList.contains('revealed'));

  if (allRevealed) {
    victoryAchieved = true;
    showVictory();
  } else if (currentTries <= 0) {
    defeatAchieved = true;
    showDefeat();
  }
}

function showVictory() {
  const message = document.createElement('div');
  message.id = 'victory-message';
  message.textContent = 'Vitória! 🎉';
  document.body.appendChild(message);
}

function showDefeat() {
  const message = document.createElement('div');
  message.id = 'defeat-message';
  message.textContent = 'Game Over! ☠️';
  document.body.appendChild(message);
}

// Atualizar a cada segundo
setInterval(fetchGuesses, 1000);
fetchGuesses();
