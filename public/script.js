var prompts = {};
var localStorage = window.localStorage;
const container = $("#prompts-container");
const title = $("#title");
const time = JSON.parse(window.localStorage.time) || 2;
const timeLimit = time * 3600;
if (!localStorage.time) {
  localStorage.time = 2;
}
var timeLeft = timeLimit; // frames (at 60 fps, {timeLimit} minutes)
const timerBar = $("#timer-bar");
const updateTimer = (width) => $("#timer-bar").css("width", width + "%");
const letter = $("#letter");
const blurElem = $("#middle-blur");
var finishedChoosing = false;

class Category {
  constructor(title, data) {
    this.title = title;
    this.data = data;
  }
}

$(document).ready(function (e) {
  $(".time-input").each(function (e) {
    if ($(this).text() == localStorage.time) {
      $(this).css({
        "background-color": "#fff",
        color: "#000",
      });
    }
  });
});

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    prompts = data;
    displayRandomLetter();
    setTimeout(() => {
      finishedChoosing = true;
      $("#start-button").css("opacity", 1);
    }, 1500);
  });

function startGame() {
  displayRandomCategory();
  blurElem.css("opacity", 0);
  $("#prompts").css("opacity", 1);
  $("#timer").css("opacity", 1);
  title.css("opacity", 1);
  timeLeft = timeLimit;
  requestAnimationFrame(countDown);
}

function getRandomItems(array, count = 10) {
  if (array.length <= count) {
    return array; // Return the entire array if it has fewer items than the count
  }

  const shuffled = [...array].sort(() => Math.random() - 0.5); // Shuffle a copy of the array
  return shuffled.slice(0, count); // Return the first `count` items
}

function randomCategory() {
  let prompt = getRandomItems(prompts);
  console.log(prompt);
  return prompt;
}

function displayPrompts(category) {
  container.empty();
  console.log(category);
  category.forEach((prompt) => {
    console.log(prompt);
    const element = $("<span></span>");
    element.text(prompt);
    container.append(element);
  });
  title.text("Scattergories");
}

function displayRandomCategory() {
  const category = randomCategory();
  displayPrompts(category);
  return category;
}

function displayRandomLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomIndex = Math.floor(Math.random() * letters.length);
  letter.text(letters[randomIndex]);
  if (!finishedChoosing) {
    requestAnimationFrame(displayRandomLetter);
  }
}

function countDown() {
  timeLeft--;
  updateTimer((timeLeft / timeLimit) * 100);
  if (timeLeft > 0) {
    requestAnimationFrame(countDown);
  } else {
    $("#timer").empty();
    $("#timer").html("<span>Time's up!</span>");
    $("#reload-button").addClass("pulse");
  }
}

function setTime(minutes) {
  localStorage.setItem("time", JSON.stringify(minutes));
  console.log(JSON.stringify(minutes));
  window.location.reload();
}

$(".time-input").on("click", function (e) {
  const time = JSON.parse($(this).text());
  console.log(time);
  setTime(time);
});
