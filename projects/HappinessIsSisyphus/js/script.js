"use strict";

/********************************************************************

Happiness is Dependencies?
Jonah McKay

Project 1 for CART 263.
Exploring the existential nature of software dependencies

*********************************************************************/

$(document).ready(setup);

const MIN_FEATURES = 5;
const MAX_FEATURES = 8;
const DOWNLOAD_SPEED = 1;
const FINALIZE_SPEED = 0.25;
const LOGO_COUNT = 5;

let basePackageName;
let basePackageDownloadStarted = false;
let currentPackageName;
let currentInstallWindow;

let terms = `Let's be honest, you'll agree to whatever's written here because you need this software.

The terms and conditions of using this software depend on the day of the week.
This is legally binding, somehow. We didn't ask a lawyer,
but we did ask one of our devs who knows a lawyer.

ON MONDAYS:
You may only use this software while your computer's CPU
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

function generateFeature()
{
  let verbs = ["Accelerate", "Verbify", "Delete", "Create", "Synergize", "Utilize",
  "Spawn", "Instantiate", "Metallicize", "Amplify", "Compile"];

  let nouns = ["Files", "Media", "Images", "Processors", "Web Browsers", "Concepts",
  "Nouns", "Spaces", "Compilers", "Applications"]

  let verbChosen = verbs[Math.floor(Math.random() * verbs.length)];
  let nounChosen = nouns[Math.floor(Math.random() * nouns.length)];

  return `${verbChosen} ${nounChosen}`;
}

function generateBasePackageName()
{
  //Function for generating a package name that is
  //a parody of Adobe Flash Player.
  let companyNames = ["Clay", "Adele", "Brick", "Amoeba", "Adage", "Agape", "Addition"];
  let conventionNames = ["Mash", "Hash", "Gash", "Bash", "Nash", "Rash", "Lash"]
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
  let companyNames = ["Nanosoft", "Pear", "Flipper", "Yoddle", "Mrock", "Yednet", "Doodle", "Noodle", "🥔"];
  let conventionNames = ["Mash", "Hash", "Gash", "Bash", "Nash", "Rash", "Padster", "Fad", "Tellmast", "Escher", "Name", "Hyphen", "Colon", "🐝"]
  let utilityNames = ["Player", "Sorter", "Parser", "Mediator", "Engine", "Compiler"]

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

function downloadPackage(name, packageLogo)
{
  //Makes the download dialogue appear and start "downloading" the required
  //add-on/package

  let packageSize = 10 + Math.random()*20

  //TODO: Add random package size to package info, need to round down to
  //two decimals
  let packageInfo = `${name} ()`;

  let $packageLine = $("<div class='downloadedPackageLine'></div>");
  let $packageImage = $(`<img class='downloadIcon' src='${packageLogo}'/>`);

  let $packageInfoBlock = $("<div class='downloadInfoBlock'></div>");
  let $downloadText = $("<div class='downloadText'></div>").text(packageInfo);
  let $downloadProgress = $("<div class='downloadProgressBar'></div>");
  let $installButton = $(`<br/><button class='installPackageButton' onclick="installPackage('${currentPackageName}')">Install</button>`);

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

function downloadSubPackage()
{
  $("#installDialog").remove();

  let packageLogo = `assets/images/packagelogo${Math.floor((Math.random()*4)+1)}.png`;
  return downloadPackage(currentPackageName, packageLogo);
}

function downloadBasePackage()
{
  //Download function that handles a few things particular to the starting package
  basePackageDownloadStarted = true;
  $("#xashDownloadButton").attr("disabled", true);

  return downloadPackage(basePackageName, 'assets/images/xashlogo.png');
}

function updateDownloadProgress($packageLine)
{
  //Updates download progressbar and allows install on completion
  if ($packageLine.find(".downloadProgressBar").progressbar("value") >= 100)
  {
    $packageLine.find(".installPackageButton").attr("disabled", false);
    return;
  }

  $packageLine.find(".downloadProgressBar").progressbar("value", $packageLine.find(".downloadProgressBar").progressbar("value")+DOWNLOAD_SPEED);

  window.requestAnimationFrame(function () { updateDownloadProgress($packageLine); });
}

function cleanDownloadDialog()
{
  //Clears out the download dialog.
  $("#downloadDialog").empty();
  $("#downloadDialog").css("visibility", "hidden");
}

function installPackage(packageName)
{
  //Opens an install dialog.

  cleanDownloadDialog();

  $(".installPackageButton").attr('disabled', true);

  let $installDialog = $("<div id='installDialog'></div>");


  let $installTabsContainer = $("<div id='installTabs'></div>")
  let $installTabs = $("<ul></ul>");
  $installTabs.append($("<li><a href='#installIntro'>Start</a></li>"));
  $installTabs.append($("<li><a href='#installTerms'>Terms</a></li>"));
  $installTabs.append($("<li><a href='#installFinalize'>Finish</a></li>"));

  let $installIntroTab = $("<div id='installIntro'></br></div>");
  let $installTermsTab = $("<div id='installTerms'></br></div>");
  let $installFinalizeTab = $("<div id='installFinalize'></br></div>");

  $installTabsContainer.append($installTabs);

  $installDialog.append($installTabsContainer);


  //Creates the Intro/Start tab

  let $installHeader = $(`<h3>Install ${packageName}</h3><h4>Why choose ${packageName}?</h4>`);
  $installIntroTab.append($installHeader);
  let $featureList = $("<div class='featureList'></div>");

  for (let i = 0; i < Math.floor((Math.random()*(MAX_FEATURES-MIN_FEATURES))+MIN_FEATURES); i++)
  {
    $featureList.append($(`<p class='packageFeature'>${generateFeature()}</p>`));
  }
  $installIntroTab.append($featureList);

  $installIntroTab.append($("<button onclick=nextInstallStep()>Continue</button>"))

  $installTabs.append($installIntroTab);


  //Creates the Terms and Conditions tab

  let $termsHeader = $("<h3>Terms and Conditions</h3>");
  let $termsText = $("<p class='termsText'></p>").css('white-space', 'pre').text(terms);
  $installTermsTab.append($termsHeader);
  $installTermsTab.append($termsText);

  let $termsAgreeLabel = $("<label for='termsAgree'>I agree to the terms and conditions</label>")
  let $termsAgreeCheck = $("<input type='checkbox' name='termsAgree' id='termsAgree'</input>");

  $installTermsTab.append($termsAgreeLabel);
  $installTermsTab.append($termsAgreeCheck);

  let $termsAgreeButton = $("<button onclick=termsContinue()>Install</button>")

  $installTermsTab.append($termsAgreeButton);

  $installTabs.append($installTermsTab);

  //Creates the finalize tab

  let $finalizeHeader = $("<h3>Installing Package...</h3>");

  $installFinalizeTab.append($finalizeHeader);

  let $finalizeProgress = $("<div class='finalizeProgressBar'></div>");

  $finalizeProgress.progressbar({ value: 0 });

  $installFinalizeTab.append($finalizeProgress);

  $installTabs.append($installFinalizeTab);

  //Add the dialog to the page and set up tabs/dialog
  $('body').append($installDialog);
  $installTabsContainer.tabs({active: 0});
  $installTabsContainer.tabs("disable");

  $installDialog.dialog({
    dialogClass: "no-close",
    width: 800,
    height: 600
  });

  currentInstallWindow = $installDialog;
}

function nextInstallStep()
{
  //Increments the step in the install sequence.

  //For some bizarre reason the tabs need to be "enabled" before the active tab
  //can be incremented which makes some sense, but the entire reason they're
  //disabled is so I can control the flow without the user being able to just
  //click on them? Life's mysteries. Anyways, that's why the enable/disable wrappers
  //around the active increment is necessary.
  $("#installTabs").tabs("enable");
  $("#installTabs").tabs("option", "active", $("#installTabs").tabs("option", "active")+1);
  $("#installTabs").tabs("disable");
}

function termsContinue()
{
  //Continue function for the terms and conditions, checks to make sure you
  //actually accepted the terms.
  if ($("#termsAgree").prop("checked") === true)
  {
    nextInstallStep();
    installProcess($("#installFinalize"));
  }
  else
  {
    //TODO: insert some cheeky response to not agreeing here
  }
}

function revealDependency()
{
  //Replaces the finalize tab with a download dependency tab.
  $("#installFinalize").empty();
  let newPackageName = generateSubPackageName();

  let $dependencyHeader = $("</br><h3>Almost there...</h3>");
  let $dependencyText = $(`<p>But not quite! ${currentPackageName} requires ${newPackageName} to be installed on your computer to run. Download automatically?</p>`);

  $("#installFinalize").append($dependencyHeader);
  $("#installFinalize").append($dependencyText);

  let $dependencyDownloadButton = $("<button id='dependencyDownloadButton' onclick='downloadSubPackage()'>Download Dependency</button>");

  $("#installFinalize").append($dependencyDownloadButton);

  currentPackageName = newPackageName;
}

function installProcess($finalizeTab)
{
  //Called repeatedly to update the install process, until complete, when it
  //reveals the dependency tab.

  $(".finalizeProgressBar").progressbar("value", $(".finalizeProgressBar").progressbar("value")+FINALIZE_SPEED);

  if ($(".finalizeProgressBar").progressbar("value") >= 100)
  {
    revealDependency();
    return;
  }

  window.requestAnimationFrame(function () {installProcess($finalizeTab)});
}


function setup() {
  setBasePackageName(generateBasePackageName());
  currentPackageName = basePackageName;
}
