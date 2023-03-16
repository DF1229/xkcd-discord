const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const ComicModel = require('../lib/db/model/comic');
const { msToString, getCollectionSizeAsString } = require('../lib/util');
const log = require('../lib/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Some statistics about the bot :nerd:'),
    async execute(interaction) {
        log.info(`${interaction.user.tag} used the stats command`);

        const client = interaction.client;
        let statsEmbed = new EmbedBuilder()
            .setColor(Colors.White)
            .setTimestamp()
            .setTitle('Statistics')
            .addFields(
                { name: 'Comics saved', value: `${await ComicModel.estimatedDocumentCount()} (${await getCollectionSizeAsString(ComicModel)})`, inline: false },
                { name: 'Joined servers', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Available channels', value: `${client.channels.cache.size}`, inline: true },
                { name: 'Served users', value: `${client.users.cache.size}`, inline: true },
                { name: 'Uptime', value: `${msToString(client.uptime)}`, inline: false },
            )
        interaction.reply({ embeds: [statsEmbed] });
    }
};