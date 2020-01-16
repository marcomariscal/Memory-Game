let cards = document.getElementsByClassName("card");
let startButton = document.querySelector(".start");
let counts = document.querySelector(".flipCounts");
let localStorage = window.localStorage;

let isFlippedCard = false;
let firstCard, secondCard;
let flipCounts = 0;
let lockGame = false;
let flippedCardCount = 0;

let flipCard = e => {
  if (lockGame) return;
  e.target.offsetParent.classList = "card flip";

  if (!isFlippedCard) {
    isFlippedCard = true;
    firstCard = e.target.offsetParent;
    return;
  }

  secondCard = e.target.offsetParent;
  if (firstCard === secondCard) return;
  isFlippedCard = false;
  flipCounts++;
  counts.innerText = `${flipCounts} flips!`;
  checkForMatch();
};

let checkForMatch = () => {
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    // prevent the cards from being clicked
    disableCards();
    flippedCardCount += 2;
    // check if we have matched all the cards and store the best score
    if (flippedCardCount === 12) {
      storeScore();
    }
    return;
  }
  unFlipCards();
};

let disableCards = () => {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
};

let unFlipCards = () => {
  lockGame = true;

  setTimeout(() => {
    firstCard.classList = "card";
    secondCard.classList = "card";
    lockGame = false;
  }, 1000);
};

let shuffleCards = () => {
  for (let card of cards) {
    card.classList = "card";
    let randomPosition = Math.floor(Math.random() * 12);
    card.style.order = randomPosition;
  }
};

let startGame = e => {
  e.preventDefault();
  // track the number of pairs of flips
  flipCounts = 0;
  // track the number of currently flipped cards
  flippedCardCount = 0;
  shuffleCards();
  for (let card of cards) {
    card.addEventListener("click", flipCard);
  }
  e.target.innerText = "Game Started!";
};

let storeScore = () => {
  let tempScore = flipCounts;
  let prevHighScore = parseFloat(localStorage.getItem("High Score"));

  // if there's no previous score in local storage, store the score
  if (!prevHighScore) {
    localStorage.setItem("High Score", tempScore);
    startButton.innerText = `your first score was ${tempScore} flips \n want to play again!`;
  } else if (tempScore < prevHighScore) {
    // check if the current score is the best score and replace in local storage
    localStorage.setItem("High Score", tempScore);
    startButton.innerText = `your new high score is ${tempScore} flips! \n want to play again?`;
  } else {
    startButton.innerText = `Yikes, couldn't beat your high score huh? \n Click here to play again!`;
  }
};

startButton.addEventListener("click", startGame);
