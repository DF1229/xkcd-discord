const { Events } = require('discord.js');
const log = require('../lib/logger');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(client) {
        if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return log.error(`No command matching ${interaction.commandName} was found.`);

    try {
        await command.execute(interaction);
    } catch (error) {
        log.error(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true});
    }
    }
}