"use strict";

const figureParts = document.querySelectorAll(".figure-part");
const wrongLetter = document.getElementById("wrong-letters");
const word = document.getElementById("word");
const popUp = document.getElementById("popup-container");
const message = document.getElementById("message");
const wordReveal = document.getElementById("word-reveal");
const button = document.getElementById("btn");
const buttonHint = document.getElementById("hint");
const div = document.querySelector(".hint");

const notification = document.getElementById("notification");
let selectedWord;
const words = [];
let wordGenerated = false;
async function loadWords() {
  //const response = await fetch("https://random-word-api.herokuapp.com/all");
  const res = await fetch("https://random-words-api.vercel.app/word");
  const data = await res.json();
  data.forEach((item) => {
    words.push(item.word);
  });
  wordGenerated = true;
}

async function getWord() {
  await loadWords();

  if (wordGenerated) {
    selectedWord =
      words[Math.trunc(Math.random() * words.length)].toLowerCase();
  }
}

getWord();

let correctLetters = [];
let wrongLetters = [];
let play = true;

function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

function updateWrongLetters() {
  wrongLetter.innerHTML = `
${wrongLetters.length > 0 ? "<p>Wrong Letters:</p>" : ""}
${wrongLetters.map((letter) => `<span>${letter}</span>`)}
`;
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });
  if (wrongLetters.length === figureParts.length) {
    message.textContent = "You Loose";
    wordReveal.textContent = `The word was:${selectedWord}`;
    popUp.style.display = "flex";
    play = false;
    wordGenerated = false;
  }
}

function display() {
  if (wordGenerated) {
    word.innerHTML = `
${selectedWord
  .split("")
  .map(
    (letter) =>
      `<span class="letter">${
        correctLetters.includes(letter) ? letter : "__"
      }</span>`
  )
  .join("")}
  `;
    let innerWord = word.innerText.replace(/[ \n \'_']/g, "");
    if (innerWord === selectedWord) {
      message.textContent = "Congratulation.You Won";
      wordReveal.textContent = "";
      popUp.style.display = "flex";
      play = false;
      wordGenerated = false;
    }
  }
}

window.addEventListener("keydown", (e) => {
  if (play && wordGenerated) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key.toLowerCase();

      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);

          display();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);

          updateWrongLetters();
        } else {
          showNotification();
        }
      }
    }
  }
});

button.addEventListener("click", () => {
  getWord();
  if (wordGenerated) {
    (correctLetters = []), (wrongLetters = []), display();
    updateWrongLetters();
    popUp.style.display = "none";
    play = true;
    div.textContent = "";
  }
});

buttonHint.addEventListener("click", async () => {
  if (wordGenerated) {
    const hint = await fetch(`https://random-words-api.vercel.app/word`);
    const res = await hint.json();
    const message = res[0].definition;
    div.textContent = message;
    console.log(selectedWord);
  }
});

display();
