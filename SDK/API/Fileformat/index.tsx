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

import init from "./_Init";

// Component related functions
import * as Components from "./_Components";

// This API helps developers to work with presentation global configs
// such as font, color and etc...
import * as Configs from "./_Configs";

// Used to manage presentation's path (A.K.A Order of steps)
import * as Path from "./_Path";

// An interface to reset Object3Ds properties
import * as Properties from "./_Properties";

// Use this API to work with steps
import * as Steps from "./_Steps";

import { fromJSON, toJSON } from "./_Loader";

export default {
  Components,
  Configs,
  Path,
  Properties,
  Steps,
  init,
  toJSON,
  fromJSON
};
export {
    Components,
    Configs,
    Path,
    Properties,
    Steps,
    init,
    toJSON,
    fromJSON
};
