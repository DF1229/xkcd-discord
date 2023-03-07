const { Events } = require('discord.js');
const log = require('../lib/logger');

module.exports = {
    name: Events.Error,
    once: false,
    execute(error) {
        console.error(error);
        log.error(error.message);
    }
}