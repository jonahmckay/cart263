"use strict";

/********************************************************************

Fleece
Made by Jonah McKay

Fleece is a procedurally generated e-commerce site "selling"
anything and everything on the Internet.

Made for Project 2, Something is Wrong on the Internet for
CART263.
https://github.com/pippinbarr/cart263-2020

While unintentional, it is possible that given the corpora
this project draws from (planning to use the results of a
search engines image search), the site may display shocking
or offensive content. Potential content warning for anything
and everything scraped by search engines on the Internet.

*********************************************************************/

const IMAGES_PER_QUERY = 10;
const SHOP_ITEM_SIZE = 200;

$(document).ready(setup);

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

function addItemtoPage(imageUrl, name)
{
  //Adds a shop item to the page using the imageurl given as well as the name
  //of the item.
  let $shopItem = $("<div class='shopItem'></div>");

  let $shopImage = $("<div class='shopItemImage'></div>");
  $shopImage.css("background-image", `url('${generateThumbnailLink(SHOP_ITEM_SIZE, imageUrl)}')`);

  let $shopCaption = $("<div class='shopItemCaption'>");
  $shopCaption.append(name);

  $shopItem.append($shopImage);
  $shopItem.append($shopCaption);

  $('#shopContent').append($shopItem);
  //$('body').append(`<img src=${generateThumbnailLink(400, imageUrl)}></img>`);
}

function addRandomItemToPage()
{
  //Creates a random item, then adds it to the page.
  sendRandomQuery(addItemtoPage);
}

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

function setup() {
  for (let i = 0; i < 10; i++)
  {
    addRandomItemToPage();
  }
}
