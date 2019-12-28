/**
 * Downloads gfsanl_4_ files from https://nomads.ncdc.noaa.gov/data/gfsanl
 * and extracts wind velocity vector at the height of 10 meters.
 *
 * The extracted velocities are saved into ./data folder. The grib files are in the temp folder.
 *
 * WARNING: One grib file can be around 60MB, there are four records per day,
 * so the year worth of data is ~80GB - 90GB.
 */
var os = require("os");
var path = require("path");
var fs = require("fs");
var { execSync } = require("child_process");

var saveToDir = os.tmpdir();

makeYearFileList(2019).forEach(saveJson)

function makeYearFileList(startYear) {
  let list = [];
  var hours = ["00", "06", "12", "18"];

  var d = new Date(startYear, 0);
  var year = d.getFullYear();
   while (year < 2020) {
    let month = d.getMonth() + 1;
    let day = d.getDate();
    if (month < 10) month = "0" + ("" + month);
    if (day < 10) day = "0" + ("" + day);
    month = '' + month;
    day = '' + day;
    for (var i = 0; i < hours.length; ++i) {
      var hour = hours[i];
      var nodeFileName = `${year}${month}${day}${hour}.json`;
      var outName = path.join(__dirname, "data", nodeFileName);
      if (!fs.existsSync(outName)) {
        list.push({year, month, day, hour})
      }
    }

    d.setDate(d.getDate() + 1);
    year = d.getFullYear();
  };

  return list;
}

function saveJson(file) {
  var year = file.year;
  var month = file.month;
  var day = file.day;
  var HH = file.hour;
  var fileName = `gfsanl_4_${year}${month}${day}_${HH}00_000.grb2`;
  // Note: for lower resolution you can  try:
  // var fileName = `gfsanl_3_${year}${month}${day}_${HH}00_000.grb2`;
  var url = `https://nomads.ncdc.noaa.gov/data/gfsanl/${year}${month}/${year}${month}${day}/${fileName}`;
  console.log("downloading " + url);
  var nodeFileName = `${year}${month}${day}${HH}.json`;

  var fullFileName = path.join(saveToDir, fileName);
  var uFileName = fullFileName + "u";
  var vFileName = fullFileName + "v";
  var filesCopied = false;
  if (fs.existsSync(fullFileName)) {
    console.log(`${fullFileName} already exists. Trying to parse...`);
    filesCopied = copyGribFiles();
  }
  if (!filesCopied) {
    try {
      execSync(`curl "${url}" > ${fullFileName}`);
    } catch (e) {
      console.error('Could not download ' + url);
      console.error(e);
      return false;
    }
    filesCopied = copyGribFiles();
  }
  if (!filesCopied) {
    return;
  }

  const buffCommand = `printf "{\\"u\\":\`grib_dump -j ${uFileName}\`,\\"v\\":\`grib_dump -j ${vFileName}\`}"`
  var buff = execSync(buffCommand, {maxBuffer: 512 * 1024 * 1024});
  var content = JSON.stringify(JSON.parse(buff.toString()));

  var outName = path.join(__dirname, "data", nodeFileName);
  fs.writeFileSync(outName, content, "utf8");
  console.log("Saved to " + outName);

  function copyGribFiles() {
    try {
      execSync(`grib_copy -w shortName=10u ${fullFileName} ${uFileName}`);
      execSync(`grib_copy -w shortName=10v ${fullFileName} ${vFileName}`);
      return true;
    } catch (e) {
      // Sometimes curl gives 404, I ignored them. But if you are here reading this,
      // make sure your grib-api is installed (`brew install grib-api` if you are on mac)
      console.log("Failed to parse " + fullFileName);
      console.log(e);
      return false;
    }
  }
}
