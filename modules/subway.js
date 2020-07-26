
// beta 서비스입니다. 일단 규모가 적당한 부산광역시 대상.
/* module.exports = {
  'busansub': (msg, command) => {
    var InfoEmbed = new Discord.MessageEmbed()
            .setColor("#2fce64")
            .setTitle(`부산도시철도 알림봇`)
            .addField(`busansub : DM으로 도움 메시지를 보냅니다.`)
            .addField(`busansub (number) : 1호선의 정보를 표시합니다.`)
            .addField(`busansub (station) : 2호선의 정보를 표시합니다.`)
            .addField(`busansub  : 3호선의 정보를 표시합니다.`)
            .addField(`부산 4호선 : 4호선의 정보를 표시합니다.`)
            .addField(`부산 부산김해경전철 : 부산김해경전철의 정보를 표시합니다.`)
            .addField(`부산 부김경 : 부산김해경전철의 정보를 표시합니다.`)
            .addField(`부산 동해선 : 동해선의 정보를 표시합니다.`)
            .addField(`부산 1호선역목록 : 1호선 역 목록을 표시합니다.`)
            .setFooter("Naesungbot", client.user.avatarURL);
        msg.author.send(InfoEmbed);
        msg.channel.send("Send to :regional_indicator_d::regional_indicator_m:.");
    }

  'busansubsta'; (msg, command) => {
    let station = stringhandler.cutTextHead('busansubsta ', command);
      const $url = 'http://data.humetro.busan.kr/voc/api/open_api_process.tnn?act=json
      const $KEY = 't08ZNLnI3UhYeDaYDk9qnM4WgZLRlavR%2Frw%2Fb1nDj3at5BV6xOyaE2OuGy1kS3GGqlJRyYgEJ15uVkLlC7EMkQ%3D%3D'
      const $station = (station)
      const $api_url = $url + '&scode=' + $station +
      &day=1&updown=0&stime=13&enum=3&serviceKey=서비스키
*/
