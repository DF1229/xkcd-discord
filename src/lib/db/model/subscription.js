const util = require('../../util');
const mongoose = require('mongoose');
const log = require('../../logger');

const subscriptionSchema = new mongoose.Schema(
    {
        userId: String,
        guildId: String,
        channelId: String,
        active: { type: Boolean, default: true },
        dm: { type: Boolean, default: false },
        crontab: { type: String, default: '' },
        random: { type: Boolean, default: true},
        latest: { type: Boolean, default: false},
        createdAt: { type: Date, default: Date.now() }
    },
    {
        // Available on records
        methods: {

        },
        // Available on table
        statics: {

        }
    }
)

module.exports = mongoose.model('subscription', subscriptionSchema);