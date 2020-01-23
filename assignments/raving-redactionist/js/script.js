"use strict";

const REVEAL_CHANCE = 0.1;
const UPDATE_INTERVAL = 500;

let $redactedText = undefined;

let secretsFound = 0;
let secretsTotal = undefined;

$(document).ready(setup);

//Creates event handlers, defines $redactedText, and sets the totalSecrets variable
//in code and in text.
//Technically the secretsTotal variable is pointless currently, although it
//could be use to check when all secrets are revealed (possible win condition)
function setup()
{
  setInterval(update, UPDATE_INTERVAL);
  $redactedText = $(".redacted");
  $redactedText.on("click", redactedTextClicked);
  $(".secret").on("mouseover", secretHover);

  secretsTotal = $(".secret").length;
  $("#totalSecrets").text(secretsTotal);

}

//Global update function. Checks if game over and does a redacted text tick to
//randomly reveal some.
function update()
{
  if ($(".redacted").length == 0)
  {
    gameOver();
  }

  $redactedText.each(updateRedactedText);
}

//A tick for each piece of redacted text: currently a chance to reveal.
function updateRedactedText()
{
  if (Math.random() < REVEAL_CHANCE)
  {
    //Sets the class to revealed (Why use .attr() instead of addClass/removeClass?
    //My excuse is that it was the first option I found, but my justification is that
    //it ensures that the span has only one class, which could cause less bugs down
    //the road from possibly forgetting to remove a class. Arguably, it's less
    //legible/explicit than addClass and removeClass.)

    $(this).attr("class", "revealed");
  }
}

//Event function for clicking on a redacted text (currently reveals the text)
function redactedTextClicked()
{
  $(this).attr("class", "redacted");
}

//Event function for hovering over a piece of secret text.
function secretHover()
{
  //add found class and event listener
  $(this).addClass("found");
  $(this).off("mouseover");

  //increment secrets found and update score
  secretsFound++;
  $("#foundSecrets").text(secretsFound);
}

//Function called when the game ends in a loss.
function gameOver()
{
  //change style
  $("body").addClass("disabledGame");

  //remove event listeners
  $(".secret").off("mouseover");
  $(".revealed").off("click");
}
