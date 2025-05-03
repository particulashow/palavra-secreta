const params = new URLSearchParams(window.location.search);
const domain = 'http://localhost:3900';
const wordParam = (params.get('word') || 'MAGIA').toUpperCase();
const titleParam = params.get('title') || 'Palavra Secreta 🧩';
const container = document.getElementById('secret-word');

// Define o título
document.getElementById('title').textContent = titleParam;

const uniqueLetters = [...new Set(wordParam.replace(/[^A-Z]/gi, ''))];
const revealedLetters = new Set();

function renderWord() {
  container.innerHTML = '';
  [...wordParam].forEach(letter => {
    const span = document.createElement('span');
    span.classList.add('letter');

    if (letter === ' ') {
      span.innerHTML = '&nbsp;';
      span.style.border = 'none';
    } else if (revealedLetters.has(letter)) {
      span.textContent = letter;
      span.classList.add('visible');
    } else {
      span.textContent = '_';
      span.style.color = 'transparent';
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
