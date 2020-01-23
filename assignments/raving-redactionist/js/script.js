"use strict";

$(document).ready(setup);

const REVEAL_CHANCE = 0.1;
const UPDATE_INTERVAL = 500;

let $redactedText = undefined;

let secretsFound = 0;
let secretsTotal = undefined;

function setup()
{
  setInterval(update, UPDATE_INTERVAL);
  $redactedText = $(".redacted");
  $redactedText.on("click", spanClicked);
  $(".secret").on("mouseover", secretHover);

  secretsTotal = $(".secret").length;
  $("#totalSecrets").text(secretsTotal);

}

function update()
{
  $redactedText.each(updateSpan);
}

function updateSpan()
{
  if ($(".redacted").length == 0)
  {
    endGame();
  }

  if (Math.random() < REVEAL_CHANCE)
  {
    $(this).attr("class", "revealed");
  }
}

function spanClicked()
{
  $(this).attr("class", "redacted");
}

function secretHover()
{
  $(this).addClass("found");
  $(this).off("mouseover");
  secretsFound++;
  $("#foundSecrets").text(secretsFound);
}

function endGame()
{

}
