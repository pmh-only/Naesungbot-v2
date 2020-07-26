const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const stringhandler = require('../stringhandler');
const config = require('../botsetting.json');
const request = require('request');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const https = require('https');


module.exports = {
    'play': (msg, command) => {
        function play(url) {
            ytdl.getInfo(url, {downloadURL: true}, (err, info) => {
                if (err) throw err;
                let embed = new Discord.MessageEmbed()
                    .setTitle(info.title)
                    .setURL(url)
                    .addField(`동영상 길이`,`${info.length_seconds}초`)
                    .setImage(`https://i.ytimg.com/vi_webp/${info.video_id}/maxresdefault.webp`)
                    .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
                    .setColor(`${config.color}`)
                    .setFooter(`출처: ${info.author.name}`)
                    .setTimestamp();
                // embed.addField('설명', info.description, true); 이건 embed 1024자 넘으면 에러 떠서 안씁니다
                msg.channel.send(embed);
            });
            msg.member.voice.channel.join().then(connection => {
                let streamOptions = {seek: 0, volume: 1, bitrate: 64000};
                const stream = ytdl(url, {filter: 'audioonly'});
                const dispatcher = connection.playStream(stream, streamOptions);
                dispatcher.on("end", end => {
                    msg.channel.send("노래가 끝났습니다!");
                    msg.member.voice.channel.leave();
                });
            }).catch(err => console.log(err));
        }
        function searchNoPlay() {
            let youtube = stringhandler.cutTextHead('play ', command);
            let link = `https://www.youtube.com/results?search_query=` + encodeURI(youtube);
            if (!youtube) return msg.reply(`Please enter a keyword.`);
            let embed = new Discord.MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .addField('Action:', 'Searching on youtube')
                .addField("Word:", youtube)
                .addField('Link:', link)
                .addField('Notice!', 'Please connect to voice channel!')
                .setFooter("Your avatar", msg.author.avatarURL);
            msg.channel.send(embed);
        }
        if (!msg.member.voice.channel) return searchNoPlay();
        if (msg.guild.me.voice.channel) return msg.channel.send(`이미 ${msg.guild.me.voice.channel}에서 노래를 하고 있습니다`);
        const raw = stringhandler.cutTextHead('play ', command);
        if (!raw) return msg.channel.send("인자가 없습니다.");
        let url = raw;
        let validate = ytdl.validateURL(url);
        if (!validate) {
            ytSearch(url, function (err, r) {
                try {
                    function show(msg, count) {
                        let embed = new Discord.MessageEmbed()
                            .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
                            .setColor(`${config.color}`)
                            .setTitle(url + ' 검색 결과')
                            .setFooter(count + " 페이지. prev | next");
                        for (let i = 5 * count - 5; i < 5 * count; i++) {
                            embed.addField(i + 1 , `[${r.videos[i].title}](${'https://youtube.com'}${r.videos[i].url})` + '\n' + r.videos[i].author.name + "\n", true);
                        }
                        msg.channel.send(embed);
                    }
                    const collec = (msg, count) => {
                        const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {
                            max: 1,
                            time: 100000
                        });
                        show(msg, count);
                        collector.on('collect', m => {
                            try {
                                let num = parseInt(m.content);
                                if(!isNaN(num)) {
                                    play("https://youtube.com" + r.videos[num - 1].url);
                                } else {
                                    if (m.content === 'next') {
                                        collec(msg, count + 1);
                                    }
                                    else if (m.content === 'prev' && count > 1) {
                                        collec(msg, count - 1);
                                    }
                                    else {
                                        collec(msg, count);
                                    }
                                }
                            } catch (e) {

                            }
                        });
                    };
                    collec(msg, 1);
                } catch (e) {
                    msg.channel.send("검색 결과가 없습니다!");
                    console.log(e);
                }

            });
        } else {
            play(url);
        }
    },
    'exit': (msg, command) => {
        try {
            msg.member.voice.channel.leave();
        } catch (e) {
            
        }
    },
    'sc': (msg, command) => {
        const raw1 = stringhandler.cutTextHead('sc ', command);
        if (!raw1) return msg.channel.send("인자가 없습니다.");
        if (raw1.indexOf("soundcloud.com") !== -1) {
            request("http://api.soundcloud.com/resolve.json?url=" + raw1 + "&client_id=aGG0HvvLMMohiFsNq85gvca9MB6wAxHP", function (error, response, body) {
                if (error) msg.reply(error);
                else if (response.statusCode === 200) {
                    body = JSON.parse(body);
                    let embed = new Discord.MessageEmbed()
                        .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
                        .setColor(`${config.color}`)
                        .setTitle(body.title)
                        .setURL(raw1)
                        .setThumbnail(body.artwork_url)
                        .addField("정보", " by **" + body.user.username + "** *(" + Math.floor(body.duration / 1000) + " 초)* ")
                        .setFooter("#" + body.id);
                    msg.channel.send(embed);
                    msg.member.voice.channel.join().then(connection => {
                        console.log(body.download_url + "?client_id=aGG0HvvLMMohiFsNq85gvca9MB6wAxHP");
                        https.get(body.download_url + "?client_id=aGG0HvvLMMohiFsNq85gvca9MB6wAxHP", (response) => {
                            if (response.statusCode !== 200) {
                                return console.log('Response status was ' + response.statusCode);
                            }
                            let outStream = fs.createWriteStream('./sc/' + body.id + '.mp3');
                            response.pipe(outStream);
                            let write = fs.createWriteStream('./sc/' + body.id);
                            write.on('end', () => {
                                ffmpeg('./sc/' + body.id)
                                    .inputFormat('mp3')
                                    .on('error', function(err) {
                                        console.log('An error occurred: ' + err.message);
                                    })
                                    .pipe(outStream)
                                    .end()
                                let streamOptions = {seek: 0, volume: 1, bitrate: 64000};
                                const dispatcher = connection.playFile('./sc/' + body.id + '.mp3', streamOptions);
                                dispatcher.on("end", end => {
                                    msg.channel.send("노래가 끝났습니다!");
                                    msg.member.voice.channel.leave();
                                });
                            });
                        });
                    });
                }
            });
        }
    }
};
