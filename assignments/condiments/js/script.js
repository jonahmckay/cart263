"use strict";

/********************************************************************

Condiments Improved
Jonah McKay

Creates descrptions comparing condiments to cats in rooms

*********************************************************************/

const VOWELS = "aeiou";

let data;

$(document).ready(setup);

function setup() {
  $.getJSON("data/data.json")
  .done(dataLoaded)
  .fail(dataError);

  $("html").click(function () { createDescription(); });
}

function dataLoaded(dataGotten)
{
  data = dataGotten;
  createDescription();
}

function dataError(request, textStatus, error)
{
  console.error(error);
}

function createDescription()
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

  let randomPlanet = getRandomElement(data.minor_planets).split(" ")[1];

  let randomChemical = getRandomElement(data.chemicals);

  let description = `${randomCondiment} ${verb} like a ${randomCat} in a ${randomRoom} located on ${randomPlanet} and certainly does NOT have a hint of ${randomChemical}`;

  description = fixArticles(description);
  $("body").empty();
  $("body").append(`<p>${description}</p>`);
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

function fixArticles(string)
{
  //Regular expression: matches text that has an "a" either at the start of the
  //string or with a space preceeding it, followed by a space, followed by any
  //vowel [aeiou], case insensitive.
  //Matches "a orange", " a orange"
  //Fails "area orange", "a horse"

  let articleRe = /(\Aa| a) [aeiou]/i;

  let stringFixed = false;

  while (!stringFixed)
 {
    let articlePosition = string.search(articleRe);
    if (articlePosition !== -1)
    {
      //Turns an "a" or "A" into an "an" or "An"
      console.log(articlePosition);
      let cachedString;
      cachedString = string.slice(0, articlePosition+2) + "n" + string.slice(articlePosition+2);
      string = cachedString;
      console.log(string);
    }
    else
    {
      stringFixed = true;
    }
 }

  return string;
}
