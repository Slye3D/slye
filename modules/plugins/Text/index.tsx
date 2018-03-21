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

import FontIcon from "material-ui/FontIcon";
import React from "react";
import API, { SlyeNavIcon } from "../../../SDK";
import { Component, Fileformat, Navigation, Story } from "../../../SDK/API";
import TextElement from "./Element";

Component.registerHandler("text", TextElement);

const btn = new SlyeNavIcon(<FontIcon className="material-icons">text_fields</FontIcon>, "Header");
btn.on("click", () => {
  const componentUUID = Fileformat.Components.createComponent("text", {
    text: "Sample text...",
    type: "head"
  });
  Fileformat.Steps.addComponentToStep(Navigation.currentUUID, componentUUID);
});
Story.registerIcon(btn);
