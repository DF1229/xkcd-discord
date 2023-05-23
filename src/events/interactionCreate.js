const UsersModel = require('../lib/db/model/users');
const { Events } = require('discord.js');
const log = require('../lib/logger');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command)  {
            log.error(`No command matching ${interaction.commandName} was found.`);
            return interaction.reply({ content: 'Whoops, command not found!', ephemeral: true })
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            try {
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            } catch(err) {
                if (err.code == 'InteractionAlreadyReplied')
                    interaction.editReply('There was an error while executing this command!');
            }
            console.error(error);
            log.error(error);
        }

        try {
            const user = interaction.user;
            let xRec = await UsersModel.findOne({ userId: user.id });
            if (!xRec) {
                const nRec = await UsersModel.new(user.id, user.username);
                if (!nRec) log.error(`Failed to register user interaction for user ${user.username} (${user.id})`);
            }
        } catch (err) {
            log.error(err.message);
        }
    }
}