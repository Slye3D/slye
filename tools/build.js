#!/usr/bin/env node

const Bundler = require("parcel-bundler");
const fs = require("fs");
const util = require("./util");

const outDir = "dist";
util.rmrf(outDir);
fs.mkdir(outDir);

const options = {
  autoinstall: false,
  cache: true,
  hmr: false,
  logLevel: 3,
  minify: false,
  outDir,
  publicUrl: "/",
  sourceMaps: true,
  watch: false
};

const entryPoints = ["index.html"];

const bundler = new Bundler(entryPoints, options);
bundler.bundle();
