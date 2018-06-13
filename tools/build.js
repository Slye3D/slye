#!/usr/bin/env node

const Bundler = require("parcel-bundler");
const fs = require("fs");
const path = require("path");
const util = require("./util");

const production = process.argv[2] === "prod";

if (production) {
  process.env.NODE_ENV = "production";
  console.log("Production build.");
} else {
  console.log("Development build.");
}

const outDir = path.join(__dirname, "../dist");
util.rmrf(outDir);
fs.mkdirSync(outDir);
fs.symlinkSync(path.join(__dirname, "../assets"), path.join(outDir, "assets"));

const options = {
  autoinstall: false,
  cache: !production,
  hmr: false,
  logLevel: 3,
  minify: production,
  outDir,
  publicUrl: "/",
  sourceMaps: !production,
  watch: false
};

const entryPoints = ["index.html"];

const bundler = new Bundler(entryPoints, options);
bundler.bundle();
