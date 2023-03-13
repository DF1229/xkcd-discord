const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { parse } = require('rss-to-json');
const cheerio = require('cheerio');
const log = require('./logger');

// Comics with these numbers are not available, because they are interactive.
const unavailableComics = [404, 1037, 1350, 1416, 1525, 1608, 1663, 2067, 2198];

module.exports = {
    getCollectionSizeAsString,
    unavailableComics,
    getNewestXkcdNum,
    getComicFilename,
    getInviteButton,
    getComicTitle,
    getComicAttr,
    fetchComic,
    msToString,
    fetchPage,
    toImgUrl,
}

async function getCollectionSizeAsString(dbModel) {
    const sizeBytes = (await dbModel.collection.stats()).storageSize;
    const sizeKb = sizeBytes / 1024;
    const sizeMb = sizeKb / 1024;
    const sizeGb = sizeMb / 1024;

    let result;
    if (sizeGb >= 1) result = `${Math.round(sizeGb)}gb`;
    else if (sizeMb >= 1) result = `${Math.round(sizeMb)}mb`;
    else if (sizeKb >= 1) result = `${Math.round(sizeKb)}kb`;
    else result = `${Math.round(sizeBytes)}b`;

    return result;
}

async function fetchPage(url) {
    try {
        const res = await fetch(url);
        const data = await res.text();
        return data;
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

function getComicAttr(rawHtml) {
    const $ = cheerio.load(rawHtml);
    return $('div#comic img').attr();
}

function toImgUrl(src) {
    let res = src;
    res.trim();
    res.toLowerCase();
    res = 'https:' + res;
    return res;
}

function getComicFilename(comicAttr) {
    let src = comicAttr.src;
    if (!src) throw new Error('No source attribute!');

    return src.replace('//imgs.xkcd.com/comics/', '');
}


async function blobToBuffer(blob) {
    return Buffer.from(await blob.arrayBuffer());
}

async function fetchComic(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Response not OK');

        const contentType = res.headers.get('content-type');
        if (!contentType.match('image/')) throw new Error('Image not of expected MIME-type');
        
        const buffer = await blobToBuffer(await res.blob());
        return buffer;
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

function getComicTitle(rawHtml) {
    const $ = cheerio.load(rawHtml);
    return $('div#ctitle').text();
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