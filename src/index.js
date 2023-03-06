const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: '../.env'});
const log = require('./lib/logger');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command)
        client.commands.set(command.data.name, command);
    else
        log.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return log.error(`No command matching ${interaction.commandName} was found.`);

    try {
        await command.execute(interaction);
    } catch (error) {
        log.error(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true});
    }
})


client.once(Events.ClientReady, c => {
    log.info(`Bot ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.XKCD_DISCORD_TOKEN);