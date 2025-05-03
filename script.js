const params = new URLSearchParams(window.location.search);
const domain = 'http://localhost:3900'; // Altera se necessário
const wordParam = (params.get('word') || 'MAGIA').toUpperCase();
const container = document.getElementById('secret-word');

// Seleciona 2 letras únicas aleatórias para revelar inicialmente
function escolherLetrasIniciais(palavra, quantas = 2) {
  const letrasUnicas = [...new Set(palavra.replace(/[^A-Z]/gi, ''))];
  const escolhidas = [];
  while (escolhidas.length < quantas && letrasUnicas.length > 0) {
    const index = Math.floor(Math.random() * letrasUnicas.length);
    escolhidas.push(letrasUnicas.splice(index, 1)[0]);
  }
  return new Set(escolhidas);
}

const revealedLetters = escolherLetrasIniciais(wordParam, 2);
const uniqueLetters = [...new Set(wordParam.replace(/[^A-Z]/gi, ''))];

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

fetch(`${domain}/clear-chat`).then(() => {
  renderWord();
  setInterval(fetchChat, 1000);
});
