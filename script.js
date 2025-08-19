// Vocabulary data for the game
const vocabulary = {
    father: "bố",
    mother: "mẹ",
    daughter: "con gái",
    son: "con trai",
    twins: "anh em sinh đôi",
    clever: "thông minh",
    cute: "dễ thương",
    kind: "tốt bụng",
    polite: "lịch sự",
    cheerful: "vui vẻ"
};

// Global variables for game state
let words = Object.keys(vocabulary);
let translations = Object.values(vocabulary);
let score = 0;
let selectedWord = null;
let selectedTranslation = null;
let completedPairs = 0;
let incorrectPairs = [];

// Get DOM elements
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');
const gameArea = document.getElementById('game-area');
const resetButton = document.getElementById('reset-button');
const reviewButton = document.getElementById('review-button');
const confetti = document.createElement('div');
confetti.classList.add('confetti');

// Create audio objects (ensure these files are in the same directory as index.html)
const correctSound = new Audio("correct.mp3");
const chucmungSound = new Audio("chucmung.mp3");
const thatbaiSound = new Audio("thatbai.mp3");
const cancogangSound = new Audio("cancogang.mp3");
const bailamkhaSound = new Audio("bailamkha.mp3");

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to render the word cards on the screen
function renderCards() {
    gameArea.innerHTML = '';
    messageEl.textContent = '';
    scoreEl.style.display = 'none';
    selectedWord = null;
    selectedTranslation = null;
    completedPairs = 0;
    incorrectPairs = [];
    score = 0;
    
    let currentWords = words.slice();
    let currentTranslations = translations.slice();
    shuffle(currentWords);
    shuffle(currentTranslations);

    const wordContainer = document.createElement('div');
    wordContainer.style.display = 'flex';
    wordContainer.style.flexDirection = 'column';
    
    const translationContainer = document.createElement('div');
    translationContainer.style.display = 'flex';
    translationContainer.style.flexDirection = 'column';

    currentWords.forEach(word => {
        const card = document.createElement('div');
        card.textContent = word;
        card.classList.add('word-card');
        card.dataset.word = word;
        card.addEventListener('click', () => selectCard(card, 'word'));
        wordContainer.appendChild(card);
    });

    currentTranslations.forEach(translation => {
        const card = document.createElement('div');
        card.textContent = translation;
        card.classList.add('word-card');
        card.dataset.translation = translation;
        card.addEventListener('click', () => selectCard(card, 'translation'));
        translationContainer.appendChild(card);
    });

    gameArea.appendChild(wordContainer);
    gameArea.appendChild(translationContainer);
}

// Function to handle card selection
function selectCard(card, type) {
    if (card.classList.contains('correct')) return;

    if (type === 'word') {
        if (selectedWord) selectedWord.classList.remove('selected');
        selectedWord = card;
        selectedWord.classList.add('selected');
    } else {
        if (selectedTranslation) selectedTranslation.classList.remove('selected');
        selectedTranslation = card;
        selectedTranslation.classList.add('selected');
    }

    if (selectedWord && selectedTranslation) {
        checkMatch();
    }
}

// Function to check if the selected cards match
function checkMatch() {
    const word = selectedWord.dataset.word;
    const translation = selectedTranslation.dataset.translation;
    
    selectedWord.classList.remove('selected');
    selectedTranslation.classList.remove('selected');
    selectedWord.classList.add('correct');
    selectedTranslation.classList.add('correct');
    correctSound.play();

    if (vocabulary[word] === translation) {
        score++;
    } else {
        incorrectPairs.push({ english: word, vietnamese: translation });
    }
    
    selectedWord = null;
    selectedTranslation = null;
    completedPairs++;
    
    if (completedPairs === words.length) {
        setTimeout(endGame, 1000);
    }
}

// Function to handle the end of the game
function endGame() {
    gameArea.innerHTML = '';
    messageEl.style.display = 'block';
    scoreEl.style.display = 'block';
    scoreEl.textContent = `Điểm: ${score}`;
    
    if (score === words.length) {
        messageEl.innerHTML = `Chúc mừng bạn đã hoàn thành bài thi! <br>Bạn đã đạt được ${score} điểm. <br>Hoan hô! 🎊`;
        messageEl.style.color = '#ff6347';
        chucmungSound.play();
        launchConfetti();
    } else if (score >= 7 && score <= 9) {
        messageEl.innerHTML = `Hoàn thành bài thi! <br>Bạn đã đạt được ${score} điểm. <br>Bài làm khá! Cần phát huy! 👍`;
        messageEl.style.color = '#4682b4';
        bailamkhaSound.play();
    } else if (score >= 5 && score <= 6) {
        messageEl.innerHTML = `Hoàn thành bài thi! <br>Bạn đã đạt được ${score} điểm. <br>Cần cố gắng hơn nữa! 😔`;
        messageEl.style.color = '#4682b4';
        cancogangSound.play();
    } else if (score < 5) {
        messageEl.innerHTML = `Hoàn thành bài thi! <br>Bạn đã đạt được ${score} điểm. <br>Cần cố gắng hơn nữa! 😔`;
        messageEl.style.color = '#4682b4';
        thatbaiSound.play();
    }
    
    resetButton.style.display = 'block';
    if (incorrectPairs.length > 0) {
        reviewButton.style.display = 'block';
    }
}

// Function to show incorrect pairs
function showIncorrectPairs() {
    gameArea.innerHTML = '';
    messageEl.textContent = 'Những câu bạn đã làm sai:';
    messageEl.style.color = '#dc3545';
    reviewButton.style.display = 'none';

    const incorrectPairsContainer = document.createElement('div');
    incorrectPairsContainer.classList.add('incorrect-pairs-container');

    incorrectPairs.forEach(pair => {
        const pairDiv = document.createElement('div');
        pairDiv.classList.add('word-pair');
        
        const englishCard = document.createElement('div');
        englishCard.classList.add('word-card');
        englishCard.style.backgroundColor = '#dc3545';
        englishCard.textContent = pair.english;
        
        const vietnameseCard = document.createElement('div');
        vietnameseCard.classList.add('word-card');
        vietnameseCard.style.backgroundColor = '#dc3545';
        vietnameseCard.textContent = vocabulary[pair.english];
        
        pairDiv.appendChild(englishCard);
        pairDiv.appendChild(vietnameseCard);
        incorrectPairsContainer.appendChild(pairDiv);
    });

    gameArea.appendChild(incorrectPairsContainer);
    resetButton.style.display = 'block';
}

// Function to launch confetti animation
function launchConfetti() {
    document.body.appendChild(confetti);
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.animationDelay = `${Math.random() * 2}s`;
        piece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.appendChild(piece);
    }
    setTimeout(() => {
        confetti.innerHTML = '';
        if (document.body.contains(confetti)) {
            document.body.removeChild(confetti);
        }
    }, 5000);
}

// Event listeners for buttons
resetButton.addEventListener('click', () => {
    score = 0;
    renderCards();
    resetButton.style.display = 'none';
});

reviewButton.addEventListener('click', showIncorrectPairs);

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', renderCards);