const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const ComicModel = require('../lib/db/model/comic');
const log = require('../lib/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xkcd')
        .setDescription('Get a comic from xkcd.com!')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription(`The number of the comic you're looking for, or a random comic if you leave this empty`)
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(2745)
        ),
    async execute(interaction) {
        log.info(`${interaction.user.tag} used the xkcd command`);
        const num = interaction.options.getInteger('number') ?? await ComicModel.randomNumber();
        if (!num) {
            interaction.reply({ content: 'Failed to get a valid comic number.', ephemeral: true });
            return log.error(`Failed to get valid comic number`);
        }

        const comicRec = await ComicModel.findByNum(num);
        if (!comicRec) {
            interaction.reply({ content: 'Failed to retreive record from database.', ephemeral: true })
            return log.error(`Failed to retreive comic record with number ${num} from database`);
        }

        const comicEmbed = new EmbedBuilder()
            .setTitle(`#${comicRec.num} - ${comicRec.title}`)
            .setAuthor({ name: 'Randall Munroe', url: comicRec.url })
            .setColor(Colors.White)
            .setTimestamp()
            .setImage(comicRec.imgUrl)
            .setDescription(comicRec.alt);

        await interaction.reply({ embeds: [comicEmbed] });
    }
};