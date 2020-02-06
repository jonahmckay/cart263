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

let terms = `Let's be honest, you'll agree to whatever's written here because you need this software.

The terms and conditions of using this software depend on the day of the week.
This is legally binding, somehow. We didn't ask a lawyer,
but we did ask one of our devs who knows a lawyer.

ON MONDAYS:
You will only use this software while your computer's CPU
is roughly 5 degrees Celsius from overheating. Luckily our program
is so poorly written that this should not be an issue.

ON TUESDAYS:
You will not use this software, unless you are using it.

ON WEDNESDAYS:
You must disconnect your computer from the Internet before hand.
This isn't strictly a requirement, it's just that Wednesdays are when we push
new updates and you've gotten too used to the way it is now to
deal with any changes, dammit.

ON THURSDAYS:
No terms and conditions on Thursdays. Go wild! Redistribute!
(If you do, it'll literally double our userbase)

on fridays:
typing upper case characters will result in the voiding of your usage license.

ON SATURDAYS:
Do not

ON SUNDAYS:
You may participate in our Voluntary Shady Data Collection program!
To participate, please send files on your computer (preferably with personal
or banking data) to our e-mail.

SPECIAL!!! ON FEBRUARY 28th!!!:
No changes but we like leap days :)`;

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

  $packageLine.find(".downloadProgressBar").progressbar("value", $packageLine.find(".downloadProgressBar").progressbar("value")+2);
  window.requestAnimationFrame(function () { updateDownloadProgress($packageLine); });
}

function downloadBasePackage()
{
  //Download function that handles a few things particular to the starting package
  basePackageDownloadStarted = true;
  $("#xashDownloadButton").attr("disabled", true);

  return downloadPackage(basePackageName);
}

function installPackage()
{
  $(".installPackageButton").attr('disabled', true);
  let $installDialog = $("<div id='installDialog'></div>");


  let $installTabsContainer = $("<div id='installTabs'></div>")
  let $installTabs = $("<ul></ul>");
  $installTabs.append($("<li><a href='#installIntro'>Start</a></li>"));
  $installTabs.append($("<li><a href='#installTerms'>Terms</a></li>"));
  $installTabs.append($("<li><a href='#installFinalize'>Finish</a></li>"));

  let $installIntroTab = $("<div id='installIntro'>Start</div>");
  let $installTermsTab = $("<div id='installTerms'></br></div>");
  let $installFinalizeTab = $("<div id='installFinalize'>Finish</div>");

  $installTabsContainer.append($installTabs);

  $installDialog.append($installTabsContainer);



  $installTabs.append($installIntroTab);

  let $termsHeader = $("<h3>Terms and Conditions</h3>");
  let $termsText = $("<p class='termsText'></p>").css('white-space', 'pre').text(terms);
  $installTermsTab.append($termsHeader);
  $installTermsTab.append($termsText);
  $installTabs.append($installTermsTab);
  $installTabs.append($installFinalizeTab);

  $('body').append($installDialog);
  $installTabsContainer.tabs({active: 0});

  $installDialog.dialog();


}


function setup() {
  setBasePackageName(generateBasePackageName());
}
