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

import { generateUUID } from '../../Math';
import { emit } from '../Events';
import UI from './UI';

global.__storyIcons__	= {};
const storyIcons		= global.__storyIcons__;

function registerIcon(SlyeNavIcon) {
  const uuid = generateUUID();
  storyIcons[uuid] = SlyeNavIcon;
  return uuid;
}

function hideIcon(uuid) {
  if (!storyIcons[uuid]) { return; }
  storyIcons[uuid].isVisible = false;
  emit('rerender_story_navbar');
  return true;
}

function showIcon(uuid) {
  if (!storyIcons[uuid]) { return; }
  storyIcons[uuid].isVisible = true;
  emit('rerender_story_navbar');
  return true;
}

function toggleIcon(uuid) {
  if (!storyIcons[uuid]) { return; }
  if (storyIcons[uuid].isVisible) { return hideIcon(uuid); }
  return showIcon(uuid);
}

function getIcons() {
  return storyIcons;
}

export default {
  registerIcon,
  hideIcon,
  showIcon,
  toggleIcon,
  getIcons,
  UI
};

export {
		registerIcon
	,	hideIcon
	,	showIcon
	,	toggleIcon
	,	getIcons
	,	UI
};
