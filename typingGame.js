"use strict";
import WORD_DICT from "./wordDict.js";

const wordContainer = document.getElementById("wordContainer");
const btnStart = document.querySelector(".btn--start");
const btnTryAgain = document.querySelector(".btn--tryagain");
const userInputDisplay = document.getElementById("displayUserInput");
const scoreCounter = document.querySelector(".score");
const highScoreCounter = document.querySelector(".highscore");
const gameOverCounter = document.querySelector(".gameOverScore");

let WORD_QUEUE = [];
let moveInterval;
let currentWord = ""; //The word that is currently on the screen
let currentScore,
  highScore = 0;
let gameStatus = {
  isPlaying: false,
  isGameOver: false,

  start: function () {
    this.isPlaying = true;
    this.isGameOver = false;
  },

  gameOver: function () {
    this.isPlaying = false;
    this.isGameOver = true;
  },

  reset: function () {
    this.isPlaying = false;
    this.isGameOver = false;
  },
};

btnStart.addEventListener("click", _init_);
document.addEventListener("keydown", handleKeyDown);
btnTryAgain.addEventListener("click", tryAgain);

function _init_() {
  btnStart.classList.add("hidden");
  WORD_QUEUE = [];
  currentScore = 0;
  scoreCounter.textContent = 0;
  gameStatus.start();
  wordContainer.style.display = "block";
  userInputDisplay.style.display = "block";
  document.addEventListener("keydown", handleKeyDown);
  pickWord();
}

function gameOver() {
  gameStatus.gameOver();
  if (highScore < currentScore) {
    highScore = currentScore;
    highScoreCounter.textContent = highScore;
  }

  userInputDisplay.style.display = "none";
  document.getElementById("gameOverContainer").style.display = "flex";
  gameOverCounter.textContent = currentScore;
  console.log(`Game Over! Score : ${currentScore}`);
  document.removeEventListener("keydown", handleKeyDown);
}

function tryAgain() {
  document.getElementById("gameOverContainer").style.display = "none";
  _init_();
}

/*
Handle random english word generation 
*/
function pickWord() {
  clearWordMovement();
  if (gameStatus.isGameOver) return;

  wordContainer.style.left = "0%";
  const randomPosition = Math.trunc(Math.random() * 70) + 1;
  const randomWordIndex = Math.trunc(Math.random() * WORD_DICT.length);
  wordContainer.style.top = randomPosition + "%";
  currentWord = WORD_DICT[randomWordIndex];
  WORD_QUEUE.push(WORD_DICT[randomWordIndex]);
  wordContainer.textContent = currentWord;

  let currentPosition = parseInt(wordContainer.style.left);
  moveInterval = setInterval(function () {
    currentPosition += 0.1;
    wordContainer.style.left = currentPosition + "%";
    if (currentPosition >= 100) {
      clearWordMovement();
      if (!isEmpty(WORD_QUEUE)) {
        gameOver();
      }
      pickWord();
    }
  }, 1);
}

function handleKeyDown(event) {
  if (!gameStatus.isPlaying) return;
  const regex = /^[a-zA-z]$/;

  if (event.key === "Backspace")
    userInputDisplay.textContent = userInputDisplay.textContent.slice(0, -1);
  else if (
    event.key === "Enter" &&
    userInputDisplay.textContent === currentWord &&
    WORD_QUEUE.includes(currentWord)
  ) {
    userInputDisplay.textContent = "";
    currentScore++;
    scoreCounter.textContent = currentScore;
    WORD_QUEUE.pop();
    pickWord();
  } else if (regex.test(event.key)) userInputDisplay.textContent += event.key;
}

function clearWordMovement() {
  if (moveInterval) clearInterval(moveInterval);
}

function isEmpty(array) {
  return array.length == 0;
}
