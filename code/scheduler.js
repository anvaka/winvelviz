/**
 * Runs multiple `node drawField _fileName_` at the same time to speed up the
 * rendering process.
 */
const { exec } = require("child_process");
const path = require("path");
let files = [];
let running = 0;
// Change this number to reflect how many CPU you have
let maxRunning = 4;

const fs = require("fs");

fs.readdir(path.join(__dirname, "data"), (err, list) => {
  if (err) {
    console.log(
      "Did you download weather data? It must be in the ./data folder."
    );
    throw err;
  }

  files = list.filter(x => x.indexOf(".json") > -1);
  console.log("Scheduling " + files.length + " files to process");
  scheduleNext();
});

function scheduleNext() {
  while (running < maxRunning && files.length) {
    let file = files.shift();
    running += 1;
    renderFile(file).then(scheduleNext);
  }
}

function renderFile(fileName) {
  console.log(`processing ${fileName}`);
  return new Promise((resolve, reject) => {
    exec(`node --max-old-space-size=2048 ./drawField ${fileName}`, err => {
      running -= 1;
      if (err) reject(err);
      else resolve(fileName);
    });
  });
}
