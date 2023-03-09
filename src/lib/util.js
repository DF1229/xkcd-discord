const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { parse } = require('rss-to-json');
const log = require('./logger');

module.exports = {
    getNewestXkcdNum,
    getInviteButton,
    msToString
}

async function getNewestXkcdNum() {
    try {
        let rss = await parse('https://xkcd.com/rss.xml');
        let link = rss.items[0].link; // should be a string formatted as https://xkcd.com/1234/
        return link.replace('https://xkcd.com/', '').replace('/', '');

    } catch(err) {
        log.error(err.message);
        return false;   
    }
}

function getInviteButton() {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Invite bot')
                .setURL(process.env.XKCD_DISCORD_INVITE)
                .setStyle(ButtonStyle.Link)
        );
}

function msToString(ms) {
    let seconds = ms / 1000;
    let days = 0, hours = 0, minutes = 0;

    while (seconds > 86400) {
        days++;
        seconds -= 86400;
    }
    while (seconds > 3600) {
        hours++;
        seconds -= 3600;
    }
    while (seconds > 60) {
        minutes++;
        seconds -= 60;
    }

    seconds = Math.round(seconds);

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}