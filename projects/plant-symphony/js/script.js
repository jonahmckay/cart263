"use strict";

/********************************************************************

Plant Symphony (working title)
Jonah McKay

Plant Symphony is a web application that allows for participating in the
growth of virtual plant-like forms in a 3D space, and then using the
plant to create music.

*********************************************************************/

$(document).ready(setup);

//Base class for different rules performed each plant tick.
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
      rulePass(target);
      return true;
    }
    else
    {
      ruleFail(target);
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
    this.basePart = null;

    this.baseChance = 0.1;
    this.baseTypeCap = 100;
  }

  rulePass(target)
  {
    produce(target)
  }

  produce(target)
  {
    let newPart = basePart;
  }
}

//Rule for growing a part.
class GrowthRule
{
  constructor()
  {
    this.baseChance = 0.5;
  }

}

//Class defining a plant part.
class Part
{
  constructor()
  {
    this.children = null;

    this.rules = null;

    this.relativePosition = null;
    this.relativeRotation = null;

    this.size = null;

    this.cachedWorldPosition = null;
    this.cachedWorldRotation = null;
  }

  grow()
  {
    for (let i = 0; i < rules.length; i++)
    {
      rules[i].ruleTick(this);
    }
  }

  calculateWorldPosition(parent)
  {
    for (let i = 0; i < children.length; i++)
    {
      children[i].calculateWorldPosition(this);
    }
  }

  render(parent)
  {
    //Create scene objects here

    for (let i = 0; i < children.length; i++)
    {
      children[i].recursiveRender(this);
    }
  }
}

//Class defining an entire plant.
class Plant
{
  constructor()
  {
    this.rootPart = null;
  }

  render()
  {
    rootPart.render(null);
  }

  grow()
  {
    rootPart.grow();
  }
}

AFRAME.registerComponent("auto-rotate", {
  tick: function() {
    let el = this.el;
    el.object3D.rotation.y += 0.005;
  }
});

function setup() {
}
