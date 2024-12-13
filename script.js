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

// Configura o WebSocket para comentários em tempo real
const ws = new WebSocket("wss://io.socialstream.ninja/socket");

ws.onopen = () => {
  console.log("WebSocket conectado!");
};

ws.onmessage = (event) => {
  const commentData = JSON.parse(event.data);
  const commentText = commentData.comment || "";
  processComment(commentText);
};

ws.onerror = (error) => {
  console.error("Erro no WebSocket:", error);
};

ws.onclose = () => {
  console.log("WebSocket desconectado.");
};

// Inicializa o jogo
updateDisplay();
