const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { getInviteButton, msToString } = require('../lib/util');
const log = require('../lib/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get more information about the bot'),
    async execute(interaction) {
        const client = interaction.user.client;
        
        let infoEmbed = new EmbedBuilder()
            .setColor(Colors.White)
            .setTimestamp()
            .setTitle(client.user.tag)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: 'Developer', value: `<@${process.env.XKCD_DEV_USERID}>`, inline: true },
                { name: 'Repository', value: `[https://github.com/DF1229/xkcd-discord](github.com)`, inline: true },
                { name: 'Guilds', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Uptime', value: `${msToString(client.uptime)}`, inline: true },
            );

        interaction.reply({ embeds: [infoEmbed], components: [getInviteButton()] });
        log.info(`${interaction.user.tag} used the info command`);
    }
};