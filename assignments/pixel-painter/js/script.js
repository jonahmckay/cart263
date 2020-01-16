"use strict";

/********************************************************************

Pixel Painter++
Jonah McKay

A simple pixel painting web application.

*********************************************************************/

//no magic strings!
let pixelDefaultColor = 'black'

let rotation = 0;
let currentKey = "";

window.onload = setup;

document.addEventListener('keydown', rotate);
document.addEventListener('keydown', typed);

function setup()
{
  console.log("hmm");

  for (let i = 0; i < 1000; i++)
  {
    let newPixel = document.createElement('div');
    newPixel.setAttribute('class', 'pixel');
    document.body.appendChild(newPixel);

    newPixel.addEventListener('mouseover', paint);
    newPixel.addEventListener('mouseover', addText);
    newPixel.addEventListener('click', removePixel);
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

function removePixel(e)
{
  e.target.style.opacity = "0";
}

function rotate(e)
{

  if (e.keyCode !== 37 && e.keyCode !== 39)
  {
    return false;
  }

  let pixels = document.getElementsByClassName('pixel');

  if (e.keyCode === 37)
  {
    rotation += -1;
  }
  else if (e.keyCode === 39)
  {
    rotation += 1;
  }

  for (let i = 0; i < pixels.length; i++)
  {
    pixels[i].style.transform = `rotate(${rotation}deg)`;
  }
}

function typed(e)
{
  currentKey = e.keyCode;
}

function addText(e)
{
  e.target.innerHTML += String.fromCharCode(currentKey);
}
