const params = new URLSearchParams(window.location.search);
const domain = params.get('domain') || 'http://localhost:4000';
const secretWord = (params.get('word') || 'misterio').toLowerCase();

const wordDisplay = document.getElementById('word-display');

// Cria os espaços das letras
const letters = secretWord.split('').map(letter => {
  const span = document.createElement('span');
  span.classList.add('letter');
  span.textContent = letter.toUpperCase();
  wordDisplay.appendChild(span);
  return { letter: letter, element: span };
});

// Atualizar a palavra com base nos comentários
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
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
}

// Atualizar a cada segundo
setInterval(fetchGuesses, 1000);
fetchGuesses();
