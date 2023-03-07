require('dotenv').config({ path: '../.env' });

const { REST, Routes } = require('discord.js');
const { XKCD_DISCORD_TOKEN, XKCD_CLIENTID, XKCD_DEV_GUILDID } = process.env;
const fs = require('node:fs');

const commands = [];
const commandfiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandfiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(XKCD_DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(Routes.applicationCommands(XKCD_CLIENTID), { body: commands });

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();