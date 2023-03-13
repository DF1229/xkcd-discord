const fs = require('fs');
const path = require('path');

function log(payload) {
    const date = new Date();
    const UTCstring = date.toISOString().substring(0, 10);
    const logFile = `../logs/${UTCstring}.txt`;

    fs.appendFile(logFile, payload + '\n', 'utf8', (err) => {
        if (err) throw err;
    });

    console.log(payload);
}

function getLogString(level, message) {
    const dateIsoString = new Date().toISOString();
    return `${dateIsoString} | ${level} | ${message}`;
}

module.exports = {
    // Significant event, but nothing special
    info(message) {
        log(getLogString('INFO', message));
    },
    // Relevant to debugging, should not be used in production
    debug(message) {
        log(getLogString('DEBUG', message));
    },
    // Something happened to influence the outcome of a command, but there was still a succesfull result to show to the user
    warn(message) {
        log(getLogString('WARNING', message));
    },
    // A non-fatal error occured, the bot is still online, but there was no output to show to the user
    error(message) {
        log(getLogString('ERROR', message));
    },
    // A fatal error occured, the bot is no longer online, and the user did not get a response to their command
    fatal(message) {
        log(getLogString('FATAL', message));
    }
}