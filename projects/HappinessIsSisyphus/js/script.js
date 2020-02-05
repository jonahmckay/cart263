"use strict";

/********************************************************************

Happiness is Dependencies?
Jonah McKay

Project 1 for CART 263.
Exploring the existential nature of software dependencies

*********************************************************************/

$(document).ready(setup);

let basePackageName;

function generateBasePackageName()
{
  //Function for generating a package name that is
  //a parody of Adobe Flash Player.
  let companyNames = ["Clay", "Adele", "Brick", "Amoeba", "Adage", "Agape", "Addition"];
  let conventionNames = ["Mash", "Hash", "Gash", "Bash", "Nash", "Rash"]
  let utilityNames = ["Player"]

  return generatePackageName({
    companyNames: companyNames,
    conventionNames: conventionNames,
    utilityNames: utilityNames
  })
}

function generateSubPackageName()
{
  //Function for generating a package name that doesn't necessarally need to be
  //a direct parody of Adobe Flash Player.
  let companyNames = ["Clay", "Adele", "Brick", "Amoeba", "Adage", "Agape", "Addition"];
  let conventionNames = ["Mash", "Hash", "Gash", "Bash", "Nash", "Rash"]
  let utilityNames = ["Player", "Sorter", "Parser", "Mediator"]

  return generatePackageName({
    companyNames: companyNames,
    conventionNames: conventionNames,
    utilityNames: utilityNames
  })
}

function generatePackageName(names)
{
  //The names paramater ought to be an object literal that contains
  //non-empty (//TODO: add error handler?) string arrays of companyNames,
  //conventionNames, and utilityNames.

  let companyChosen = names.companyNames[Math.floor(Math.random() * names.companyNames.length)];
  let conventionChosen = names.conventionNames[Math.floor(Math.random() * names.conventionNames.length)];
  let utilityChosen = names.utilityNames[Math.floor(Math.random() * names.utilityNames.length)];

  return `${companyChosen} ${conventionChosen} ${utilityChosen}`;
}

function setBasePackageName(name)
{
  basePackageName = name;
  $(".xashName").text(name);
}
function setup() {
  console.log(generateBasePackageName());
  setBasePackageName(generateBasePackageName());
}
