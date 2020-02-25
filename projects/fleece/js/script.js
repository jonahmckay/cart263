"use strict";

/********************************************************************

Fleece
Made by Jonah McKay

Fleece is a procedurally generated e-commerce site "selling"
anything and everything on the Internet.

Made for Project 2, Something is Wrong on the Internet for
CART263.
https://github.com/pippinbarr/cart263-2020


While unintentional, it is possible given that because
this project draws from Wikimedia Commons' image search
the site may display shocking or offensive content.
Potential content warning for any image on
on Wikimedia Commons.
https://commons.wikimedia.org/wiki/Commons:Project_scope#Censorship

*********************************************************************/

const IMAGES_PER_QUERY = 50;
const SHOP_ITEM_SIZE = 200;
const PAGE_BOTTOM_THRESHOLD = 200;

//list of items in the shop, represented by object literals generated in
//addItemToPage.
let shopItems = [];

//used by pageScrollCheck to avoid calling addRandomItemToPageUntilBottom
//if it's already running
let generatingItems = false;

//On a scale of 0.5 to 6.5, declares how pleased the narrator is with your
//actions. Affects what they say
let narratorAttitude = 3.5;

//Used to track how likely the narrator is to quip.
let ticksSinceLastNarratorQuip = 0;

let baseQuipChance = -0.5;
let tickQuipChanceModifier = 0.045;

//Used to determine how quickly the narrator becomes angry with you.
let attitudeDeltaPerTick = -0.02

//Used to determine how frequently the narrator will update.
let narratorTickInterval = 1000;

let narratorSynth = window.speechSynthesis;

$(document).ready(setup);

// -----------
// SHOP ITEM CODE
// -----------

function generateThumbnailLink(size, url)
{
  //Generates a wikimedia thumbnail link based on the URL
  //given and the size provided.
  //Not exactly future proof given that it relies on the way
  //Wikimedia Commons stores its images internally, but
  //I could find no way of doing this through their API.

  //Splits the URL string into its subdomains.
  let splitString = url.split("/");

  //Search the string for the commons subdomain, and then append
  // the /thumb domain to it.
  for (let i = 0; i < splitString.length; i++)
  {
    if (splitString[i] === "commons")
    {
      splitString[i] =  "commons/thumb";
    }
  }

  //Gets the filename of the image
  let fileName = splitString[splitString.length-1];

  //Generates the thumbnail filename based on the filename of the image.
  //It is always "{thumbnailSize}px-{fileName}".
  let thumbnailName = `${size}px-${fileName}`;

  //Push the thumbnailName to the domains array, putting it at the end
  //past the filename component.
  splitString.push(thumbnailName);

  //Reconstruct the URL.
  let newUrl = splitString.join("/");

  //Return the URL.
  return newUrl;
}

function getImageFromQuery(callback, query)
{
  //Presently uses the Wikimedia Commons image search API.
  //Code based on https://codesnippet.io/wikipedia-api-tutorial/
  //and wikimedia search query based on
  //https://stackoverflow.com/a/52005541

  let xhr = new XMLHttpRequest();

  //Generates an image search query using a template
  let url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${query}%20filetype:image&gsrlimit=${IMAGES_PER_QUERY}&prop=imageinfo&iiprop=url|mime|thumbmime&format=json&origin=*`

  xhr.open('GET', url, true);

  // Once request has loaded...
  xhr.onload = function() {
      // Parse the request into JSON
      let data = JSON.parse(this.response);

      //Choose a random image from those returned in the query.
      let imageChosen = data.query.pages[Object.keys(data.query.pages)[Math.floor(Math.random()*Object.keys(data.query.pages).length)]].imageinfo[0].url;

      //Runs the callback function provided with the file URL provided as the
      //first argument, and the query used as the second.
      callback(imageChosen, query);
  }
  // Send request to the server asynchronously
  xhr.send();
}

function sendRandomQuery(callback)
{
  //get random common word TODO: make this more complicated, only a placeholder!
  //Words lists are stored in words.js
  let query = common.commonWords[Math.floor(Math.random()*common.commonWords.length)];
  getImageFromQuery(callback, query)
}

function addItemToPage(imageUrl, name)
{
  //Adds a shop item to the page using the imageurl given as well as the name
  //of the item. Also adds the item to the shopItems array.
  let $shopItem = $("<div class='shopItem'></div>");

  let $shopImage = $("<div class='shopItemImage'></div>");
  $shopImage.css("background-image", `url('${generateThumbnailLink(SHOP_ITEM_SIZE, imageUrl)}')`);

  let $shopCaption = $("<div class='shopItemCaption'>");
  $shopCaption.append(name);

  $shopItem.append($shopImage);
  $shopItem.append($shopCaption);

  $('#shopContent').append($shopItem);

  shopItems.push({
    imageUrl: imageUrl,
    itemName: name
  });
}

function pageBottomCheck(callback)
{
  //Calls a function when close to the bottom of the page.
  //Code modified from https://stackoverflow.com/a/12677599
  if ($(window).scrollTop() + $(window).height() > $(document).height() - PAGE_BOTTOM_THRESHOLD)
  {
    callback();
  }
  else
  {
    generatingItems = false;
  }
}

function addItemToPageUntilBottom(imageUrl, name)
{
  //Part of a recursive function that generates items until the page bottom is
  //reached.
  generatingItems = true;
  addItemToPage(imageUrl, name);
  pageBottomCheck(addRandomItemToPageUntilBottom);
}

function addRandomItemToPage()
{
  //Creates a random item, then adds it to the page.
  sendRandomQuery(addItemToPage);
}

function addRandomItemToPageUntilBottom()
{
  //Creates a random item, then adds it to the page. Repeats until there's enough
  //content to create the illusion of endlessness.

  //This is a bit of a confusing function (yay callbacks!) but the gist of it is:
  //sendRandomQuery goes to getImageFromQuery, which runs its callback,
  //addItemToPageUntilBottom, then that performs pageBottomCheck, which if it
  //detects the page is still too small, runs addRandomItemToPageUntilBottom
  //again.
  generatingItems = true;
  sendRandomQuery(addItemToPageUntilBottom);
}

// -----------
// SPEECH CODE
// -----------

function narratorSay(text)
{
  text = text.replace("$RECENT_ITEM", shopItems[shopItems.length-1].itemName);

  //responsiveVoice.speak(text, "UK English Male");
  let utterance = new SpeechSynthesisUtterance(text);

  narratorSynth.speak(utterance);
}

function narratorQuip()
{
  let roundedAttitude = Math.round(narratorAttitude);
  if (roundedAttitude < 1)
  {
    roundedAttitude = 1;
  }
  else if (roundedAttitude > 6)
  {
    roundedAttitude = 6;
  }

  let quipSelected = NARRATOR_DIALOGUE[`relation_${roundedAttitude}`][Math.floor(Math.random()*NARRATOR_DIALOGUE[`relation_${roundedAttitude}`].length)];
  narratorSay(quipSelected);
}

function narratorTick()
{
  if (Math.random() < baseQuipChance+(ticksSinceLastNarratorQuip*tickQuipChanceModifier))
  {
    narratorQuip();
    ticksSinceLastNarratorQuip = 0;
  }
  else
  {
    ticksSinceLastNarratorQuip++;
  }
  narratorAttitude += attitudeDeltaPerTick;
}

// -----------
// SETUP CODE
// -----------

function setup() {
  $(window).scroll(function() { pageBottomCheck(addRandomItemToPageUntilBottom) });
  addRandomItemToPageUntilBottom();

  setInterval(narratorTick, narratorTickInterval);
}
