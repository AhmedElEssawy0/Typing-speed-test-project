/*
  ============================================
  Typing Speed Test Game - Main JavaScript
  ============================================
  
  Features:
  - Multiple difficulty levels
  - Score tracking with local storage
  - Client-side validation with regex
  - AJAX integration for server communication
  - Responsive design
  - Accessibility features
  - Clean, modular code structure
*/

// ============================================
// Configuration and Data
// ============================================

/**
 * Word lists for different difficulty levels
 */
const wordsByLevel = {
  "Easy": [
    "Hello", "World", "Code", "Test", "Play", "Game", "Fun", "Learn",
    "Program", "JavaScript", "HTML", "CSS", "Web", "Design", "Build",
    "Create", "Develop", "Debug", "Error", "Success", "Start", "Stop",
    "Run", "Save", "Load", "Data", "File", "Folder", "System", "User"
  ],
  "Normal": [
    "Programming", "Javascript", "Documentation", "Destructuring", "Paradigm",
    "Styling", "Cascade", "Coding", "Dependencies", "Runner", "Testing",
    "Youtube", "Linkedin", "Twitter", "Github", "Leetcode", "Internet",
    "Python", "Scala", "Rust", "Framework", "Library", "Module", "Package",
    "Repository", "Commit", "Branch", "Merge", "Conflict", "Resolution", "Algorithm"
  ],
  "Hard": [
    "Asynchronous", "Callback", "Promise", "Async/Await", "Middleware",
    "Authentication", "Authorization", "Encryption", "Compression", "Serialization",
    "Deserialization", "Polymorphism", "Inheritance", "Encapsulation", "Abstraction",
    "Refactoring", "Optimization", "Profiling", "Debugging", "Deployment",
    "Containerization", "Orchestration", "Microservices", "Architecture", "Scalability"
  ]
};

/**
 * Difficulty levels configuration
 */
const levels = {
  "Easy": 5,
  "Normal": 3,
  "Hard": 2
};

// ============================================
// Global Variables
// ============================================

let currentLevel = "Normal";
let currentLevelSeconds = levels[currentLevel];
let currentWords = [...wordsByLevel[currentLevel]];
let gameActive = false;
let currentScore = 0;
let totalWords = currentWords.length;
let gameStartTime = null;
let timeInterval = null;

// ============================================
// DOM Elements Cache
// ============================================

const domElements = {
  startButton: document.querySelector(".start"),
  levelSelect: document.querySelector("#level-select"),
  levelNameSpan: document.querySelector(".message .lvl"),
  secondsSpan: document.querySelector(".message .seconds"),
  theWord: document.querySelector(".the-word"),
  upcomingWords: document.querySelector(".upcoming-words"),
  input: document.querySelector(".input"),
  timeLeftSpan: document.querySelector(".time span"),
  scoreGot: document.querySelector(".score .got"),
  scoreTotal: document.querySelector(".score .total"),
  finishMessage: document.querySelector(".finish"),
  historyButton: document.querySelector("#show-history"),
  historyModal: document.querySelector("#history-modal"),
  closeHistoryBtn: document.querySelector("#history-modal .close-modal"),
  historyList: document.querySelector("#history-list"),
  clearHistoryBtn: document.querySelector("#clear-history"),
  validationModal: document.querySelector("#validation-modal"),
  closeValidationBtn: document.querySelector("#validation-modal .close-modal"),
  validationMessage: document.querySelector("#validation-message"),
  validationOkBtn: document.querySelector("#validation-modal .ok-btn")
};

// ============================================
// Validation Functions
// ============================================

/**
 * Validates user input using regex pattern
 * @param {string} input - The user input to validate
 * @returns {object} - Validation result with status and message
 */
function validateInput(input) {
  // Check if input is empty
  if (!input || input.trim() === "") {
    return {
      valid: false,
      message: "Input cannot be empty. Please type a word."
    };
  }

  // Check if input contains only alphabetic characters
  const alphabeticPattern = /^[a-zA-Z]+$/;
  if (!alphabeticPattern.test(input.trim())) {
    return {
      valid: false,
      message: "Input must contain only alphabetic characters (A-Z, a-z)."
    };
  }

  // Check if input length is reasonable (between 2 and 50 characters)
  if (input.trim().length < 2 || input.trim().length > 50) {
    return {
      valid: false,
      message: "Input must be between 2 and 50 characters long."
    };
  }

  return {
    valid: true,
    message: "Input is valid."
  };
}

/**
 * Shows validation error message in modal
 * @param {string} message - The error message to display
 */
function showValidationError(message) {
  domElements.validationMessage.textContent = message;
  domElements.validationModal.style.display = "flex";
}

/**
 * Closes validation modal
 */
function closeValidationModal() {
  domElements.validationModal.style.display = "none";
}

// ============================================
// Local Storage Functions
// ============================================

/**
 * Saves score to local storage
 * @param {string} level - The difficulty level
 * @param {number} score - The score achieved
 * @param {number} total - Total words in the game
 */
function saveScoreToLocalStorage(level, score, total) {
  const scoreData = {
    level: level,
    score: score,
    total: total,
    percentage: Math.round((score / total) * 100),
    date: new Date().toLocaleString(),
    timestamp: Date.now()
  };

  let scores = JSON.parse(localStorage.getItem("typingGameScores")) || [];
  scores.push(scoreData);

  // Keep only last 50 scores
  if (scores.length > 50) {
    scores = scores.slice(-50);
  }

  localStorage.setItem("typingGameScores", JSON.stringify(scores));
  return scoreData;
}

/**
 * Retrieves all scores from local storage
 * @returns {array} - Array of score objects
 */
function getScoresFromLocalStorage() {
  return JSON.parse(localStorage.getItem("typingGameScores")) || [];
}

/**
 * Clears all scores from local storage
 */
function clearLocalStorage() {
  localStorage.removeItem("typingGameScores");
}

// ============================================
// Score History Display Functions
// ============================================

/**
 * Displays score history in modal
 */
function displayScoreHistory() {
  const scores = getScoresFromLocalStorage();

  if (scores.length === 0) {
    domElements.historyList.innerHTML = "<p>No scores yet. Play a game to get started!</p>";
  } else {
    domElements.historyList.innerHTML = scores
      .reverse()
      .map((score, index) => `
        <div class="history-item">
          <div class="history-item-info">
            <div class="history-item-level">
              ${score.level} Level
            </div>
            <div class="history-item-date">
              ${score.date}
            </div>
          </div>
          <div class="history-item-score">
            ${score.score}/${score.total} (${score.percentage}%)
          </div>
        </div>
      `)
      .join("");
  }

  domElements.historyModal.style.display = "flex";
}

/**
 * Closes score history modal
 */
function closeHistoryModal() {
  domElements.historyModal.style.display = "none";
}

// ============================================
// Game Initialization Functions
// ============================================

/**
 * Initializes the game with selected level
 */
function initializeGame() {
  currentLevel = domElements.levelSelect.value;
  currentLevelSeconds = levels[currentLevel];
  currentWords = [...wordsByLevel[currentLevel]];
  currentScore = 0;
  totalWords = currentWords.length;
  gameActive = false;

  // Update UI
  domElements.levelNameSpan.textContent = currentLevel;
  domElements.secondsSpan.textContent = currentLevelSeconds;
  domElements.scoreGot.textContent = "0";
  domElements.scoreTotal.textContent = totalWords;
  domElements.timeLeftSpan.textContent = currentLevelSeconds;
  domElements.theWord.textContent = "";
  domElements.upcomingWords.innerHTML = "Words Will Show Here";
  domElements.finishMessage.innerHTML = "";
  domElements.input.value = "";
  domElements.input.focus();
}

/**
 * Starts the game
 */
function startGame() {
  initializeGame();
  domElements.startButton.style.display = "none";
  domElements.levelSelect.disabled = true;
  gameActive = true;
  gameStartTime = Date.now();
  domElements.input.focus();

  // Prevent paste and copy
  domElements.input.onpaste = function () {
    return false;
  };

  domElements.input.oncopy = function () {
    return false;
  };

  // Generate first word
  generateWords();
}

// ============================================
// Word Generation and Display Functions
// ============================================

/**
 * Generates and displays words
 */
function generateWords() {
  if (currentWords.length === 0) {
    endGame(true);
    return;
  }

  // Get random word from array
  const randomIndex = Math.floor(Math.random() * currentWords.length);
  const randomWord = currentWords[randomIndex];

  // Remove word from array
  currentWords.splice(randomIndex, 1);

  // Display the word
  domElements.theWord.textContent = randomWord;

  // Clear upcoming words
  domElements.upcomingWords.innerHTML = "";

  // Generate upcoming words display
  for (let i = 0; i < Math.min(currentWords.length, 10); i++) {
    const div = document.createElement("div");
    div.textContent = currentWords[i];
    domElements.upcomingWords.appendChild(div);
  }

  // Start the play timer
  startPlayTimer();
}

// ============================================
// Timer and Game Logic Functions
// ============================================

/**
 * Starts the timer for the current word
 */
function startPlayTimer() {
  let timeLeft = currentLevelSeconds;
  domElements.timeLeftSpan.textContent = timeLeft;

  timeInterval = setInterval(() => {
    timeLeft--;
    domElements.timeLeftSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timeInterval);
      checkAnswer();
    }
  }, 1000);
}

/**
 * Checks the user's answer
 */
function checkAnswer() {
  const userInput = domElements.input.value.trim();
  const correctWord = domElements.theWord.textContent.toLowerCase();

  // Validate input
  const validation = validateInput(userInput);
  if (!validation.valid) {
    showValidationError(validation.message);
    domElements.input.value = "";
    domElements.input.focus();
    generateWords();
    return;
  }

  // Compare words
  if (userInput.toLowerCase() === correctWord) {
    currentScore++;
    domElements.scoreGot.textContent = currentScore;
    domElements.input.value = "";
    domElements.input.focus();

    if (currentWords.length > 0) {
      generateWords();
    } else {
      endGame(true);
    }
  } else {
    endGame(false);
  }
}

/**
 * Ends the game
 * @param {boolean} success - Whether the game ended successfully
 */
function endGame(success) {
  gameActive = false;
  clearInterval(timeInterval);
  domElements.input.disabled = true;
  domElements.levelSelect.disabled = false;

  let message = "";
  let className = "";

  if (success) {
    message = `Excellent! You scored ${currentScore}/${totalWords} (${Math.round((currentScore / totalWords) * 100)}%)`;
    className = "good";
  } else {
    message = `Game Over! You scored ${currentScore}/${totalWords} (${Math.round((currentScore / totalWords) * 100)}%)`;
    className = "bad";
  }

  const span = document.createElement("span");
  span.className = className;
  span.textContent = message;
  domElements.finishMessage.appendChild(span);

  // Save score to local storage
  saveScoreToLocalStorage(currentLevel, currentScore, totalWords);

  // Reset button
  domElements.startButton.style.display = "block";
  domElements.startButton.textContent = "Play Again";
  domElements.input.disabled = false;
  domElements.input.value = "";
}

// ============================================
// AJAX Functions for Server Communication
// ============================================

/**
 * Sends score data to server via AJAX
 * @param {object} scoreData - The score data to send
 */
function sendScoreToServer(scoreData) {
  // Create XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Prepare data as JSON
  const jsonData = JSON.stringify(scoreData);

  // Configure the request
  xhr.open("POST", "save_score.php", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  // Handle response
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log("Score saved to server successfully");
        try {
          const response = JSON.parse(xhr.responseText);
          console.log("Server response:", response);
        } catch (e) {
          console.error("Error parsing server response:", e);
        }
      } else {
        console.error("Error saving score to server. Status:", xhr.status);
      }
    }
  };

  // Handle errors
  xhr.onerror = function () {
    console.error("Network error while sending score to server");
  };

  // Send the request
  xhr.send(jsonData);
}

/**
 * Retrieves scores from server via AJAX
 */
function retrieveScoresFromServer() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "get_scores.php", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        try {
          const scores = JSON.parse(xhr.responseText);
          console.log("Scores retrieved from server:", scores);
          // Process scores as needed
        } catch (e) {
          console.error("Error parsing server response:", e);
        }
      } else {
        console.error("Error retrieving scores from server. Status:", xhr.status);
      }
    }
  };

  xhr.onerror = function () {
    console.error("Network error while retrieving scores from server");
  };

  xhr.send();
}

// ============================================
// Event Listeners
// ============================================

/**
 * Initialize event listeners when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize game display
  initializeGame();

  // Start button click
  domElements.startButton.addEventListener("click", startGame);

  // Level select change
  domElements.levelSelect.addEventListener("change", function () {
    if (!gameActive) {
      initializeGame();
    }
  });

  // Input field - check answer on Enter key
  domElements.input.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && gameActive) {
      clearInterval(timeInterval);
      checkAnswer();
    }
  });

  // History button
  domElements.historyButton.addEventListener("click", displayScoreHistory);

  // Close history modal
  domElements.closeHistoryBtn.addEventListener("click", closeHistoryModal);

  // Clear history button
  domElements.clearHistoryBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to clear all score history?")) {
      clearLocalStorage();
      displayScoreHistory();
    }
  });

  // Close validation modal
  domElements.closeValidationBtn.addEventListener("click", closeValidationModal);
  domElements.validationOkBtn.addEventListener("click", closeValidationModal);

  // Close modals when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === domElements.historyModal) {
      closeHistoryModal();
    }
    if (event.target === domElements.validationModal) {
      closeValidationModal();
    }
  });
});

// ============================================
// Utility Functions
// ============================================

/**
 * Logs game statistics to console
 */
function logGameStats() {
  console.log("=== Typing Speed Game Statistics ===");
  console.log("Current Level:", currentLevel);
  console.log("Current Score:", currentScore);
  console.log("Total Words:", totalWords);
  console.log("Game Active:", gameActive);
  console.log("Remaining Words:", currentWords.length);
  console.log("====================================");
}

/**
 * Exports game statistics
 * @returns {object} - Game statistics object
 */
function exportGameStats() {
  return {
    level: currentLevel,
    score: currentScore,
    total: totalWords,
    percentage: Math.round((currentScore / totalWords) * 100),
    gameActive: gameActive,
    remainingWords: currentWords.length,
    timestamp: new Date().toISOString()
  };
}
