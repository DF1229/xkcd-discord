function getLogString(level, message) {
    const dateIsoString = new Date().toISOString();
    return `${dateIsoString} | ${level} | ${message}`;
}

module.exports = {
    info(message) {
        console.info(getLogString('INFO', message));
    },
    debug(message) {
        console.debug(getLogString('DEBUG', message));
    },
    warn(message) {
        console.warn(getLogString('WARNING', message));
    },
    error(message) {
        console.error(getLogString('ERROR', message));
    }
}