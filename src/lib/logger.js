function getLogString(level, message) {
    const dateIsoString = new Date().toISOString();
    return `${dateIsoString} | ${level} | ${message}`;
}

module.exports = {
    // Significant event, but nothing special
    info(message) {
        console.info(getLogString('INFO', message));
    },
    // Relevant to debugging, should not be used in production
    debug(message) {
        console.debug(getLogString('DEBUG', message));
    },
    // Something happened to influence the outcome of a command, but there was still a succesfull result to show to the user
    warn(message) {
        console.warn(getLogString('WARNING', message));
    },
    // A non-fatal error occured, the bot is still online, but there was no output to show to the user
    error(message) {
        console.error(getLogString('ERROR', message));
    },
    // A fatal error occured, the bot is no longer online, and the user did not get a response to their command
    fatal(message) {
        console.error(getLogString('FATAL', message));
    }
}