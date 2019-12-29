const path = require("path");
const fs = require("fs");
const {toObject} = require('./toObject');

fs.readdir(path.join(__dirname, "data"), (err, list) => {
  if (err) {
    console.log(
      "Did you download weather data? It must be in the ./data folder."
    );
    throw err;
  }

  let files = list.filter(x => x.indexOf(".json") > -1);
  findMinMax(files);
});

function findMinMax(files) {
  var uMax = Number.NEGATIVE_INFINITY;
  var vMax = Number.NEGATIVE_INFINITY;
  var uMin = Number.POSITIVE_INFINITY;
  var vMin = Number.POSITIVE_INFINITY;

  files.forEach(f => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", f)));
    const u = toObject(data.u);
    const v = toObject(data.v);

    if (uMax < u.maximum) uMax = u.maximum;
    if (uMin > u.minimum) uMin = u.minimum;
    if (vMax < v.maximum) vMax = v.maximum;
    if (vMin > v.minimum) vMin = v.minimum;
  });

  console.log({
    uMax,
    uMin,
    vMax,
    vMin
  });
}
