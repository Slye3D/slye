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

import Fileformat from "../../../SDK/API/Fileformat";
import Axios from "../../../SDK/Axios";

function save(fsUUID) {
  Axios.post(`/fs/${fsUUID}/save`, {
    data: Fileformat.toJSON()
  });
}

export default function(fsUUID) {
  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
        case "s":
          save(fsUUID);
          break;
      }
    }
  });
}
