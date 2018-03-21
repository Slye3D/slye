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

import Express from "express";

import FS from "../endpoints/fs";
import Presentations from "../endpoints/presentations";

const Router = Express.Router();

// Create an alias to `req.app.get('configs')`
Router.use((req, res, next) => {
  req.configs = req.app.get("configs");
  next();
});

Router.use("/presentations", Presentations);
Router.use("/fs", FS);

export default Router;
