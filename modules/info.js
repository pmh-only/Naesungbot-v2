const Discord = require('discord.js')
const melon = require('melon-chart-api')
const config = require('../botsetting.json')
const filehandler = require('../filehandler')
const osu = require('node-osu')
const api = new osu.Api(`${config.osu}`, {
  notFoundAsError: true,
  completeScores: false
})
const stringhandler = require('../stringhandler')
const admin = require('../admin')
const client = require('../client').client
const request = require('request')

module.exports = {
  ping: (msg) => {
    msg.reply(':ping_pong:' + Math.round(client.ws.ping) + 'ms')
  },
  info: (msg) => {
    const infoembed = new Discord.MessageEmbed()
      .setTitle('Information of Naesungbot')
      .setColor(`${config.color}`)
      .addField('Date', '2018년 7월 1일', true)
      .addField('User', `${client.users.cache.size}`, true)
      .addField('Server', `${client.guilds.cache.size}`, true)
      .addField('Number of User', `${client.users.cache.filter(a => a.bot === false).size}`, true)
      .addField('Number of Bot', `${client.users.cache.filter(a => a.bot === true).size}`, true)
      .setTimestamp()
    msg.channel.send(infoembed)
  },
  userinfo: (msg, command) => {
    const args = stringhandler.argsParse('userinfo', command)
    function senduserinfo (user) {
      embed.setAuthor('User Information')
        .setColor(`${config.color}`)
        .setAuthor(user.username)
        .setDescription(`Information of ${user.username}`)
        .setThumbnail(user.displayAvatarURL)
        .addField('Name:', `${user.tag}`)
        .addField('ID:', `${user.id}`)
        .addField('Creation Date:', user.createdAt)
      msg.channel.send(embed)
    }
    const embed = new Discord.MessageEmbed()
    if (args.length === 1) {
      const user = msg.author
      senduserinfo(user)
    } else if (args.length === 2) {
      const user = msg.mentions.users.first()
      senduserinfo(user)
    } else {
      msg.channel.send('Too much factors.')
    }
  },
  serverinfo: (msg) => {
    const serverembed = new Discord.MessageEmbed()
      .setDescription('Server Information')
      .setColor(`${config.color}`)
      .setThumbnail(msg.guild.iconURL)
      .addField('Name', msg.guild.name)
      .addField('Creation Date', msg.guild.createdAt)
      .addField('Join Date', msg.member.joinedAt)
      .addField('Number of Member', msg.guild.memberCount)
      .addField('Role', msg.guild.roles.cache.cache.reduce((role, result) => { result += role + ' ' }))
      .addField('Owner', msg.guild.owner)
      .addField('Channel', msg.guild.channels.cache.size)
      .addField('ID', msg.guild.id)
    msg.channel.send(serverembed)
  },
  botinfo: (msg) => {
    if (admin.check(msg.author.id)) {
      const embed = new Discord.MessageEmbed()
        .setTitle('Information of Naesungbot')
        .setColor(`${config.color}`)
        .addField('User', `${client.users.cache.size}`, true)
        .addField('Server', `${client.guilds.cache.size}`, true)
        .addField('Number of User', `${client.users.cache.filter(a => a.bot === false).size}`, true)
        .addField('Number of Bot', `${client.users.cache.filter(a => a.bot === true).size}`, true)
        .setTimestamp()
      msg.channel.send(embed)
    } else {
      msg.reply('You have no permission!')
    }
  },
  melon: (msg) => {
    let now = new Date()
    const embed = new Discord.MessageEmbed()
    now = (now.getMonth + 1) + '/' + now.getDate() + '/' + now.getFullYear
    melon(now, { cutLine: 1 }).daily().then(res => {
      res.data.forEach(item => {
        const res1 = item.rank + ' 위'
        const res6 = item.title + ' - ' + item.artist
        embed.addField(res1, res6, true)
      })
      msg.channel.send(embed)
    })
  },
  roleinfo: (msg, command) => {
    const args = stringhandler.argsParse('roleinfo', command)
    let role = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0]) || msg.guild.roles.cache.find(role => role.name === args[0])
    if (!role) role = msg.member.roles.highest
    const embed = new Discord.MessageEmbed()
      .setColor(role.hexColor)
      .setTitle(`역할: ${role.name}`)
      .addField('멤버', role.members.size)
      .addField('색상', role.hexColor)
      .addField('만든 날짜', role.createdAt.toDateString())
      .addField('편집 가능 여부', role.editable.toString())
      .addField('관리 권한', role.managed.toString())
      .addField('아이디', role.id)
    msg.channel.send(embed)
  },
  hex: (msg) => {
    const color = ((1 << 24) * Math.random() | 0).toString(16)
    const embed = new Discord.MessageEmbed()
      .setTitle(`#${color}`)
      .setColor(`#${color}`)
    msg.channel.send({ embed: embed })
  },
  datalist: (msg) => {
    if (admin.check(msg.author.id)) {
      const files = filehandler.getFileList()
      for (const file of files) {
        msg.reply(file)
      }
    } else {
      msg.reply('You have no permission!')
    }
  },
  한강: (msg) => {
    const url = 'http://hangang.dkserver.wo.tc/'
    request(url, function (err, response, body) {
      if (err) {
        return msg.reply('에러')
      }
      body = JSON.parse(body)
      if (body.result) {
        if (body.temp && body.time) {
          const embed = new Discord.MessageEmbed()
            .setColor(`${config.color}`)
            .setTimestamp()
            .setTitle('한강 물 온도')
            .setURL('https://www.wpws.kr/hangang/')
            .addField('물 온도', body.temp, true)
            .addField('최종 확인 시간', body.time, true)
          msg.channel.send(embed)
        }
      }
    })
  },
  osu: (msg, command) => {
    const username = stringhandler.argsParse('osu', command)[0]
    if (!username[0]) return msg.channel.send('osu닉네임을 적어주세요!')
    api.getUser({ u: username }).then(user => {
      const embed = new Discord.MessageEmbed()
        .setThumbnail(`http://s.ppy.sh/a/${user.id}`)
        .setColor('#D0436A')
        .addField('Name', user.name, true)
        .addField('PP', Math.round(user.pp.raw), true)
        .addField('Rank', user.pp.rank, true)
        .addField('Level', Math.round(user.level), true)
        .addField('Nation', user.country, true)
        .addField('Rank in Nation', user.pp.countryRank, true)
        .addField('Play', user.counts.plays, true)
        .addField('Accuracy', `${user.accuracyFormatted}`, true)
        .setFooter('Request By' + msg.author.tag, msg.author.avatarURL)
      msg.channel.send(embed)
    })
  },
  mc: (msg, command) => {
    const name = stringhandler.argsParse('mc', command)[0]
    if (!command[0]) return msg.channel.send('Please type a nickname!')
    const url = 'https://api.mojang.com/users/profiles/minecraft/' + `${name}`
    request(url, function (err, response, body) {
      if (err) {
        return msg.reply('Error Occured.')
      }
      body = JSON.parse(body)
      if (body.id && body.name) {
        const url1 = `https://visage.surgeplay.com/full/512/${body.id}`
        const url2 = `https://visage.surgeplay.com/head/512/${body.id}`
        const url3 = `https://visage.surgeplay.com/face/512/${body.id}`
        const embed = new Discord.MessageEmbed()
          .setColor(`${config.color}`)
          .setTimestamp()
          .setAuthor(`${msg.author.username}`, url3)
          .setTitle(`${body.name}의 마인크래프트 정보`)
          .addField('Name', body.name, true)
          .addField('uuid', body.id, true)
          .setThumbnail(url2)
          .setImage(url1)
        msg.channel.send(embed)
      } else {
        msg.channel.send('마크닉네임이 없습니다')
      }
    })
  },
  uptime: (msg) => {
    function parse (a) {
      a = Number(a.toString().split('.')[0])
      const day = Math.floor(a / 86400)
      a -= day * 86400
      const hour = Math.floor(a / 3600)
      a -= hour * 3600
      const minute = Math.floor(a / 60)
      a -= minute * 60
      const second = a
      return day + 'd ' + hour + 'h ' + minute + 'm ' + second + 's'
    }
    msg.channel.send(parse(process.uptime()))
  }
}
