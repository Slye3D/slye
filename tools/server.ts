import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import * as url from "url";

import mime from "mime";

const basePath = path.join(__dirname, "../dist");
const index = path.join(basePath, "index.html");

export function createHTTPServer() {
  const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const filePath = path.join(basePath, reqUrl.pathname);
    if (!filePath.startsWith(basePath)) {
      res.writeHead(403, { "Content-Type": "text/html; charset=utf-8" });
      res.end("Access denied.");
      return;
    }
    fs.stat(filePath, (err, stat) => {
      let finalPath = filePath;
      if (err && err.code === "ENOENT" || stat.isDirectory()) {
        finalPath = index;
      } else if (err) {
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`Unexpected server error occurred. [#${err.code}]`);
        return;
      }
      res.writeHead(200, { "Content-Type": mime.getType(finalPath) });
      const stream = fs.createReadStream(finalPath);
      stream.pipe(res);
    });
  });
  return server;
}
