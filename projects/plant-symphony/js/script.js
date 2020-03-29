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

//Base class for different rules performed each plant tick.

function getPositionFromBottom(bottomPosition, rotation, height)
{
  let middlePosition = bottomPosition;
  let offset = new THREE.Vector3(0, height/2, 0);
  offset.applyEuler(rotation);
  return middlePosition + offset;
}

class Rule
{
  constructor()
  {
    this.baseChance = 0.1;
  }

  ruleTick(target)
  {
    if (Math.random() < baseChance)
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
  constructor()
  {
    super();
    this.basePart = null;

    this.baseChance = 0.1;
    this.baseTypeCap = 100;
  }

  rulePass(target)
  {
    this.produce(target)
  }

  produce(target)
  {
    let newPart = basePart;
  }
}

//Rule for growing a part.
class GrowthRule extends Rule
{
  constructor()
  {
    super();
    this.baseChance = 0.5;
  }

}

//Class defining a plant part.
class Part
{
  constructor()
  {
    this.children = [];

    this.rules = [];

    this.stickPosition = -1;

    this.relativePosition = null;
    this.relativeRotation = null;

    this.thickness = 0.5;
    this.length = 2;

    this.worldPosition = null;
    this.worldRotation = null;

    this.partID = `part${partCount}`;
    partCount++;

    this.DOMObject = null;

    this.renderUpToDate = false;
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
    let bottomPosition = new THREE.Vector3(0, this.height/2, 0);
    if (this.stickPosition < 0)
    {
      //TODO readjust to match from difference, may need to figure out old-length
      //caching
    //  position = new
    }
    else
    {
      bottomPosition.y = parent.length/this.stickPosition;
      //TODO What's the difference between relativePosition and worldPosition anymore??
      this.relativePosition = getPositionFromBottom(bottomPosition, this.relativeRotation, this.length);
      this.worldPosition = getPositionFromBottom(bottomPosition, this.relativeRotation, this.length);
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
        this.DOMObject = document.createElement("a-cylinder");
        // this.DOMObject.setAttribute('position', { x: this.relativePosition.x, y: this.relativePosition.y, z: this.relativePosition.z });
        // this.DOMObject.setAttribute('rotation', { x: THREE.Math.radToDeg(this.relativeRotation.x),
        //   y: THREE.Math.radToDeg(this.relativeRotation.y),
        //   z: THREE.Math.radToDeg(this.relativeRotation.z) });

        this.DOMObject.setAttribute("radius", this.thickness);
        this.DOMObject.setAttribute("height", this.length);
        if (parent === null)
        {
          document.getElementsByTagName("a-scene")[0].appendChild(this.DOMObject);
        }
        else
        {
          parent.DOMObject.appendChild(this.DOMObject);
        }
        this.DOMObject.object3D.position.set(this.relativePosition.x, this.relativePosition.y, this.relativePosition.z);
        this.DOMObject.object3D.rotation.set(this.relativeRotation.x, this.relativeRotation.y, this.relativeRotation.z);
        //this.DOMObject.addEventListener('DOMContentLoaded', function () { console.log("loaded!"); renderChildren(); });
        this.renderChildren();
      }
      else
      {
        this.DOMObject.object3D.position.set(this.relativePosition.x, this.relativePosition.y, this.relativePosition.z);
        this.DOMObject.object3D.rotation.set(this.relativeRotation.x, this.relativeRotation.y, this.relativeRotation.z);
        this.DOMObject.setAttribute("radius", this.thickness);
        this.DOMObject.setAttribute("height", this.length);
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
    this.rootPart.calculateWorldPosition(this.origin);
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

let trunkPart = new Part();
trunkPart.relativePosition = new THREE.Vector3(0, 0, 0);
trunkPart.relativeRotation = new THREE.Vector3();
let branchPart = new Part();
branchPart.relativePosition = new THREE.Vector3();
branchPart.relativeRotation = new THREE.Vector3(0.2, 0, 0);
branchPart.thickness = 0.2;
branchPart.length = 4;

trunkPart.children.push(branchPart);

let plant1 = new Plant();

plant1.rootPart = trunkPart;

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
  }

})

function setup() {
}
