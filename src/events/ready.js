const { Events } = require('discord.js');
const log = require('../lib/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        log.info(`Bot ready! Logged in as ${client.user.tag}`);
    }
}