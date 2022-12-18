// Group 1 Final Sprint
// Chris, Mark, Will, Neil
// Rockbuster 
// December 10th

const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logPath = path.join(__dirname, "logs");

const logEvents = async (msg, level, logName) => {
  const dateTime = moment().format("YYYY-MM-DD HH:mm A");
  const logEvent = `${dateTime}\t${uuidv4()}\t${msg}\t${level}\n`;
  if (DEBUG) console.log(logEvent);
  try {
    if (!fs.existsSync(logPath)) {
      await fsPromises.mkdir(logPath);
    }

    await fsPromises.appendFile(path.join(logPath, logName), logEvent);
  } catch (err) {
    console.error(err);
  }
};

module.exports = logEvents;


