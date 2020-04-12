$(document).ready(setupUI);

//Create dialog divs
let $partsDialog = $("<div id='partsDialog'></div>");
let $rulesDialog = $("<div id='rulesDialog'></div>");
let $plantDialog = $("<div id='plantDialog'></div>");
let $simulationDialog = $("<div id='simulationDialog'></div>");
let $musicDialog = $("<div id='simulationDialog'></div>");

//Active plant elements in the dialogs
let selectedPart = null;
let selectedRule = null;

//UI bar
let $uiBar = $("<div id='UIBar'></div>");

//Define buttons
let $partsButton = $("<button class='barButton' id='partsButton' onclick='togglePartsDialog();'></button>").button();
let $rulesButton = $("<button class='barButton' id='rulesButton' onclick='$rulesDialog.parent().toggle();'></button>").button();
let $plantButton = $("<button class='barButton' id='plantButton' onclick='$plantDialog.parent().toggle();'></button>").button();
let $simulationButton = $("<button class='barButton' id='simulationButton' onclick='$simulationDialog.parent().toggle();'></button>").button();
let $musicButton = $("<button class='barButton' id='musicButton' onclick='$musicDialog.parent().toggle();'></button>").button();
let $playButton = $("<button class='barButton' id='playButton' onclick='growthRunning = true;'></button>").button();
let $pauseButton = $("<button class='barButton' id='pauseButton' onclick='growthRunning = false;'></button>").button();

//Add buttons to the UI bar
$uiBar.append($partsButton);
$uiBar.append($rulesButton);
$uiBar.append($plantButton);
$uiBar.append($simulationButton);
$uiBar.append($musicButton);
$uiBar.append($playButton);
$uiBar.append($pauseButton);

function getFromListWithName(list, name)
{
  //Helper function, returns first object with a matching name attribute.
  //If none can be found, returns null.
  //Assumes each element in a list has a .name attribute, usually
  //Part or Rule class members.
  //TODO: Make the function return a sensible error or ignore objects that
  //have no name attribute.
  for (let i = 0; i < list.length; i++)
  {
    if (list[i].name === name)
    {
      return list[i];
    }
  }
  return null;
}

function populateSelect($select, list)
{
  //Populates a select with options corrisponding to the name attribute of
  //each element in an array.
  $select.empty();
  for (let i = 0; i < list.length; i++)
  {
    let $option = $(`<option ${value=list[i].name}>${value=list[i].name}</option>`);
    $select.append($option)
  }
  return $select;
}

function createRulesSelect()
{
  //Returns a jquery object of a select populated with the garden's defined rules.
  let $select = $("<select class='rulesSelect'></select>");
  populateSelect($select, garden.definedRules);
  //$select.selectmenu();
  return $select;
}

function createPartsSelect()
{
  //Returns a jquery object of a select populated with the garden's defined parts.
  let $select = $("<select class='partsSelect'></select>");
  populateSelect($select, garden.definedParts);
  //$select.selectmenu();
  return $select;
}

function updateSelects()
{
  //Updates part selects and rules selects, making them matching the defined
  //parts and rules of the garden.
  let $partsSelects = $(".partsSelect");
  $partsSelects.each(function(i, obj) { populateSelect($($partsSelects[i]), garden.definedParts); });
  let $rulesSelects = $(".rulesSelect");
  $partsSelects.each(function(i, obj) { populateSelect($($rulesSelects[i]), garden.definedRules); });
}

function createPart()
{
  //Function for creating a part.
  //TODO: implement
  setActiveDialogPart(garden.definedParts[garden.definedParts.length-1]);
}

function removePart(partName)
{
  //Function for removing a part.
  //TODO: implement
  setActiveDialogPart(garden.definedParts[garden.definedParts.length-1]);
}

function onPartDialogSelectChange($select)
{
  //Function called when the select for choosing the active UI part is
  //changed.
  selectedPart = getFromListWithName(garden.definedParts, $select.val());
}

function onRuleDialogSelectChange($select)
{
  //Function called when the select for choosing the active UI rule is
  //changed.
  selectedRule = getFromListWithName(garden.definedRules, $select.val());
}

function togglePartsDialog()
{
  //Toggles the parts dialog.
  initializePartsDialog();
  $partsDialog.parent().toggle();
}

function toggleRulesDialog()
{
  //Toggles the rules dialog.
  initializeRulesDialog();
  $rulesDialog.parent().toggle();
}

function initializePartsDialog()
{
  //Initializes the parts dialog.

  $partsDialog.empty();
  if (selectedPart === null)
  {
    if (garden.definedParts.length > 0)
    {
      setActiveDialogPart(garden.definedParts[0]);
    }
  }

  let $partSelect = createPartsSelect();
  $partSelect.on("change", function () { onPartDialogSelectChange($partSelect) })
  $partsDialog.append($partSelect);
}

function initializeRulesDialog()
{
  //Initializes the rules dialog.

  $rulesDialog.empty();
  if (selectedRule === null)
  {
    if (garden.definedRules.length > 0)
    {
      setActiveDialogPart(garden.definedRules[0]);
    }
  }

  let $ruleSelect = createRulesSelect();
  $ruleSelect.on("change", function () { onRuleDialogSelectChange($ruleSelect) })
  $rulesDialog.append($ruleSelect);
}

function initializeDialogs()
{
  //Initializes, then hides each of the dialogs.

  $partsDialog.dialog();
  $rulesDialog.dialog();
  $plantDialog.dialog();
  $simulationDialog.dialog();
  $musicDialog.dialog();

  togglePartsDialog();
  toggleRulesDialog();
  //TODO: Hide other dialogs

}

function setupUI() {
  $("body").append($uiBar);
  initializeDialogs();
}
