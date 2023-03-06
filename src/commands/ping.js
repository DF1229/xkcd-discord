const { SlashCommandBuilder } = require('discord.js');
const log = require('../lib/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
        log.info(`${interaction.user.tag} used the ping command!`);
    }
};