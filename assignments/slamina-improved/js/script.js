"use strict";

/********************************************************************

Title of Project
Author Name

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

*********************************************************************/

const NUM_OPTIONS = 5;

let buttons = [];

let $correctButton;

let score = 0;

let commands = {
  //Make a guess that the animal is *tag, as though you pressed a button
  //with text *tag.
  "i think it is *tag": handleGuess,

  //Gives up, starts new round and sets score to 0.
  "i give up": giveUp,

  //Says the answer backwards.
  "say it again": function () { sayBackwards($correctButton.text()); }
}

let animals = ["aardvark",
      "alligator",
      "alpaca",
      "antelope",
      "ape",
      "armadillo",
      "baboon",
      "badger",
      "bat",
      "bear",
      "beaver",
      "bison",
      "boar",
      "buffalo",
      "bull",
      "camel",
      "canary",
      "capybara",
      "cat",
      "chameleon",
      "cheetah",
      "chimpanzee",
      "chinchilla",
      "chipmunk",
      "cougar",
      "cow",
      "coyote",
      "crocodile",
      "crow",
      "deer",
      "dingo",
      "dog",
      "donkey",
      "dromedary",
      "elephant",
      "elk",
      "ewe",
      "ferret",
      "finch",
      "fish",
      "fox",
      "frog",
      "gazelle",
      "gila monster",
      "giraffe",
      "gnu",
      "goat",
      "gopher",
      "gorilla",
      "grizzly bear",
      "ground hog",
      "guinea pig",
      "hamster",
      "hedgehog",
      "hippopotamus",
      "hog",
      "horse",
      "hyena",
      "ibex",
      "iguana",
      "impala",
      "jackal",
      "jaguar",
      "kangaroo",
      "koala",
      "lamb",
      "lemur",
      "leopard",
      "lion",
      "lizard",
      "llama",
      "lynx",
      "mandrill",
      "marmoset",
      "mink",
      "mole",
      "mongoose",
      "monkey",
      "moose",
      "mountain goat",
      "mouse",
      "mule",
      "muskrat",
      "mustang",
      "mynah bird",
      "newt",
      "ocelot",
      "opossum",
      "orangutan",
      "oryx",
      "otter",
      "ox",
      "panda",
      "panther",
      "parakeet",
      "parrot",
      "pig",
      "platypus",
      "polar bear",
      "porcupine",
      "porpoise",
      "prairie dog",
      "puma",
      "rabbit",
      "raccoon",
      "ram",
      "rat",
      "reindeer",
      "reptile",
      "rhinoceros",
      "salamander",
      "seal",
      "sheep",
      "shrew",
      "silver fox",
      "skunk",
      "sloth",
      "snake",
      "squirrel",
      "tapir",
      "tiger",
      "toad",
      "turtle",
      "walrus",
      "warthog",
      "weasel",
      "whale",
      "wildcat",
      "wolf",
      "wolverine",
      "wombat",
      "woodchuck",
      "yak",
      "zebra"];


$(document).ready(setup);

function setup() {

  if (annyang)
  {
    annyang.addCommands(commands);

    annyang.start();
  }

  newRound();
}

function getRandomElement(array)
{
  return array[Math.floor(Math.random() * array.length)];
}

function addButton(label)
{
  //Function that adds a guess button,
  //including text and event handlers.

  let $button = $(`<button></button>`);

  $button.addClass("guess");
  $button.text(label);
  $button.button();
  $button.on('click', handleButtonGuess);

  $("#guesses").append($button);

  return $button;
}

function newRound()
{
  //Starts a new round and generates a new set of guesses and
  //correct answer.
  buttons = [];

  for (let i = 0; i < NUM_OPTIONS; i++)
  {
    let label = getRandomElement(animals);
    let newButton = addButton(label);
    buttons.push(newButton);
  }
  $correctButton = getRandomElement(buttons);

  sayBackwards($correctButton.text());
}

function handleButtonGuess()
{
  //Function to handle guesses from buttons
  handleGuess($(this).text());
}

function handleGuess(guess)
{
  //Compares the guess text
  //to the correct answer, and either progresses or fails
  //appropriately. If the guess matches NO valid answers,
  //then simply repeat the word without resetting score.
  let validAnswer = false;
  for (var i = 0; i < buttons.length; i++)
  {
    if (guess === buttons[i].text())
    {
      validAnswer = true;
      break;
    }
  }

  //If the answer is INVALID, discard it and return out of the function.
  if (!validAnswer)
  {
      sayBackwards($correctButton.text());
      return;
  }

  if (guess === $correctButton.text())
  {
    $(".guess").remove();
    setTimeout(newRound, 500);
    setScore(score+1);
  }
  else
  {
    sayBackwards($correctButton.text());
    setScore(0);

    //Find buttons with the same text as the
    //guess, and then shake them in disapproval
    //on failure.
    for (let i = 0; i < buttons.length; i++)
    {
      if (buttons[i].text() === guess)
      {
        buttons[i].effect("shake");
      }
    }

  }
}

function setScore(newScore)
{
  //Sets the score and updates the score counter.
  score = newScore;
  $(".score").text(score);
}

function sayBackwards(text)
{
  //Says the correct answer backwards using text to speech, with some
  //random effects.
  let backwardsText = text.split('').reverse().join('');
  let options = {rate: 0.05+(Math.random()*0.95), pitch: 0.05+(Math.random()*0.95)};
  responsiveVoice.speak(backwardsText, "UK English Male", options);
}

function giveUp()
{
  //Gives up on the current round, shakes the correct button
  //and then resets the score and starts a new round.
  $correctButton.effect("shake", {
    finish: function () { setScore(0); newRound(); }
  }
  );
}
