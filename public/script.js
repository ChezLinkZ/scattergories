var prompts = {};
const container = $("#prompts-container");
const title = $("#title");
const timeLimit = 3 * 3600;
var timeLeft = timeLimit; // frames (at 60 fps, 3 mins)
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

fetch("data.json")
  .then(response => response.json())
  .then(data => {
    prompts = data;
    displayRandomLetter();
    setTimeout(() => {
      finishedChoosing = true;
      $("#start-button").css("opacity", 1)
    }, 1500);
  });

function startGame() {
  displayRandomCategory();
  blurElem.css("opacity", 0)
  $("#prompts").css("opacity", 1);
  title.css("opacity", 1)
  timeLeft = timeLimit;
  requestAnimationFrame(countDown);
}



function randomCategory() {
  const key = Object.keys(prompts)[Math.random() * Object.keys(prompts).length | 0];
  let prompt = prompts[key];
  var category = new Category(key, prompt);
  return category;
}

function displayPrompts(category) {
  container.empty();
  category.data.forEach(prompt => {
    const element = $("<span></span>");
    element.text(prompt);
    container.append(element);
  });
  title.text(category.title);
}

function displayRandomCategory() {
  const category = randomCategory();
  displayPrompts(category);
  return category;
}

function displayRandomLetter() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomIndex = Math.floor(Math.random() * letters.length);
  letter.text(letters[randomIndex]);
  if (!finishedChoosing) {
    requestAnimationFrame(displayRandomLetter);
  }
}

function countDown() {
  timeLeft--;
  updateTimer(timeLeft / timeLimit * 100)
  if (timeLeft > 0) {
    requestAnimationFrame(countDown);
  } else {
    $("#timer").empty();
    $("#timer").html("<span>Time's up!</span>");
    $("#reload-button").addClass("pulse");
  }
}