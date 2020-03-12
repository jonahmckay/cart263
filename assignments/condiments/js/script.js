"use strict";

/********************************************************************

Condiments Improved
Jonah McKay

Creates descrptions comparing condiments to cats in rooms

*********************************************************************/

$(document).ready(setup);


function setup() {
  $.getJSON("data/data.json")
  .done(dataLoaded)
  .fail(dataError);
}

function dataLoaded(data)
{
  console.log(data);

  let randomCondiment = getRandomElement(data.condiments);
  console.log(randomCondiment);

  let verb = "is";

  if (randomCondiment.charAt(randomCondiment.length-1) === "s")
  {
    verb = "are";
  }

  let randomCat = getRandomElement(data.cats);
  console.error(randomCat);

  let randomRoom = getRandomElement(data.rooms);
  console.error(randomRoom);

  let description = `${randomCondiment} ${verb} like a ${randomCat} in a ${randomRoom}`;

  $("body").append(description);
}

function dataError(request, textStatus, error)
{
  console.error(error);
}

function getRandomElement(array)
{
  let element;
  if (array.length > 0)
  {
    element = array[Math.floor(Math.random()*array.length)];
  }
  else
  {
    console.error("getRandomElement: array length <= 0");
  }
  return element;
}
