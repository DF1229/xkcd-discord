const util = require('../../util');
const mongoose = require('mongoose');
const log = require('../../logger');

const comicSchema = new mongoose.Schema(
    {
        num: Number,
        title: String,
        alt: String,
        url: String,
        imgUrl: String,
        filename: String,
        comic: Buffer,
        createdAt: { type: Date, default: Date.now() }
    },
    {
        // Available on records
        methods: {

        },
        // Available on table
        statics: {
            async new(buffer, data) {
                try {
                    var nRec = await this.create({
                        num: data.num,
                        title: data.title,
                        alt: data.alt,
                        filename: data.filename,
                        url: data.url,
                        comic: buffer,
                        imgUrl: data.imgUrl
                    });
                } catch (err) {
                    console.error(err);
                    return false;
                }
                return nRec;
            },
            async scrape(num) {
                if (util.unavailableComics.includes(num)) return false;

                const pageUrl = `https://xkcd.com/${num}`
                const rawHtml = await util.fetchPage(pageUrl);

                const comicAttr = util.getComicAttr(rawHtml);
                const comicUrl = util.toImgUrl(comicAttr.src);
                const filename = util.getComicFilename(comicAttr);
                const comicBuffer = await util.fetchComic(comicUrl);
                const title = util.getComicTitle(rawHtml);

                const comicData = {
                    num: num,
                    title: title,
                    alt: comicAttr.title, // Misleading attribute name, which is actually the comic's description
                    filename: filename,
                    url: pageUrl,
                    imgUrl: comicUrl
                }

                return await this.new(comicBuffer, comicData);
            },
            async numScraped(num) {
                if (util.unavailableComics.includes(num)) return false;

                let rec = await this.findOne({ num });
                return (rec) ? true : false;
            },
            async randomNumber() {
                try {
                    const maxNum = await util.getNewestXkcdNum();
                    return Math.round(Math.random() * maxNum) + 1;
                } catch (err) {
                    log.error(err.message);
                    return false;
                }
            }
        }
    }
)

module.exports = mongoose.model('comic', comicSchema);