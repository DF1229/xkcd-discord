const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const ComicModel = require('../lib/db/model/comic');
const util = require('../lib/util');
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
        ),
    async execute(interaction) {
        log.info(`${interaction.user.tag} used the xkcd command`);

        const num = interaction.options.getInteger('number') ?? await ComicModel.randomNumber();
        if (!num) {
            interaction.reply({ content: 'Failed to get a valid comic number.', ephemeral: true });
            return log.error(`Failed to get valid comic number`);
        }

        if (util.unavailableComics.includes(num)) {
            interaction.reply({ content: `This comic is unavailable through Discord, because it is interactive! Check it out at https://xkcd.com/${num}/`, ephemeral: true });
            return log.info(`The requested comic #${num} is interactive`);
        }

        const newestNum = await util.getNewestXkcdNum();
        if (num > newestNum) {
            interaction.reply({ content: `This comic has not yet been released, the newest comic is currently #${newestNum}.`, ephemeral: true });
            return log.info(`The requested comic #${num} had not yet been released`);
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

        const sent = await interaction.reply({ embeds: [comicEmbed], fetchReply: true });
        const ms = sent.createdTimestamp - interaction.createdTimestamp;
        log.debug(`Command took ${ms}ms to complete (${ms/1000}s)`)
    }
};