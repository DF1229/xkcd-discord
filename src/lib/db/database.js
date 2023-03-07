const log = require('../logger');
const mongoose = require('mongoose');

module.exports = {
    async connect() {
        mongoose.set('strictQuery', false);

        const { DB_URL, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
        if (!(DB_URL && DB_USER && DB_PASSWORD && DB_DATABASE)) {
            log.error('Missing connection parameters from environment variables');
            process.exit(1);
        }

        const connectionString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_DATABASE}?authSource=admin&authMechanism=SCRAM-SHA-256`;
        mongoose.connect(connectionString).then(() => {
            log.info(`[${DB_USER}@${DB_DATABASE}] Connection established`);
        }).catch((err) => {
            log.fatal(`Failed to connect to database ${DB_DATABASE} as ${DB_USER}@${DB_URL}`);
            console.error(err);
            process.exit(1);
        });
    }
}