const { getNewestXkcdNum } = require('../../util');
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
        methods:{

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
                        comic: buffer
                    });
                } catch(err) {
                    console.error(err);
                    return false;
                }
                return nRec;
            },
            async findByNum(num) {
                try {
                    return await this.findOne({ num });
                } catch(err) {
                    log.error(err.message);
                    return false;
                }
            },
            async randomNumber() {
                try {
                    const numMax = await getNewestXkcdNum();

                    const num = Math.round(Math.random() * numMax) + 1;
                    const rec = await this.findByNum(num);
                    
                    if (!rec) return await this.randomNumber();
                    else return num;
                } catch(err) {
                    log.error(err.message);
                    return false;
                }
            }
        }
    }
)

module.exports = mongoose.model('comic', comicSchema);