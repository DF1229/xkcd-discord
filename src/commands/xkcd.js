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

        let comicRec;
        if (!await ComicModel.numScraped(num)) comicRec = await ComicModel.scrape(num);
        else comicRec = await ComicModel.findOne({ num });
        
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

        interaction.reply({ embeds: [comicEmbed] });
    }
};