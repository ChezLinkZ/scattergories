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

function getRandomItems(array, count = 10) {
  if (array.length <= count) {
    return array; // Return the entire array if it has fewer items than the count
  }

  const shuffled = [...array].sort(() => Math.random() - 0.5); // Shuffle a copy of the array
  return shuffled.slice(0, count); // Return the first `count` items
}



function randomCategory() {
  let prompt = getRandomItems(prompts);
  console.log(prompt)
  return prompt;
}

function displayPrompts(category) {
  container.empty();
  console.log(category)
  category.forEach(prompt => {
    console.log(prompt)
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
