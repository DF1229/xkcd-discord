const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { getInviteButton, msToString } = require('../lib/util');
const log = require('../lib/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get more information about the bot'),
    async execute(interaction) {
        const member = interaction.member;
        const client = interaction.client;
        
        let infoEmbed = new EmbedBuilder()
            .setColor(Colors.White)
            .setTimestamp()
            .setTitle(member.user.tag)
            .setThumbnail(member.displayAvatarURL())
            .addFields(
                { name: 'Developer', value: `${client.application.owner}`, inline: true },
                { name: 'Repository', value: '[https://github.com/DF1229/daily-xkcd](github.com)', inline: true },
                { name: 'Guilds', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'uptime', value: `${msToString(client.uptime)}`, inline: true },
            );

        interaction.reply({ embeds: [infoEmbed], components: [getInviteButton()] });
        log.info(`${interaction.user.tag} used the info command`);
    }
};