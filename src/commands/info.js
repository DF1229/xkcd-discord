const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { getInviteButton, msToString } = require('../lib/util');
const log = require('../lib/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Some info on what xkcd is'),
    async execute(interaction) {
        log.info(`${interaction.user.tag} used the info command`);

        let infoEmbed = new EmbedBuilder()
            .setColor(Colors.White)
            .setTimestamp()
            .setTitle('xkcd - A webcomic')
            .setDescription(
                `XKCD is a webcomic created by Randall Munroe. ` +
                `Every Monday, Wednesday, and Friday, Randall releases a new comic on [his website xkcd.com](https://xkcd.com/)\n\n` +
                `**Background**\n`+
                `Randall is a CNU graduate with a degree in physics, he used to work on robots at NASA's Langley Research Center in Virginia, and as of 2007 he lives in Massachusetts.\n\n` +
                `In his spare time he climbs things, opens strange doors, and goes to goth clubs dressed as a frat guy so he can stand around and look terribly uncomfortable.\n` +
                `At frat parties he does the same thing, but the other way around.\n\n` +
                `Want to learn more? Check out [the about page](https://xkcd.com/about) on his website!`);
        interaction.reply({ embeds: [infoEmbed] });
    }
};