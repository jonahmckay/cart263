"use strict";

/********************************************************************

Plant Symphony (working title)
Jonah McKay

Plant Symphony is a web application that allows for participating in the
growth of virtual plant-like forms in a 3D space, and then using the
plant to create music.

*********************************************************************/

$(document).ready(setup);

AFRAME.registerComponent("auto-rotate", {
  tick: function() {
    let el = this.el;

    el.object3D.rotation.y += 0.005;
  }
});

function setup() {
}
