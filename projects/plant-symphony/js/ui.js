"use strict";

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
let selectedPlantBlueprint = null;

//UI bar
let $uiBar = $("<div id='UIBar'></div>");

//Define buttons
let $partsButton = $("<button class='barButton' id='partsButton' onclick='togglePartsDialog();'></button>").button();
let $rulesButton = $("<button class='barButton' id='rulesButton' onclick='$rulesDialog.parent().toggle();'></button>").button();
let $plantButton = $("<button class='barButton' id='plantButton' onclick='$plantDialog.parent().toggle();'></button>").button();
let $simulationButton = $("<button class='barButton' id='simulationButton' onclick='$simulationDialog.parent().toggle();'></button>").button();
let $musicButton = $("<button class='barButton' id='musicButton' onclick='$musicDialog.parent().toggle();'></button>").button();
let $playButton = $("<button class='barButton' id='playButton' onclick='simulation.growthRunning = true;'></button>").button();
let $pauseButton = $("<button class='barButton' id='pauseButton' onclick='simulation.growthRunning = false;'></button>").button();

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

function nameExists(name)
{
  //Checks to see if a specific name exists as a part, or rule name.

  if (getFromListWithName(garden.definedParts, name) !== null || getFromListWithName(garden.definedRules, name) !== null)
  {
    return true;
  }

  return false;
}

function populateSelect($select, list, defaultValue)
{
  //Populates a select with options corrisponding to the name attribute of
  //each element in an array.
  $select.empty();
  for (let i = 0; i < list.length; i++)
  {
    let $option = $(`<option value='${list[i].name}'>${list[i].name}</option>`);
    $select.append($option)
  }
  $select.val(defaultValue);
  return $select;
}

function createRulesSelect()
{
  //Returns a jquery object of a select populated with the garden's defined rules.
  let $select = $("<select class='rulesSelect'></select>");
  populateSelect($select, garden.definedRules, null);
  return $select;
}

function createPartsSelect()
{
  //Returns a jquery object of a select populated with the garden's defined parts.
  let $select = $("<select class='partsSelect'></select>");
  populateSelect($select, garden.definedParts, null);
  return $select;
}

function createPlantBlueprintsSelect()
{
  //Returns a jquery object of a select populated with the garden's defined plant blueprints.
  let $select = $("<select class='plantBlueprintsSelect'></select>");
  populateSelect($select, garden.plantBlueprints, null);
  return $select;
}


function createRuleTypeSelect()
{
  let $select = $("<select class='ruleTypeSelect'></select>");
  $select.append($(`<option value='productionRule'}>Production Rule</option>`));
  $select.append($(`<option value='growthRule'}>Growth Rule</option>`));
  return $select;
}

function updateSelects()
{
  //Updates part selects and rules selects, making them matching the defined
  //parts and rules of the garden.
  let $partsSelects = $(".partsSelect");
  $partsSelects.each(function(i, obj) { populateSelect($($partsSelects[i]), garden.definedParts, $partsSelects[i].value); });
  let $rulesSelects = $(".rulesSelect");
  $rulesSelects.each(function(i, obj) { populateSelect($($rulesSelects[i]), garden.definedRules, $rulesSelects[i].value); });
  let $plantBlueprintsSelects = $(".plantBlueprintsSelect");
  $plantBlueprintsSelects.each(function(i, obj) { populateSelect($($plantBlueprintsSelects[i]), garden.plantBlueprints, $plantBlueprintsSelects[i].value); });
}

function renameObject(selectName, obj, newName)
{
  //Handles all aspects of renaming a defined object (Part or Rule).

  let oldName = obj.name;

  obj.name = newName;

  let $selects = $(selectName);

  for (let i = 0; i < $selects.length; i++)
  {
    if ($selects[i].value === oldName)
    {
      let $select = $($selects[i]);
      for (let optionIndex = 0; optionIndex < $select.children().length; optionIndex++)
      {
        if ($select.find("option")[optionIndex].value === oldName)
        {
          $select.find("option")[optionIndex].value = newName;
          $select.val(newName);
        }
      }
    }
  }
  updateSelects();
}

function renamePart(part, newName)
{
  for (let i = 0; i < garden.plants.length; i++)
  {
    garden.plants[i].renamePart(part.name, newName);
  }

  if (nameExists(newName))
  {
    //TODO: Make this do something to the UI
    console.log("Attempted to rename a part to an already existing part name")
    return;
  }

  renameObject(".partsSelect", part, newName);
}

function renameRule(rule, newName)
{
  if (nameExists(newName))
  {
    //TODO: Make this do something to the UI
    console.log("Attempted to rename a rule to an already existing name")
    return;
  }

  renameObject(".rulesSelect", rule, newName);
}

function updateSingleRule(ruleName, newRule)
{
  garden.updateSingleRule(ruleName, newRule);
}

function createPart()
{
  //Function for creating a part.
  let newPart = new Part();
  garden.definedParts.push(newPart);

  selectedPart = garden.definedParts[garden.definedParts.length-1];
  updateSelects();
}

function removePart(partName)
{
  //Function for removing a part.
  for (let i = 0; i < garden.definedParts.length; i++)
  {
    if (garden.definedParts[i].name === partName)
    {
      garden.definedParts.splice(i, 1);
      break;
    }
  }
  selectedPart = garden.definedParts[garden.definedParts.length-1];
  updateSelects();
  initializePartsDialog();
}

function createRule()
{
  let newRule = new GrowthRule();
  garden.definedRules.push(newRule);

  selectedRule = garden.definedRules[garden.definedRules.length-1];
  updateSelects();
  initializeRulesDialog();
}

function removeRule(ruleName)
{
  for (let i = 0; i < garden.definedParts.length; i++)
  {
    removeRuleFromPartByName(ruleName, garden.definedParts[i]);
  }

  for (let i = 0; i < garden.definedRules.length; i++)
  {
    if (garden.definedRules[i].name === ruleName)
    {
      garden.definedRules.splice(i, 1);
      break;
    }
  }
  selectedRule = garden.definedRules[garden.definedRules.length-1];
  updateSelects();
  initializePartsDialog();
  initializeRulesDialog();
}

function addRuleToPart(rule, part)
{
  if (rule === null)
  {
    rule = garden.definedRules[0];
  }

  part.addRule(rule);

//  updateSelects();
  initializePartsDialog();
}

function removeRuleFromPartByName(name, part)
{
  for (let i = 0; i < part.rules.length; i++)
  {
    if (part.rules[i].name === name)
    {
      part.rules.splice(i, 1);
      break;
    }
  }
}

function removeRuleFromPart(index, part)
{
  part.removeRuleByIndex(index);

//  updateSelects();
  initializePartsDialog();
}

function changeRuleOnPart(index, newRule, part)
{
  part.rules[index] = newRule;
}

function changeRuleType(ruleName, newType)
{
    let ruleIndex = null;

    for (let i = 0; i < garden.definedRules.length; i++)
    {
      if (garden.definedRules[i].name === ruleName)
      {
          ruleIndex = i;
          break;
      }
    }

    if (ruleIndex === null)
    {
      console.error(`Could not find rule "${ruleName}" while trying to change its type!`);
      return false;
    }

    let oldRule = garden.definedRules[ruleIndex];

    let newRule = null;

    if (newType === "productionRule")
    {
      newRule = new ProductionRule();
      newRule.basePart = garden.definedParts[0];
    }
    else if (newType === "growthRule")
    {
      newRule = new GrowthRule();
    }
    else
    {
      console.error(`${newType} is an invalid rule type for changeRuleType!`);
      return false;
    }

    newRule.name = oldRule.name;
    newRule.baseChance = oldRule.baseChance;

    garden.definedRules[ruleIndex] = newRule;

    selectedRule = garden.definedRules[ruleIndex];
    updateSelects();
    initializeRulesDialog();
}

function onPartDialogSelectChange($select)
{
  //Function called when the select for choosing the active UI part is
  //changed.
  selectedPart = getFromListWithName(garden.definedParts, $select.val());
  initializePartsDialog();
}

function onRuleDialogSelectChange($select)
{
  //Function called when the select for choosing the active UI rule is
  //changed.
  selectedRule = getFromListWithName(garden.definedRules, $select.val());
  initializeRulesDialog();
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

function togglePlantDialog()
{
  initializePlantDialog();
  $plantDialog.parent().toggle();
}

function initializePartsDialog()
{
  //Initializes the parts dialog.

  $partsDialog.empty();
  if (selectedPart === null)
  {
    if (garden.definedParts.length > 0)
    {
      selectedPart = garden.definedParts[0];
    }
  }

  let $partSelect = createPartsSelect();
  $partSelect.val(selectedPart.name);
  $partSelect.on("change", function () { onPartDialogSelectChange($partSelect) })
  $partsDialog.append($partSelect);

  let $rename = $("<input id=partDialogRename></input>");
  $rename.val(selectedPart.name);
  $rename.on("change", function () {renamePart(selectedPart, $rename.val());})
  $partsDialog.append($rename);

  let $addPartButton = $("<button id='partDialogAddPart'>Add Part</button>");
  let $removePartButton = $("<button id='partDialogRemovePart'>Remove Part</button>");

  //TODO: This makes it so that createPart is bound to the part UIbar button for
  //some reason??? Debug later
  // $addPartButton.button();
  // $removePartButton.button();

  $addPartButton.on("click", createPart);
  $removePartButton.on("click", function () { removePart(selectedPart.name); });

  $partsDialog.append($addPartButton);
  $partsDialog.append($removePartButton);

  let $partOptions = $("<div id='partDialogOptions'</div>");

  let $isRootBox = $("<input type='checkbox' name='partDialogIsRoot' id='partDialogIsRoot'>");
  let $baseLengthInput = $("<input id=partDialogBaseLength></input>");
  let $baseThicknessInput = $("<input id=partDialogBaseThickness></input>");

  if (selectedPart.isRoot) {
    $isRootBox.prop("checked", true);
  }

  $baseLengthInput.val(selectedPart.length);
  $baseThicknessInput.val(selectedPart.thickness);

  $isRootBox.on("change", function () { selectedPart.isRoot = $isRootBox.prop("checked"); });
  $baseLengthInput.on("change", function () { selectedPart.length = parseFloat($baseLengthInput.val()); });
  $baseThicknessInput.on("change", function () { selectedPart.thickness = parseFloat($baseThicknessInput.val()); });

  let $rulesDiv = $("<div id=partsDialogRulesDiv>Rules:</div>");
  $rulesDiv.append("<br>");
  let $addRuleButton = $("<button id='partsDialogAddRule'>Add Rule</button>");

  $addRuleButton.on("click", function () { addRuleToPart(null, selectedPart) });

  $rulesDiv.append($addRuleButton);

  for (let i = 0; i < selectedPart.rules.length; i++)
  {
    let $ruleLine = $("<div class='partsDialogRuleLine'></div>");
    let $ruleSelect = createRulesSelect();
    $ruleSelect.val(selectedPart.rules[i].name);

    $ruleSelect.on("change", function () {
      changeRuleOnPart(i, getFromListWithName(garden.definedRules, $ruleSelect.val()), selectedPart);
    });

    let $removeRuleButton = $("<button class='partsDialogRemoveRule'>Remove Rule</button>");

    $removeRuleButton.on("click", function () { removeRuleFromPart(i, selectedPart) });

    $ruleLine.text(`Rule ${i+1}:`);

    $ruleLine.append($ruleSelect);
    $ruleLine.append($removeRuleButton);

    $rulesDiv.append($ruleLine);
  }

  $partOptions.append($isRootBox);
  $partOptions.append($baseLengthInput);
  $partOptions.append($baseThicknessInput);

  $partOptions.append($rulesDiv);

  $partsDialog.append($partOptions);
}

function initializeRulesDialog()
{
  //Initializes the rules dialog.

  $rulesDialog.empty();
  if (selectedRule === null)
  {
    if (garden.definedRules.length > 0)
    {
      selectedRule = garden.definedRules[0];
    }
  }

  let $ruleSelect = createRulesSelect();
  $ruleSelect.on("change", function () { onRuleDialogSelectChange($ruleSelect) })
  $ruleSelect.val(selectedRule.name);
  $rulesDialog.append($ruleSelect);

  let $rename = $("<input id=ruleDialogRename></input>");
  $rename.val(selectedRule.name);
  $rename.on("change", function () {renameRule(selectedRule, $rename.val());})

  $rulesDialog.append($rename);

  let $ruleType = createRuleTypeSelect();
  $ruleType.val(selectedRule.ruleType);
  $ruleType.on("change", function () { changeRuleType(selectedRule.name, $ruleType.val()); });

  $rulesDialog.append($ruleType);

  let $addRuleButton = $("<button id='rulesDialogAddRule'>Add Rule</button>");
  $addRuleButton.on("click", function () { createRule(); });

  $rulesDialog.append($addRuleButton);

  let $removeRuleButton = $("<button id='rulesDialogRemoveRule'>Remove Rule</button>");
  $removeRuleButton.on("click", function () { removeRule(selectedRule.name); });

  $rulesDialog.append($removeRuleButton);

  let $baseChanceInput = $("<input id=ruleDialogBaseChance></input>");
  $baseChanceInput.val(selectedRule.baseChance);
  $baseChanceInput.on("change", function () { selectedRule.baseChance = parseFloat($baseChanceInput.val());
  updateSingleRule(selectedRule.name, selectedRule);});

  $rulesDialog.append($baseChanceInput);

  //dependent on rule type
  let $ruleOptions = $("<div id='ruleDialogOptions'></div>");
  if (selectedRule.ruleType === "productionRule")
  {
    let $partSelect = createPartsSelect();
    $partSelect.val(selectedRule.basePart.name);
    $partSelect.on("change", function () {
      selectedRule.basePart = getFromListWithName(garden.definedParts, $partSelect.val());
      updateSingleRule(selectedRule.name, selectedRule);});

    $ruleOptions.append($partSelect);

  }
  else if (selectedRule.ruleType === "growthRule")
  {
    let $lengthDeltaInput = $("<input id=ruleDialogLengthDelta></input>");
    $lengthDeltaInput.val(selectedRule.lengthDelta);
    $lengthDeltaInput.on("change", function () {
      selectedRule.lengthDelta = parseFloat($lengthDeltaInput.val()); console.log($lengthDeltaInput.val()); updateSingleRule(selectedRule.name, selectedRule);});

    $ruleOptions.append($lengthDeltaInput);

    let $thicknessDeltaInput = $("<input id='ruleDialogThicknessDelta'></input>");
    $thicknessDeltaInput.val(selectedRule.thicknessDelta);
    $thicknessDeltaInput.on("change", function () {
      selectedRule.thicknessDelta = parseFloat($thicknessDeltaInput.val()); updateSingleRule(selectedRule.name, selectedRule); });

    $ruleOptions.append($thicknessDeltaInput);
  }

  $rulesDialog.append($ruleOptions);
}

function initializePlantDialog()
{
  selectedPlantBlueprint = garden.plantBlueprints[0];

  $plantDialog.empty();

  let $basePartSelect = createPartsSelect();
  $basePartSelect.val(selectedPlantBlueprint.basePart.name);
  $basePartSelect.on("change", function () { selectedPlantBlueprint.basePart = getFromListWithName(garden.definedParts, $basePartSelect.val()) });

  let $restartButton = $("<button id='plantDialogRestartButton'>Restart</button>");
  $restartButton.on("click", function () {
    garden.restartFromBlueprint(selectedPlantBlueprint); });

  $plantDialog.append($basePartSelect);
  $plantDialog.append($restartButton);
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
  togglePlantDialog();

  $simulationDialog.parent().toggle();
  $musicDialog.parent().toggle();

}

function setupUI() {
  $("body").append($uiBar);
  initializeDialogs();
}
