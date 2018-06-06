const fs = require("fs");
const rimraf = require("rimraf");

function rmrf(d) {
  if (fs.existsSync(d)) {
    console.log("Delete dir", d);
    rimraf.sync(d);
  }
}

exports.rmrf = rmrf;
