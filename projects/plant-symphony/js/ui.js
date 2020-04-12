$(document).ready(setupUI);

let $partsDialog = $("<div id='partsDialog'></div>");
let selectedPart = null;

let $uiBar = $("<div id='UIBar'></div>");
let $partsButton = $("<button class='barButton' id='partsButton' onclick='$partsDialog.parent().toggle();'></button>").button();
let $rulesButton = $("<button class='barButton' id='rulesButton'></button>").button();
let $plantButton = $("<button class='barButton' id='plantButton'></button>").button();
let $simulationButton = $("<button class='barButton' id='simulationButton'></button>").button();
let $musicButton = $("<button class='barButton' id='musicButton'></button>").button();
let $playButton = $("<button class='barButton' id='playButton' onclick='growthRunning = true;'></button>").button();
let $pauseButton = $("<button class='barButton' id='pauseButton' onclick='growthRunning = false;'></button>").button();



$uiBar.append($partsButton);
$uiBar.append($rulesButton);
$uiBar.append($plantButton);
$uiBar.append($simulationButton);
$uiBar.append($musicButton);
$uiBar.append($playButton);
$uiBar.append($pauseButton);

function getFromListWithName(list, name)
{
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
  let $select = $("<select class='rulesSelect'></select>");
  populateSelect($select, garden.definedRules);
  //$select.selectmenu();
  return $select;
}

function createPartsSelect()
{
  let $select = $("<select class='partsSelect'></select>");
  populateSelect($select, garden.definedParts);
  //$select.selectmenu();
  return $select;
}

function updateSelects()
{
  let $partsSelects = $(".partsSelect");
  $partsSelects.each(function(i, obj) { populateSelect($($partsSelects[i]), garden.definedParts); });
  let $rulesSelects = $(".rulesSelect");
  $partsSelects.each(function(i, obj) { populateSelect($($rulesSelects[i]), garden.definedRules); });
}

function createPart()
{
  setActiveDialogPart(garden.definedParts[garden.definedParts.length-1]);
}

function removePart()
{
  setActiveDialogPart(garden.definedParts[garden.definedParts.length-1]);
}

function onPartDialogSelectChange($select)
{
  setActiveDialogPart(getFromListWithName(garden.definedParts, $select.val()));
}

function setActiveDialogPart(part)
{
  selectedPart = part;
  console.log(selectedPart.name);
}

function initializePartsDialog()
{
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

function initializeDialogs()
{
  $partsDialog.dialog();
  initializePartsDialog();
  //$partsDialog.hide();
}

function setupUI() {
  $("body").append($uiBar);
  initializeDialogs();
}
