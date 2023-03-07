const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const log = require('../lib/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const pingStart = new EmbedBuilder()
            .setColor(Colors.White)
            .setTitle('Ping :ping_pong: Pong')
            .setTimestamp()
            .addFields(
                { name: 'Ping to bot', value: `pinging...`, inline: true },
                { name: 'API heartbeat', value: `pinging...`, inline: true },
            );

        const sent = await interaction.reply({ embeds: [pingStart], fetchReply: true });

        const pingResult = new EmbedBuilder()
            .setColor(Colors.White)
            .setTitle('Ping :ping_pong: Pong')
            .setTimestamp()
            .addFields(
                { name: 'Ping to bot', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                { name: 'API heartbeat', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
            );

        await interaction.editReply({ content: null, embeds: [pingResult] });
        log.info(`${interaction.user.tag} used the ping command`);
    }
};