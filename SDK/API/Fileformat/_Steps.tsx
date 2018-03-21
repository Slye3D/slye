/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2017 Slye Development Team. All Rights Reserved.
 *       Licence: MIT License
 */

import { Euler, Vector3 } from "three";
import { generateUUID } from "../../Math";
import { emit } from "../Events";
import { getStepPosition, getStepRotation } from "../Template";
import { removeComponent } from "./_Components";
import { removeStepFromPath }	from "./_Path";

const presentation = global.__presentation__;

function createStep() {
  const uuid = generateUUID();
  const i	= Object.keys(presentation.steps).length;
  const pos	= getStepPosition(i);
  const rot = getStepRotation(i);
  presentation.steps[uuid]	= {
    position: new Vector3(pos[0], pos[1], pos[2]),
    rotation: new Euler(rot[0], rot[1], rot[2], "XYZ"),
    components: []
  };
  emit("newStepCreated", uuid);
  return uuid;
}

function addComponentToStep(stepUUID, componentUUID) {
  // Each component can only have one owner (step)
  if (presentation.__cache__.c2s[componentUUID]) { return false; }
  // Return if stepUUID does not exist
  if (!presentation.steps[stepUUID]) { return false; }
  presentation.__cache__.c2s[componentUUID]	= stepUUID;
  presentation.__cache__.c2o[componentUUID].owner	= stepUUID;
  presentation.steps[stepUUID].components.push(componentUUID);
  emit("stepsComponentsChanged", stepUUID);
  return true;
}

function removeComponentFromStep(stepUUID, componentUUID) {
  if (!presentation.__cache__.c2s[componentUUID]) { return false; }
  if (!presentation.steps[stepUUID]) { return false; }
  delete presentation.__cache__.c2s[componentUUID];
  const 	c 	= presentation.steps[stepUUID].components,
    i	= c.indexOf(componentUUID),
    s	= c.slice;
  presentation.steps[stepUUID].components	= s(0, i).concat(s(i + 1));
  emit("stepsComponentsChanged", stepUUID);
  return true;
}

function removeStep(stepUUID) {
  if (!presentation.steps[stepUUID]) { return false; }
  presentation.steps[stepUUID].components.map(uuid => removeComponent(uuid));
  delete presentation.steps[stepUUID];
  // remove step from path
  removeStepFromPath(stepUUID);
  emit("stepRemoved", stepUUID);
  return true;
}

function setStepProps(stepUUID, properties) {
  if (!presentation.steps[stepUUID]) { return false; }
  for (const key in properties) { presentation.steps[stepUUID][key]	= properties[key]; }
}

function getStep(stepUUID) {
  return presentation.steps[stepUUID];
}

function getSteps() {
  return Object.keys(presentation.steps);
}

export default {
  getSteps,
  getStep,
  setStepProps,
  removeStep,
  removeComponentFromStep,
  createStep,
  addComponentToStep
};

export {
    getSteps,
    getStep,
    setStepProps,
    removeStep,
    removeComponentFromStep,
    createStep,
    addComponentToStep
};
