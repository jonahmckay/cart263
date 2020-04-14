"use strict";

$(document).ready(setupUI);

/********************************************************************

UI.js script: handles the user interface and its functions that tie to the
garden object in script.js.

*********************************************************************/

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
let $partsButton = $("<button class='barButton' id='partsButton' onclick='toggleDialog($partsDialog);'></button>").button();
let $rulesButton = $("<button class='barButton' id='rulesButton' onclick='toggleDialog($rulesDialog);'></button>").button();
let $plantButton = $("<button class='barButton' id='plantButton' onclick='toggleDialog($plantDialog);'></button>").button();
let $simulationButton = $("<button class='barButton' id='simulationButton' onclick='toggleDialog($simulationDialog);'></button>").button();
let $musicButton = $("<button class='barButton' id='musicButton' onclick='toggleDialog($musicDialog);'></button>").button();
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

function createModelsSelect()
{
  //Returns a jquery object of a select populated with the garden's defined models.
  let $select = $("<select class='modelsSelect'></select>");
  for (let i = 0; i < garden.definedModels.length; i++)
  {
    let $option = $(`<option value='${garden.definedModels[i]}'>${garden.definedModels[i]}</option>`);
    $select.append($option)
  }
  return $select;
}


function createRuleTypeSelect()
{
  //Creates a select of the different rule types.
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
  //Renames a part.

  //Check for name collision, and if there is one, just don't run.
  if (nameExists(newName))
  {
    //TODO: Make this do something to the UI
    console.log("Attempted to rename a part to an already existing part name")
    return false;
  }


  for (let i = 0; i < garden.plants.length; i++)
  {
    garden.plants[i].renamePart(part.name, newName);
  }


  renameObject(".partsSelect", part, newName);

  return true;
}

function renameRule(rule, newName)
{
  if (nameExists(newName))
  {
    //TODO: Make this do something to the UI
    console.log("Attempted to rename a rule to an already existing name")
    return false;
  }

  renameObject(".rulesSelect", rule, newName);

  return true;
}

function updateSingleRule(ruleName, newRule)
{
  //When a rule is changed, run this to update it in the garden (updating all
  //parts that use this rule)
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
  //Creates a new default rule.
  let newRule = new GrowthRule();
  garden.definedRules.push(newRule);

  selectedRule = garden.definedRules[garden.definedRules.length-1];
  updateSelects();
  initializeRulesDialog();
}

function removeRule(ruleName)
{
  //Removes a rule, and removes the reference to it from all defined parts that
  //have it in the garden.

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
  //Adds a rule to a part.
  if (rule === null)
  {
    rule = garden.definedRules[0];
  }

  part.addRule(rule);

  initializePartsDialog();
}

function removeRuleFromPartByName(name, part)
{
  //Given a rule's name, remove it from a part.

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
  //Given a rule's index in a part's rules array, remove it.
  part.removeRuleByIndex(index);

  initializePartsDialog();
}

function changeRuleOnPart(index, newRule, part)
{
  //Changes a rule on a part to a different rule.
  part.rules[index] = newRule;
}

function changeRuleType(ruleName, newType)
{
  //Changes a rule's type (i.e from GrowthRule to ProductionRule.)
  //Note: This will need to be changed whenever a new rule type is added.
  //TODO: Some better solution?
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

//
// Dialog toggle function
//

function toggleDialog($dialog)
{
  //Toggles by closing or opening a dialog given.
  if ($dialog.dialog("isOpen"))
  {
    $dialog.dialog("close");
  }
  else
  {
    $dialog.dialog("open");
  }
}

//
// "Initialize" (really update/redo) functions.
// TODO: Divide these into initialization functions
// and update functions so that the entire div/UI for a box
// doesn't need to be redone every single time?
//

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

  $partsDialog.append("<p>Active part:</p>");

  let $partSelect = createPartsSelect();
  $partSelect.val(selectedPart.name);
  $partSelect.on("change", function () { onPartDialogSelectChange($partSelect) })
  $partsDialog.append($partSelect);

  let $addPartButton = $("<button id='partDialogAddPart'>Add Part</button>");
  let $removePartButton = $("<button id='partDialogRemovePart'>Remove Part</button>");

  //TODO: This makes it so that createPart is bound to the part UIbar button for
  //some reason??? Debug at some point
  // $addPartButton.button();
  // $removePartButton.button();

  $addPartButton.on("click", createPart);
  $removePartButton.on("click", function () { removePart(selectedPart.name); });

  $partsDialog.append($addPartButton);
  $partsDialog.append($removePartButton);

  $partsDialog.append("<p>Rename part:</p>");

  let $rename = $("<input id=partDialogRename></input>");
  $rename.val(selectedPart.name);
  $rename.on("change", function () {renamePart(selectedPart, $rename.val());})
  $partsDialog.append($rename);

  let $modelBlock = $("<p></p>");
  $modelBlock.text("Part Model: ")

  let $modelSelect = createModelsSelect();
  $modelSelect.val(selectedPart.model.modelSource);
  $modelSelect.on("change", function () { selectedPart.model.modelSource = $modelSelect.val(); garden.forceRender(); });

  $modelBlock.append($modelSelect);

  $partsDialog.append($modelBlock);

  let $partOptions = $("<div id='partDialogOptions'</div>");

  let $baseLengthInput = $("<input id=partDialogBaseLength></input>");
  let $baseThicknessInput = $("<input id=partDialogBaseThickness></input>");

  let $lengthBlock = $("<span>Base Length: </span></br>");
  let $thicknessBlock = $("<span>Base Thickness: </span></br>");

  $baseLengthInput.val(selectedPart.length);
  $baseThicknessInput.val(selectedPart.thickness);

  $baseLengthInput.on("change", function () { selectedPart.length = parseFloat($baseLengthInput.val()); });
  $baseThicknessInput.on("change", function () { selectedPart.thickness = parseFloat($baseThicknessInput.val()); });

  $lengthBlock.append($baseLengthInput);
  $thicknessBlock.append($baseThicknessInput);

  $partOptions.append($lengthBlock);
  $partOptions.append($thicknessBlock);

  let $rulesDiv = $("<div id=partsDialogRulesDiv></div>");

  let $rulesHeader = $("<h4>Rules:</h4>");

  $rulesDiv.append($rulesHeader);
  //$rulesDiv.append("</br>");

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

  let $addRuleButton = $("<button id='partsDialogAddRule'>Add Rule</button>");

  $addRuleButton.on("click", function () { addRuleToPart(null, selectedPart) });

  $rulesDiv.append($addRuleButton);

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

  $rulesDialog.append("<p>Active rule:</p>")

  let $ruleSelect = createRulesSelect();
  $ruleSelect.on("change", function () { onRuleDialogSelectChange($ruleSelect) })
  $ruleSelect.val(selectedRule.name);
  $rulesDialog.append($ruleSelect);

  let $addRuleButton = $("<button id='rulesDialogAddRule'>Add Rule</button>");
  $addRuleButton.on("click", function () { createRule(); });

  $rulesDialog.append($addRuleButton);

  let $removeRuleButton = $("<button id='rulesDialogRemoveRule'>Remove Rule</button>");
  $removeRuleButton.on("click", function () { removeRule(selectedRule.name); });

  $rulesDialog.append($removeRuleButton);

  $rulesDialog.append("<p>Rename Rule:</p>");

  let $rename = $("<input id=rulesDialogRename></input>");
  $rename.val(selectedRule.name);
  $rename.on("change", function () {renameRule(selectedRule, $rename.val());})

  $rulesDialog.append($rename);

  let $baseChanceLine = $("<p>Base Chance: </p>");

  let $baseChanceInput = $("<input id=rulesDialogBaseChance></input>");
  $baseChanceInput.val(selectedRule.baseChance);
  $baseChanceInput.on("change", function () { selectedRule.baseChance = parseFloat($baseChanceInput.val());
  updateSingleRule(selectedRule.name, selectedRule);});

  $baseChanceLine.append($baseChanceInput);
  $rulesDialog.append($baseChanceLine);

  $rulesDialog.append("<p>Rule Type:</p>");

  let $ruleType = createRuleTypeSelect();
  $ruleType.val(selectedRule.ruleType);
  $ruleType.on("change", function () { changeRuleType(selectedRule.name, $ruleType.val()); });

  $rulesDialog.append($ruleType);

  //dependent on rule type
  let $ruleOptions = $("<div id='rulesDialogOptions'></div>");
  if (selectedRule.ruleType === "productionRule")
  {
    let $partSelectLine = $("<p>Child part: </p>");

    let $partSelect = createPartsSelect();
    $partSelect.val(selectedRule.basePart.name);
    $partSelect.on("change", function () {
      selectedRule.basePart = getFromListWithName(garden.definedParts, $partSelect.val());
      updateSingleRule(selectedRule.name, selectedRule);});

    $partSelectLine.append($partSelect);
    $rulesDialog.append($partSelectLine);

  }
  else if (selectedRule.ruleType === "growthRule")
  {
    let $lengthLine = $("<p>Length Delta: </p>");
    let $lengthDeltaInput = $("<input id=rulesDialogLengthDelta></input>");
    $lengthDeltaInput.val(selectedRule.lengthDelta);
    $lengthDeltaInput.on("change", function () {
      selectedRule.lengthDelta = parseFloat($lengthDeltaInput.val()); console.log($lengthDeltaInput.val()); updateSingleRule(selectedRule.name, selectedRule);});

    $lengthLine.append($lengthDeltaInput);
    $ruleOptions.append($lengthLine);

    let $thicknessLine = $("<p>Thickness Delta: </p>");
    let $thicknessDeltaInput = $("<input id='rulesDialogThicknessDelta'></input>");
    $thicknessDeltaInput.val(selectedRule.thicknessDelta);
    $thicknessDeltaInput.on("change", function () {
      selectedRule.thicknessDelta = parseFloat($thicknessDeltaInput.val()); updateSingleRule(selectedRule.name, selectedRule); });

    $thicknessLine.append($thicknessDeltaInput);
    $ruleOptions.append($thicknessLine);
  }

  $rulesDialog.append($ruleOptions);
}

function initializePlantDialog()
{
  selectedPlantBlueprint = garden.plantBlueprints[0];

  $plantDialog.empty();
  $plantDialog.append("<h2>Reset Plant</h2>")

  $plantDialog.append("Select root part: ");
  let $basePartSelect = createPartsSelect();
  $basePartSelect.val(selectedPlantBlueprint.basePart.name);
  $basePartSelect.on("change", function () { selectedPlantBlueprint.basePart = getFromListWithName(garden.definedParts, $basePartSelect.val()) });
  $plantDialog.append($basePartSelect);

  $plantDialog.append("<p></p>");

  let $restartButton = $("<button id='plantDialogRestartButton'>Reset</button>");
  $restartButton.on("click", function () {
    garden.restartFromBlueprint(selectedPlantBlueprint); });

  $plantDialog.append($restartButton);
}

function initializeSimulationDialog()
{
  $simulationDialog.empty();

  $simulationDialog.append("<p>A-Frame ticks per growth tick:</p>");

  let $framesPerGrowth = $("<input id='simulationDialogFramesPerGrowthInput'></input>");
  $framesPerGrowth.val(simulation.framesPerGrowth);
  $framesPerGrowth.on("change", function () { simulation.framesPerGrowth = parseInt($framesPerGrowth.val());});

  $simulationDialog.append($framesPerGrowth);
}

function initializeMusicDialog()
{
  $musicDialog.empty();
  $musicDialog.append("<p>To be implemented</p>");
}

function initializeDialogs()
{
  //Initializes, then hides each of the dialogs.

  $partsDialog.dialog({
    title: "Parts",
    width: "400px",
    open: function(e, ui) { initializePartsDialog(); }});
  $rulesDialog.dialog({
    title: "Rules",
    width: "400px",
    open: function(e, ui) { initializeRulesDialog(); } });
  $plantDialog.dialog({
    title: "Plant",
    open: function(e, ui) { initializePlantDialog(); } });
  $simulationDialog.dialog({
    title: "Simulation Settings",
    open: function(e, ui) { initializeSimulationDialog(); } });
  $musicDialog.dialog({
    title: "Music",
    open: function(e, ui) { initializeMusicDialog(); } });

  toggleDialog($partsDialog);
  toggleDialog($rulesDialog);
  toggleDialog($plantDialog);
  toggleDialog($simulationDialog);
  toggleDialog($musicDialog);

}

function setupUI() {
  $("body").append($uiBar);
  initializeDialogs();
}
