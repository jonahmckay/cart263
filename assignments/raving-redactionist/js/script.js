"use strict";

$(document).ready(setup);

let $spans = undefined;

function setup()

{
  $spans = $("span");
  setInterval(update, 500);
  $spans.each(updateSpan).on("click", spanClicked);
}

function update()
{
  $spans.each(updateSpan);
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
