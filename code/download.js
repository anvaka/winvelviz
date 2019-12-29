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
      var fileRecord = {year, month, day, hour};
      var nodeFileName = `${year}${month}${day}${hour}.json`;
      var outName = path.join(__dirname, "data", nodeFileName);
      if (!fs.existsSync(outName)) {
        list.push(fileRecord)
      }
    }

    d.setDate(d.getDate() + 1);
    year = d.getFullYear();
  };

  return list;
}

function getGrb2FileName(file) {
  // Note: for lower resolution you can  try:
  // var fileName = `gfsanl_3_${year}${month}${day}_${HH}00_000.grb2`;
  return `gfsanl_4_${file.year}${file.month}${file.day}_${file.hour}00_000.grb2`;
}

function getNodeFileName(file) {
  return `${file.year}${file.month}${file.day}${file.hour}.json`;
}

function saveJson(file) {
  var year = file.year;
  var month = file.month;
  var day = file.day;
  var HH = file.hour;
  var fileName = getGrb2FileName(file);
  var url = `https://nomads.ncdc.noaa.gov/data/gfsanl/${year}${month}/${year}${month}${day}/${fileName}`;
  console.log("downloading " + url);
  var nodeFileName = getNodeFileName(file);

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
      execSync(`curl "${url}" > ${fullFileName}`, {stdio: 'inherit'});
    } catch (e) {
      console.error('Could not download ' + url);
      console.error(e);
      return false;
    }
    if (fs.existsSync(fullFileName)) {
      filesCopied = copyGribFiles();
    } else {
      console.error('Could not download ' + url + ' file not found: ' + fullFileName);
    }
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
      execSync(`grib_copy -w shortName=10u ${fullFileName} ${uFileName}`, {stdio: 'inherit'});
      execSync(`grib_copy -w shortName=10v ${fullFileName} ${vFileName}`, {stdio: 'inherit'});
      return true;
    } catch (e) {
      // Sometimes curl gives 404, I ignored them. But if you are here reading this,
      // make sure your grib-api is installed (`brew install grib-api` if you are on mac)
      console.log("Failed to parse " + fullFileName);
      return false;
    }
  }
}
