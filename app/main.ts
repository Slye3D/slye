import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, "UI/app.html"),
    protocol: "file:",
    slashes: true
  }));
}

app.on("ready", createWindow);
