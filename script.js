const params = new URLSearchParams(window.location.search);
const domain = params.get('domain') || 'http://localhost:4000';
const secretWord = (params.get('word') || 'misterio').toLowerCase();

const wordDisplay = document.getElementById('word-display');
const effectsContainer = document.getElementById('effects-container');

let victoryAchieved = false;

// Cria os espaços das letras
const letters = secretWord.split('').map(letter => {
  const span = document.createElement('span');
  span.classList.add('letter');
  span.textContent = letter.toUpperCase();
  wordDisplay.appendChild(span);
  return { letter: letter, element: span };
});

function fetchGuesses() {
  fetch(`${domain}/wordcloud`)
    .then(response => response.json())
    .then(data => {
      const guesses = (data.wordcloud || "").toLowerCase().split(',');

      letters.forEach(({ letter, element }) => {
        if (guesses.includes(letter)) {
          element.classList.add('revealed');
        }
      });

      checkVictory();
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
}

// Verifica se todas as letras foram reveladas
function checkVictory() {
  if (victoryAchieved) return;

  const allRevealed = letters.every(({ element }) => element.classList.contains('revealed'));
  if (allRevealed) {
    victoryAchieved = true;
    showVictory();
  }
}

// Mostra a vitória
function showVictory() {
  for (let i = 0; i < 30; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.top = Math.random() * 100 + '%';
    spark.style.left = Math.random() * 100 + '%';
    effectsContainer.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 1000);
  }

  const message = document.createElement('div');
  message.id = 'victory-message';
  message.textContent = 'Palavra Completa! 🎉';
  document.body.appendChild(message);
}

// Atualiza a cada segundo
setInterval(fetchGuesses, 1000);
fetchGuesses();
