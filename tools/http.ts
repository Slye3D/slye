#!/usr/bin/ts-node
import { createHTTPServer } from "./server";

const server = createHTTPServer();
server.listen(8080, () => {
  console.log("Server started working...");
});
