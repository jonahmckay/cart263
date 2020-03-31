"use strict";

/********************************************************************

Plant Symphony (working title)
Jonah McKay

Plant Symphony is a web application that allows for participating in the
growth of virtual plant-like forms in a 3D space, and then using the
plant to create music.

*********************************************************************/

$(document).ready(setup);

let partCount = 0;
let framesSinceLastGrowth = 0;
let framesPerGrowth = 10;

//Code taken from https://stackoverflow.com/a/43753414
//TODO: More elegant/efficient solution?

function clone(obj) {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
}

function getPositionFromBottom(bottomPosition, rotation, height)
{
  let middlePosition = bottomPosition;
  let staticOffset = new THREE.Vector3(0, height/4, 0);
  let rotatedOffset = new THREE.Vector3(0, height/4, 0);
  //let dividedRotation = new THREE.Euler(rotation.x/2, rotation.y/2, rotation.z/2);
  staticOffset.applyEuler(new THREE.Euler(-rotation.x, -rotation.y, -rotation.z));
  staticOffset.add(rotatedOffset);


  return middlePosition.add(staticOffset);
}

//Base class for different rules performed each plant tick.

class Rule
{
  constructor()
  {
    this.baseChance = 0.1;
  }

  ruleTick(target)
  {
    if (Math.random() < this.baseChance)
    {
      this.rulePass(target);
      return true;
    }
    else
    {
      this.ruleFail(target);
      return false;
    }
  }

  rulePass()
  {
    return false;
  }

  ruleFail()
  {
    return false;
  }

}

//Rule for creating new parts.
class ProductionRule extends Rule
{
  constructor(part)
  {
    super();
    this.basePart = part;

    this.baseChance = 0.1;
    this.baseTypeCap = 100;
  }

  rulePass(target)
  {
    this.produce(target)
    return true;
  }

  produce(target)
  {
    let newPart = clone(this.basePart);
    newPart.relativeRotation = new THREE.Euler((Math.random()*Math.PI*2), 0, (Math.random()*Math.PI*2));
    newPart.stickPosition = Math.random();
    //alert(newPart.stickPosition);
    target.addChild(newPart);
  }
}

//Rule for growing a part.
class GrowthRule extends Rule
{
  constructor()
  {
    super();
    this.baseChance = 0.025;
    this.lengthDelta = 0.22;
    this.thicknessDelta = 0.0001;
  }

  rulePass(target)
  {
    this.modify(target);
    return true;
  }

  modify(target)
  {
    target.length += this.lengthDelta;
    target.thickness += this.thicknessDelta;
  }
}

//Class defining a plant part.
class Part
{
  constructor()
  {
    this.children = [];

    this.rules = [];

    this.stickPosition = 1; // 0 to 1

    this.relativePosition = null;
    this.relativeRotation = null;

    this.thickness = 0.5;
    this.length = 2;
    this.lastLength = this.length;

    this.worldPosition = null;
    this.worldRotation = null;

    this.partID = `part${partCount}`;
    partCount++;

    this.DOMObject = null;

    this.renderUpToDate = false;
    this.positionUpToDate = false;

    this.isRoot = false;
  }

  addChild(child)
  {
    this.children.push(child);
  }

  addRule(rule)
  {
    this.rules.push(rule);
  }

  grow()
  {
    for (let i = 0; i < this.children.length; i++)
    {
      this.children[i].grow();
    }
    for (let i = 0; i < this.rules.length; i++)
    {
      this.rules[i].ruleTick(this);
    }
    this.renderUpToDate = false;
  }

  calculateWorldPosition(parent)
  {
    if (!this.positionUpToDate)
    {
      if (this.isRoot)
      {
        this.positionUpToDate = true;
        for (let i = 0; i < this.children.length; i++)
        {
          this.children[i].calculateWorldPosition(this);
        }
        return;
      }
      let bottomPosition = new THREE.Vector3(0, -this.height/2, 0);
      //let bottomPosition = relativePosition;
      if (this.stickPosition < 0)
      {
        //TODO readjust to match from difference, may need to figure out old-length
        //caching
      //  position = new
      }
      else
      {
        if (!parent.isRoot)
        {
          bottomPosition.y = -((parent.length*(-this.stickPosition+0.5)));
        }
        else
        {
          bottomPosition.y = -this.length/2;
        }
        //TODO What's the difference between relativePosition and worldPosition anymore??
        this.relativePosition = getPositionFromBottom(bottomPosition, this.relativeRotation, this.length);
        this.worldPosition = getPositionFromBottom(bottomPosition, this.relativeRotation, this.length);
      }
      this.positionUpToDate = true;
    }
    for (let i = 0; i < this.children.length; i++)
    {
      this.children[i].calculateWorldPosition(this);
    }
  }

  render(parent)
  {
    if (!this.renderUpToDate)
    {
      if (this.DOMObject === null)
      {
        if (!this.isRoot)
        {
          this.DOMObject = document.createElement("a-cylinder");
        }
        else
        {
          this.DOMObject = document.createElement("a-entity");
        }
         this.DOMObject.setAttribute('position', { x: this.relativePosition.x, y: this.relativePosition.y, z: this.relativePosition.z });
         this.DOMObject.setAttribute('rotation', { x: THREE.Math.radToDeg(this.relativeRotation.x),
           y: THREE.Math.radToDeg(this.relativeRotation.y),
           z: THREE.Math.radToDeg(this.relativeRotation.z) });
        if (!this.isRoot)
        {
          this.DOMObject.setAttribute("radius", this.thickness);
          this.DOMObject.setAttribute("height", this.length);
        }
        if (parent === null)
        {
          document.getElementsByTagName("a-scene")[0].appendChild(this.DOMObject);
        }
        else
        {
          parent.DOMObject.appendChild(this.DOMObject);
        }
        this.DOMObject.object3D.position.set(this.relativePosition.x, this.relativePosition.y, this.relativePosition.z);
        this.DOMObject.object3D.rotation.set(THREE.Math.radToDeg(this.relativeRotation.x), THREE.Math.radToDeg(this.relativeRotation.y), THREE.Math.radToDeg(this.relativeRotation.z));
        this.DOMObject.addEventListener('DOMContentLoaded', function () { console.log("loaded!"); renderChildren(); });
        this.renderChildren();
      }
      else
      {
        this.DOMObject.object3D.position.set(this.relativePosition.x, this.relativePosition.y, this.relativePosition.z);
      //  this.DOMObject.object3D.rotation.set(THREE.Math.radToDeg(this.relativeRotation.x), THREE.Math.radToDeg(this.relativeRotation.y), THREE.Math.radToDeg(this.relativeRotation.z));
        if (!this.isRoot)
        {
          this.DOMObject.setAttribute("radius", this.thickness);
          this.DOMObject.setAttribute("height", this.length);
        }
        this.renderChildren();
      }
      this.renderUpToDate = true;
    }
    else
    {
      this.renderChildren();
    }

  }

  renderChildren()
  {
    for (let i = 0; i < this.children.length; i++)
    {
      this.children[i].render(this);
    }
  }
}

//Class defining an entire plant.
class Plant
{
  constructor()
  {
    this.worldPosition = null;
    this.worldRotation = null;
    this.rootPart = null;
    this.renderUpToDate = false;
  }

  render()
  {
    this.rootPart.calculateWorldPosition(this);
    if (!this.renderUpToDate)
    {
      this.rootPart.render(null);
      this.renderUpToDate = true;
    }
  }

  grow()
  {
    this.rootPart.grow();
    this.renderUpToDate = false;
  }
}

class Garden
{
  constructor()
  {
    this.plants = [];
  }

  addPlant(plant)
  {
    this.plants.append(plant);
  }

  gardenGrowStep()
  {
    for (let i = 0; i < this.plants.length; i++)
    {
      this.plants[i].grow();
    }
  }

  gardenRenderStep()
  {

    for (let i = 0; i < this.plants.length; i++)
    {
      this.plants[i].render();
    }
  }
}

let garden = new Garden();

let rootPart = new Part();
rootPart.relativePosition = new THREE.Vector3(0, 0, 0);
rootPart.relativeRotation = new THREE.Euler();
rootPart.isRoot = true;
let trunkPart = new Part();
trunkPart.thickness = 0.01;
trunkPart.relativePosition = new THREE.Vector3(0, 0, 0);
trunkPart.relativeRotation = new THREE.Euler();
let branchPart = new Part();
branchPart.relativePosition = new THREE.Vector3();
branchPart.relativeRotation = new THREE.Euler(0.5, 0, 0);
branchPart.thickness = 0.1;
branchPart.length = 0.5;

let newBranchRule = new ProductionRule(branchPart);
//let growTrunkRule = new GrowthRule();
let growBranchRule = new GrowthRule();

//trunkPart.addRule(growTrunkRule);
trunkPart.addRule(newBranchRule);
branchPart.addRule(growBranchRule);

//trunkPart.children.push(branchPart);
rootPart.children.push(trunkPart);

let plant1 = new Plant();

plant1.rootPart = rootPart;

garden.plants.push(plant1);

AFRAME.registerComponent("auto-rotate", {
  tick: function() {
    let el = this.el;
    el.object3D.rotation.y += 0.005;
  }
});

AFRAME.registerComponent("auto-render", {
  tick: function()
  {
    garden.gardenRenderStep();
    if (framesSinceLastGrowth >= framesPerGrowth)
    {
      garden.gardenGrowStep();
      framesSinceLastGrowth = 0;
    }
    else
    {
      framesSinceLastGrowth++;
    }
  }

})

function setup() {
}
