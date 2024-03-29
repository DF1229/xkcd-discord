const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const UsersModel = require('../lib/db/model/users');
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
        const guilds = (await client.guilds.fetch()).values();
        
        let memberCount = 0;
        for (const rawGuild of guilds) {
            const guild = await rawGuild.fetch();
            memberCount += guild.memberCount;
        }

        let statsEmbed = new EmbedBuilder()
            .setColor(Colors.White)
            .setTimestamp()
            .setTitle('Statistics')
            .addFields(
                { name: 'Comics saved', value: `${await ComicModel.estimatedDocumentCount()} (${await getCollectionSizeAsString(ComicModel)})`, inline: false },
                { name: 'Total servers', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Total channels', value: `${client.channels.cache.size}`, inline: true },
                { name: 'Total members', value: `${memberCount}`, inline: true },
                { name: 'Served users', value: `${await UsersModel.estimatedDocumentCount()}`, inline: true },
                { name: 'Uptime', value: `${msToString(client.uptime)}`, inline: true },
            )
        interaction.reply({ embeds: [statsEmbed] });
    }
};