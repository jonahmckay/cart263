"use strict";

$(document).ready(setup);

let $redactedText = undefined;

let secretsFound = 0;
let secretsTotal = undefined;

function setup()

{
  $redactedText = $(".redacted");
  setInterval(update, 500);
  $redactedText.each(updateSpan).on("click", spanClicked);
  secretsTotal = $(".secret").length;
  $("#totalSecrets").text(secretsTotal);
}

function update()
{
  $redactedText.each(updateSpan);
}

function updateSpan()
{
  if (Math.random() < 0.1)
  {
    $(this).attr("class", "revealed");
  }

}

function spanClicked()
{
  $(this).attr("class", "redacted");
}
