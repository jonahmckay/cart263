"use strict";

/********************************************************************

Happiness is Dependencies?
Jonah McKay

Project 1 for CART 263.
Exploring the existential nature of software dependencies

*********************************************************************/

$(document).ready(setup);

let basePackageName;
let basePackageDownloadStarted = false;
let packages = [];

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
  //Changes the text on the start page to reference the procedurally generated
  //base package name
  basePackageName = name;
  $(".xashName").text(name);
}

function downloadPackage(name)
{
  //Makes the download dialogue appear and start "downloading" the required
  //add-on/package

  let packageSize = 10 + Math.random()*20

  //TODO: Add random package size to package info, need to round down to
  //two decimals
  let packageInfo = `${name} ()`;

  let $packageLine = $("<div class='downloadedPackageLine'></div>");
  let $packageImage = $("<img class='downloadIcon' src='assets/images/xashlogo.png'/>");

  let $packageInfoBlock = $("<div class='downloadInfoBlock'></div>");
  let $downloadText = $("<div class='downloadText'></div>").text(packageInfo);
  let $downloadProgress = $("<div class='downloadProgressBar'></div>");
  let $installButton = $("<br/><button class='installPackageButton' onclick='installPackage()'>Install</button>");

  $downloadProgress.progressbar({ value: 0 });

  $installButton.attr('disabled', true);
  $downloadText.append($installButton);
  $packageInfoBlock.append($downloadText, $downloadProgress);

  $packageLine.append($packageImage, $packageInfoBlock);

  $("#downloadDialog").css("visibility", "visible");
  $("#downloadDialog").append($packageLine);

  //Start download progressbar
  window.requestAnimationFrame(function () { updateDownloadProgress($packageLine); });

}

function updateDownloadProgress($packageLine)
{
  //Updates download progressbar and allows install on completion
  if ($packageLine.find(".downloadProgressBar").progressbar("value") >= 100)
  {
    $packageLine.find(".installPackageButton").attr("disabled", false);
  }

  $packageLine.find(".downloadProgressBar").progressbar("value", $packageLine.find(".downloadProgressBar").progressbar("value")+0.25);
  window.requestAnimationFrame(function () { updateDownloadProgress($packageLine); });
}

function downloadBasePackage()
{
  //Download function that handles a few things particular to the starting package
  basePackageDownloadStarted = true;
  $("#xashDownloadButton").attr("disabled", true);

  return downloadPackage(basePackageName);
}


function setup() {
  console.log(generateBasePackageName());
  setBasePackageName(generateBasePackageName());
  $(".downloadProgressBar").progressbar({ value: 37 });
}
