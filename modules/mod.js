const admin = require('../admin')
const blacklist = require('../blacklist')
const Discord = require('discord.js')
const config = require('../botsetting.json')
const client = require('../client').client
const stringhandler = require('../stringhandler')
const filehandler = require('../filehandler')

module.exports = {
  admin: (msg) => {
    if (admin.check(msg.author.id)) {
      msg.reply('You are admin!')
    } else {
      msg.reply('You are not Admin!')
    }
  },
  addblacklist: (msg, command) => {
    if (admin.check(msg.author.id)) {
      const blacklistid = command.split(' ')[1]
      if (!blacklistid) return
      blacklist.add(blacklistid)
      msg.reply(blacklistid + 'cannot use this bot.')
    } else {
      msg.reply('You have no permission!')
    }
  },
  delblacklist: (msg, command) => {
    if (admin.check(msg.author.id)) {
      const notblacklistid = command.split(' ')[1]
      if (!notblacklistid) return
      blacklist.remove(notblacklistid)
      msg.channel.send(notblacklistid + 'can use this bot!')
    } else {
      msg.reply('You have no permission!')
    }
  },
  blacklist: (msg) => {
    if (admin.check(msg.author.id)) {
      msg.msg.reply('blacklist: ')
      for (const id of blacklist.get()) {
        msg.channel.send(id)
      }
    } else {
      msg.reply('You have no permission!')
    }
  },
  ban: (msg) => {
    const args = stringhandler.argsParse('ban', 'command')
    if (!msg.member.hasPermission('BAN_MEMBERS')) {
      msg.reply('You have no permission!')
      return
    }
    if (args[0] === 'help') {
      msg.reply(`: ${config.prefix}n!ban @mention reason`)
      return
    }
    const bUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]))
    if (!bUser) return msg.channel.send('Error')
    if (bUser.id === client.user.id) return msg.send('Error')
    const bReason = args.join(' ').slice(2)
    if (!bReason) return msg.channel.send('Error')
    const banEmbed = new Discord.MessageEmbed()
      .setDescription('ban')
      .setColor(`${config.color}`)
      .addField('Ban User', `${bUser}, ID: ${bUser.id}`)
      .addField('Banned User', `<@${msg.author.id}>, ID: ${msg.author.id}`)
      .addField('Banned Channel', msg.channel)
      .addField('Time', msg.createdAt)
      .addField('Reason', bReason)
    msg.reply(bUser.tag)
    msg.guild.members.ban(bUser)
    msg.channel.send(banEmbed)
  },
  clear: (msg, command) => {
    const args = stringhandler.argsParse('clear', command)
    if (!args[0]) return msg.reply('Please write a number.')
    msg.channel.bulkDelete(Number(args[0]) + 1).then(() => {
      msg.reply(`Deleted ${args[0]} messages.`)
    })
  },
  unban: (msg) => {
    const args = stringhandler.argsParse('unban', 'command')
    if (!msg.member.hasPermission('BAN_MEMBERS')) {
      msg.reply('You have no permission!')
      return
    }
    if (args[1] === 'help') {
      msg.reply(`: ${config.prefix}n!unban @mention reason`)
      return
    }
    const unbUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]))
    if (!unbUser) return msg.channel.send('Error')
    if (unbUser.id === client.user.id) return msg.channel.send('Error')
    const unbReason = args.join(' ').slice(22)
    if (!unbReason) return msg.channel.send('Error')
    const unbanEmbed = new Discord.MessageEmbed()
      .setDescription('Unban')
      .setColor(`${config.color}`)
      .addField('Unban User', `${unbUser}, ID: ${unbUser.id}`)
      .addField('Unbanned User', `<@${msg.author.id}>, ID: ${msg.author.id}`)
      .addField('Time', msg.createdAt)
      .addField('Reason', unbReason)
    msg.guild.members.unban(unbUser)
    msg.channel.send(unbanEmbed)
  },

  userlist: (msg) => {
    if (admin.check(msg.author.id)) {
      const guildList = new Map()
      client.guilds.cache.forEach(guild => {
        const guildToStore = new Map()
        guild.members.cache.forEach(member => {
          guildToStore.set(member.displayName, member.id)
        })
        console.log(guildToStore)
        guildList.set(guild.name, JSON.stringify([...guildToStore]))
      })
      filehandler.saveFile('users.json', JSON.stringify([...guildList]))
    } else {
      msg.reply('You have no permission!')
    }
  },
  mute: (msg) => {
    const args = stringhandler.argsParse('mute', 'command')
    const tomute = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]))
    if (!tomute) return msg.reply('Cannot find a user.')
    if (tomute.hasPermission('MANAGE_MESSAGES')) return msg.reply('You have no permission!')
    let muterole = msg.guild.roles.cache.find('name', 'muted')
    if (!muterole) {
      muterole = msg.guild.createRole({
        name: 'muted',
        color: '#000000',
        permissions: []
      })
      msg.guild.channels.cache.forEach(async (channel) => {
        channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        })
      })
    }
    tomute.addRole(muterole.id)
    msg.reply(`Muted <@${tomute.id}>`)
  },
  unmute: (msg) => {
    const args = stringhandler.argsParse('unmute', 'command')
    const tomute = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]))
    if (!tomute) return msg.reply('유저를 찾을 수 없습니다')
    if (tomute.hasPermission('MANAGE_MESSAGES')) return msg.reply('You have no permission!')
    const muterole = msg.guild.roles.cache.find('name', 'muted')
    tomute.removeRole(muterole.id)
    msg.reply(`<@${tomute.id}> 을 언뮤트 했습니다`)
  },
  addchannel: (msg, command) => {
    if (!msg.member.hasPermission('MANAGE_CHANNELS')) {
      msg.reply('You have no permission!')
      return
    }
    const channel = stringhandler.argsParse('채널 추가', command)[0]
    msg.guild.channels.create(channel, 'text')
      .then(console.log)
      .catch(console.error)
  },
  guildedit: (msg, command) => {
    if (!msg.member.hasPermission('MANAGE_GUILD')) {
      msg.reply('You have no permission!')
      return
    }
    const guild = stringhandler.argsParse('길드 수정', command)[0]
    msg.guild.edit({
      name: guild
    })
  },
  invite: (msg) => {
    if (!msg.member.hasPermission('CREATE_INSTANT_INVITE')) {
      msg.reply('You have no permission!')
      return
    }
    msg.channel.createInvite()
      .then(invite => msg.channel.send(`discord.gg/${invite.code}`))
      .catch(console.error)
  },
  kick: (msg, command) => {
    const args = stringhandler.argsParse('kick', command)
    if (!msg.member.hasPermission('KICK_MEMBERS')) return
    if (args[0] === 'help') {
      msg.reply(`${config.prefix}kick <유저 맨션>`)
      return
    }
    const kUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]))
    msg.guild.members.fetch(kUser).kick('없음')
    msg.channel.send(kUser + ' 유저를 성공적으로 킥 했습니다')
  },
  // 'help': (msg, command) => {
  //     let help1Embed = new Discord.MessageEmbed()
  //         .setColor("#2fce64")
  //         .setTitle(`Naesungbot Help Page`)
  //         .addField(`infohelp`, `shows information`, true)
  //         .addField(`adminhelp`, `shows admin information`, true)
  //         .addField(`settinghelp` ,`shows setting information `, true)
  //         .addField(`musichelp`, ` shows music information `, true)
  //         .addField(`searchhelp`, `shows search information `, true)
  //         .addField(`otherhelp`, `shows other information `, true)
  //         .addField(`webhelp`, `shows web information `, true)
  //         .addField(`Invite Bot`, `https://bit.ly/Naesungbot`, true)
  //         .addField(`Bot Server`, `https://discord.gg/9SZ3pnT`, true)
  //         .setFooter("Naesungbot, All Rights Reserved", client.user.avatarURL);
  //     msg.author.send(help1Embed);
  //     msg.channel.send("Send to :regional_indicator_d::regional_indicator_m:.");
  // },
  // 'infohelp': (msg, command) => {
  //     let Info1Embed = new Discord.MessageEmbed()
  //         .setColor("#2fce64")
  //         .setTitle(`Naesungbot Info Page`)
  //         .addField(`hello`, `Hello`, true)
  //         .addField(`ping`, `Show ping`, true)
  //         .addField(`userinfo` ,`Shows user's information`, true)
  //         .addField(`serverinfo`, ` Shows information of server`, true)
  //         .addField(`botinfo`, `Shows information of bot`, true)
  //         .addField(`roleinfo`, `Shows information of role`, true)
  //         .addField(`uptime`, `Shows uptime of bot`, true)
  //         .setFooter("Naesungbot, All Rights Reserved", client.user.avatarURL);
  //     msg.author.send(Info1Embed);
  //     msg.channel.send("Send to :regional_indicator_d::regional_indicator_m:.");
  // },
  // 'settinghelp': (msg, command) => {
  //     let set1Embed = new Discord.MessageEmbed()
  //         .setColor("#2fce64")
  //         .setTitle(`Naesungbot Setting Page`)
  //         .addField(`translate`, `translate`, true)
  //         .addField(`language` ,`change language`, true)
  //         .setFooter("Naesungbot, All Rights Reserved", client.user.avatarURL);
  //     msg.author.send(set1Embed);
  //     msg.channel.send("Send to :regional_indicator_d::regional_indicator_m:.");
  // },
  // 'adminhelp': (msg, command) => {
  //     let admin1Embed = new Discord.MessageEmbed()
  //         .setColor("#2fce64")
  //         .setTitle(`Naesungbot Admin Page`)
  //         .addField(`ban`, `Hello`, true)
  //         .addField(`unban` ,`Shows user's information`, true)
  //         .addField(`kick`, ` Shows information of server`, true)
  //         .addField(`mute`, `Shows information of bot`, true)
  //         .addField(`unmute`, `Shows information of role`, true)
  //         .addField(`clear`, `Shows uptime of bot`, true)
  //         .addField(`addchannel`, `Shows information of bot`, true)
  //         .addField(`guildedit`, `Shows information of role`, true)
  //         .addField(`invite`, `Shows uptime of bot`, true)
  //         .setFooter("Naesungbot, All Rights Reserved", client.user.avatarURL);
  //     msg.author.send(admin1Embed);
  //     msg.channel.send("Send to :regional_indicator_d::regional_indicator_m:.");
  // },
  // 'musichelp': (msg, command) => {
  //     let music1Embed = new Discord.MessageEmbed()
  //         .setColor("#2fce64")
  //         .setTitle(`Naesungbot Music Page`)
  //         .addField(`play`, `play music`, true)
  //         .addField(`exit` ,`Stop music`, true)
  //         .addField(`sc`, `Soundcloud`, true)
  //         .setFooter("Naesungbot, All Rights Reserved", client.user.avatarURL);
  //     msg.author.send(music1Embed);
  //     msg.channel.send("Send to :regional_indicator_d::regional_indicator_m:.");
  // },
  // 'searchhelp': (msg, command) => {
  //     let search1Embed = new Discord.MessageEmbed()
  //         .setColor("#2fce64")
  //         .setTitle(`Naesungbot Search Page`)
  //         .addField(`google`, `Search at google`, true)
  //         .addField(`naver`, `Search at naver`, true)
  //         .addField(`daum` ,`Search at daum`, true)
  //         .addField(`nate`, `Search at nate`, true)
  //         .addField(`twitch`, `Search at twitch`, true)
  //         .addField(`mc` ,`Search minecraft account`, true)
  //         .addField(`osu`, `Search osu account`, true)
  //         .setFooter("Naesungbot, All Rights Reserved", client.user.avatarURL);
  //     msg.author.send(search1Embed);
  //     msg.channel.send("Send to :regional_indicator_d::regional_indicator_m:.");
  // },
  // 'otherhelp': (msg, command) => {
  //     let other1Embed = new Discord.MessageEmbed()
  //         .setColor("#2fce64")
  //         .setTitle(`Naesungbot Function Page`)
  //         .addField(`afk`, `set afk`, true)
  //         .addField(`dog`, `Shows a dog picture`, true)
  //         .addField(`neko` ,`Shows a cat picture `, true)
  //         .addField(`melon`, `Shows melon music list`, true)
  //         .addField(`hex`, `Shows color`, true)
  //         .addField(`한강` ,`Shows 한강 temperature`, true)
  //         .setFooter("Naesungbot, All Rights Reserved", client.user.avatarURL);
  //     msg.author.send(other1Embed);
  //     msg.channel.send("Send to :regional_indicator_d::regional_indicator_m:.");
  // },
  afk: (msg) => {
    //  client.setPresence({ afk });
    msg.channel.send('This user is now AFK.')
  }
}
