const params = new URLSearchParams(window.location.search);
const domain = 'http://localhost:3900'; // Altera aqui se usares outro backend
const wordParam = (params.get('word') || 'MAGIA').toUpperCase();
const uniqueLetters = [...new Set(wordParam.replace(/[^A-Z]/gi, ''))];

const container = document.getElementById('secret-word');
const revealedLetters = new Set();

// Inicializa com letras escondidas
function renderWord() {
  container.innerHTML = '';
  [...wordParam].forEach(letter => {
    const span = document.createElement('span');
    span.classList.add('letter');
    if (letter === ' ') {
      span.innerHTML = '&nbsp;';
    } else if (revealedLetters.has(letter)) {
      span.textContent = letter;
    } else {
      span.textContent = letter;
      span.classList.add('hidden');
    }
    container.appendChild(span);
  });
}

function updateRevealedLettersFromChat(chatWords) {
  chatWords.forEach(word => {
    const upper = word.toUpperCase();
    [...upper].forEach(letter => {
      if (uniqueLetters.includes(letter)) {
        revealedLetters.add(letter);
      }
    });
  });
  renderWord();
}

function fetchChat() {
  fetch(`${domain}/wordcloud`)
    .then(res => res.json())
    .then(data => {
      const words = (data.wordcloud || '')
        .toLowerCase()
        .split(',')
        .map(w => w.trim())
        .filter(w => w.length > 0);

      updateRevealedLettersFromChat(words);
    });
}

// Reset inicial (opcional)
fetch(`${domain}/clear-chat`).then(() => {
  renderWord();
  setInterval(fetchChat, 1000);
});
