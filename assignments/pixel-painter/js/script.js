"use strict";

/********************************************************************

Pixel Painter++
Jonah McKay

A simple pixel painting web application.

*********************************************************************/

//no magic strings!
let pixelDefaultColor = 'black'

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

  let r = Math.random()*255;
  let g = Math.random()*255;
  let b = Math.random()*255;

  pixel.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

  setTimeout(resetPixel, 1000, pixel);
}

function resetPixel(pixel)
{
  pixel.style.backgroundColor = pixelDefaultColor;
}
