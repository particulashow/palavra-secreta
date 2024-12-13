// Palavra secreta
const secretWord = "COMUNICACAO";
let revealedWord = "_".repeat(secretWord.length).split("");

// Atualiza a palavra no ecrã
function updateDisplay() {
  const wordDisplay = document.getElementById("word-display");
  wordDisplay.textContent = revealedWord.join(" ");
}

// Valida um comentário
function processComment(comment) {
  const upperComment = comment.toUpperCase();
  let found = false;

  // Verifica cada letra da palavra secreta
  secretWord.split("").forEach((letter, index) => {
    if (upperComment.includes(letter) && revealedWord[index] === "_") {
      revealedWord[index] = letter;
      found = true;
    }
  });

  // Atualiza o estado do jogo
  if (found) {
    document.getElementById("status").textContent = "Letra encontrada!";
  } else {
    document.getElementById("status").textContent = "Tenta outra vez!";
  }

  // Atualiza o ecrã
  updateDisplay();

  // Verifica se a palavra está completa
  if (!revealedWord.includes("_")) {
    document.getElementById("status").textContent = "Parabéns! Palavra completa!";
  }
}

// Simulação de comentários em tempo real
function simulateComments() {
  const sampleComments = [
    "Olá pessoal",
    "C",
    "Eu gosto de comunicar",
    "O mundo é bonito",
    "Vamos todos juntos",
    "Ação é importante"
  ];

  sampleComments.forEach((comment, index) => {
    setTimeout(() => processComment(comment), index * 2000);
  });
}

// Inicia o jogo
updateDisplay();
simulateComments();
