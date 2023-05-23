const mongoose = require('mongoose');
const log = require('../../logger');

const usersSchema = new mongoose.Schema(
    {
        userId: String,
        username: String,
        date: Date,
    },
    {
        // Available on records
        methods: {

        },
        // Available on table
        statics: {
            async new(userId, username) {
                let nRec;
                try {
                    nRec = await this.create({
                        userId,
                        username,
                        date: new Date().toDateString()
                    });
                } catch(err) {
                    log.error(err.message);
                    return false;
                }
                return nRec;
            }
        }
    }
)

module.exports = mongoose.model('users', usersSchema);