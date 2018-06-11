#!/usr/bin/env node

const Bundler = require("parcel-bundler");
const fs = require("fs");
const path = require("path");
const util = require("./util");

process.env.NODE_ENV = "production";

const outDir = path.join(__dirname, "../dist");
util.rmrf(outDir);
fs.mkdirSync(outDir);
fs.symlinkSync(path.join(__dirname, "../assets"), path.join(outDir, "assets"));

const options = {
  autoinstall: false,
  cache: true,
  hmr: false,
  logLevel: 3,
  minify: true,
  outDir,
  publicUrl: "/",
  sourceMaps: true,
  watch: false
};

const entryPoints = ["index.html"];

const bundler = new Bundler(entryPoints, options);
bundler.bundle();
