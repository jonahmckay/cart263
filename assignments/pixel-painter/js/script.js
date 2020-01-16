"use strict";

/********************************************************************

Pixel Painter++
Jonah McKay

A simple pixel painting web application.

*********************************************************************/

//no magic strings!
let pixelDefaultColor = 'black'
let pixelActiveColor = 'white';

window.onload = setup;

function setup()
{
  console.log("hmm");

  for (let i = 0; i < 1000; i++)
  {
    let newPixel = document.createElement('div');
    newPixel.setAttribute('class', 'pixel');
    document.body.appendChild(newPixel);

    newPixel.addEventListener('mouseover', paint);
  }
}

function paint(e)
{
  let pixel = e.target;
  pixel.style.backgroundColor = pixelActiveColor;

  setTimeout(resetPixel, 1000, pixel);
}

function resetPixel(pixel)
{
  pixel.style.backgroundColor = pixelDefaultColor;
}
