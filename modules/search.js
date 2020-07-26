const Discord = require('discord.js');
const config = require('../botsetting.json');
const stringhandler = require('../stringhandler');
const snekfetch = require('snekfetch')
const request = require('request');

module.exports = {
    'dog': (msg, command) => {
        let url = `http://random.dog/woof.json`;
        request(url, function (err, response, body) {
            if (err) {
                console.log(`Error Occured \n\n \`\`\`js\n${err}\n\`\`\`\n\n`);
                return;
            }
            body = JSON.parse(body);
            if (body.url) {
                let embed = new Discord.MessageEmbed()
                    .setColor(`${config.color}`)
                    .setTimestamp()
                    .setImage(body.url);
                msg.channel.send(embed);
            }
        })
    },
    'neko': (msg, command) => {
        let url = `https://nekos.life/api/v2/img/neko`;
        request(url, function (err, response, body) {
            if (err) {
                console.log(`Error Occured \n\n \`\`\`js\n${err}\n\`\`\`\n\n`);
                return;
            }
            body = JSON.parse(body);
            if (body.url) {
                let embed = new Discord.MessageEmbed()
                    .setColor(`${config.color}`)
                    .setTimestamp()
                    .setImage(body.url);
                msg.channel.send(embed);
            }
        })
    },
    'twitch': (msg, command) => {
        let nike = stringhandler.cutTextHead('twitch', command);
        const api = `https://api.twitch.tv/kraken/channels/${nike}?client_id=h5otvowaukebe06barer212ljrbz9n`;
        snekfetch.get(api).then(r => {
            let embed = new Discord.MessageEmbed()
                .setAuthor(
                    `${r.body.display_name}`,
                    `${r.body.logo}`,
                    `${r.body.url}`
                )
            .setColor(config.color)
            .setThumbnail(`http://static-cdn.jtvnw.net/ttv-boxart/${encodeURI(r.body.game)}-500x500.jpg`)
            .addField('Name', `${r.body.status}`, true)
            .addField('Now Playing', `${r.body.game}`, true)
            .addField('Number of Followers', `${r.body.followers}`, true)
            .addField('Number of views', `${r.body.views}`, true)
            .setImage(r.body.video_banner);
        msg.channel.send(embed);
       })
    },
    'google': (msg, command) => {
        let google = stringhandler.cutTextHead('google', command);
        let link = `https://www.google.com/search?q=` + encodeURI(google);
        if (!google) return msg.reply(`Please type a Keyword!`);
        let embed = new Discord.MessageEmbed()
            .setColor("White")
            .setTimestamp()
            .addField('Google Search:', 'Results Found!')
            .addField("Keyword:", google)
            .addField(':', link)
            .setFooter("Naesungbot", msg.author.avatarURL);
        msg.channel.send(embed);
    },
    'naver': (msg, command) => {
        let naver = stringhandler.cutTextHead('naver', command);
        let link = `https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=` + encodeURI(naver);
        if (!naver) return msg.reply(`Please type a Keyword!`);
        let embed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTimestamp()
            .addField('Naver Search:', 'Results Found!')
            .addField("Keyword:", naver)
            .addField(':', link)
            .setFooter("Naesungbot", msg.author.avatarURL);
        msg.channel.send(embed);
    },
    'daum': (msg, command) => {
        let daum = stringhandler.cutTextHead('daum', command);
        let link = `https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&q=` + encodeURI(daum);
        if (!daum) return msg.reply(`Please type a Keyword!`);
        let embed = new Discord.MessageEmbed()
            .setColor("Blue")
            .setTimestamp()
            .addField('Nate Search:', 'Results Found!')
            .addField("Keyword:", daum)
            .addField('link:', link)
            .setFooter("Naesungbot", msg.author.avatarURL);
        msg.channel.send(embed);
    },
    'nate': (msg, command) => {
        let nate = stringhandler.cutTextHead('nate', command);
        let link = `https://search.daum.net/nate?thr=sbma&w=tot&q=` + encodeURI(nate);
        if (!nate) return msg.reply(`Please type a Keyword!`);
        let embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTimestamp()
            .addField('Nate Search:', 'Search Results Found!')
            .addField("Keyword:", nate)
            .addField('link:', link)
            .setFooter("Naesungbot", msg.author.avatarURL);
        msg.channel.send(embed);
    },
    'duckduckgo': (msg, command) => {
        let duckduckgo = stringhandler.cutTextHead('duckduckgo', command);
        let link = `https://duckduckgo.com/?q=` + encodeURI(duckduckgo);
        if (!duckduckgo) return msg.reply(`Please type a Keyword!`);
        let embed = new Discord.MessageEmbed()
            .setColor("Yellow")
            .setTimestamp()
            .addField('DuckDuckgo Search:', 'Search Results Found!')
            .addField("Keyword:", duckduckgo)
            .addField('link:', link)
            .setFooter("Naesungbot", msg.author.avatarURL);
        msg.channel.send(embed);
    },
    'namu': (msg, command) => {
        let namu = stringhandler.cutTextHead('namu', command);
        let link = `https://namu.wiki/w/` + encodeURI(namu);
        if (!namu) return msg.reply(`Please type a Keyword!`);
        let embed = new Discord.MessageEmbed()
            .setColor("Green")
            .setTimestamp()
            .addField('Namuwiki Search:', 'Search Results Found!')
            .addField("Keyword:", namu)
            .addField('link:', link)
            .setFooter("Naesungbot", msg.author.avatarURL);
        msg.channel.send(embed);
    },
};
