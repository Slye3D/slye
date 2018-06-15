#!/usr/bin/ts-node
/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2018 Parsa Ghadimi. All Rights Reserved.
 *       Licence: MIT License
 */

import puppeteer from "puppeteer";
import { createHTTPServer } from "./server";

let port = 9090;

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/test.html`);

  page.on("console", async msg => {
    const text = msg.text();
    const args = [];
    for (let i = 0; i < msg.args().length; ++i) {
      args.push(await msg.args()[i].jsonValue());
    }
    console.log(...args);
    if (text.indexOf("DONE. Test passed") > -1) {
      await browser.close();
      const index = text.lastIndexOf(" ");
      const n = Number(text.substr(index + 1));
      process.exit(n > 0 ? 1 : 0);
    }
  });
}

const server = createHTTPServer();

function listen() {
  try {
    server.listen(port, () => {
      console.log("Started server on port", port);
      main();
    });
  } catch (e) {
    port++;
    listen();
  }
}

listen();
