const config = require('./botsetting.json')
const blacklist = require('./blacklist')
const client = require('./client').client
const web = require('./BetweenBot-Web/app')
const moduleloader = require('./moduleloader')
const stringhandler = require('./stringhandler')

web.run()

function prefixCheckAndIfExistsRun (prefix, msg, func) {
  if (msg.content.startsWith(prefix)) func(msg)
}

function blackListCheck (msg) {
  if (blacklist.check((msg.author.id))) {
    msg.reply(msg, '당신은 이 봇을 쓸 수 없습니다!')
    return true
  } else {
    return false
  }
}

function bulkCommandCheck (msg, command, aBunchOfFunctions) {
  try {
    for (const func of aBunchOfFunctions) {
      if (func(msg, command)) throw new Error('Gotcha!')
    }
    throw new Error('Not Gotcha!')
  } catch (e) {
    if (e === 'Gotcha!') return true
    else if (e === 'Not Gotcha!') return false
    // 이건 예측되지 못한 오류가 발생했다는 의미입니다.
    // 이 경우에는 함수의 코드를 수정해야 합니다.
    else {
      console.log('이건 예측되지 못한 오류가 발생했다는 의미입니다.')
      console.log('이 경우에는 함수의 코드를 수정해야 합니다.')
      console.log('오류:', e)
      throw e
    }
  }
}

function ifCommandStartsWithExpectedRunFuncTemplate (expected, func) {
  // 이걸 직접 사용하지 마세요.
  // pushStartsWithTemplate 함수를 이용하세요.
  return (msg, command) => {
    if (command.startsWith(expected)) {
      func(msg, command)
      return true
    } else {
      return false
    }
  }
}

function pushFunc (arr, expected, template, func) {
  arr.push(template(expected, func))
}

function pushStartsWithTemplate (arr, expected, func) {
  pushFunc(arr, expected, ifCommandStartsWithExpectedRunFuncTemplate, func)
}

function loadModules () {
  for (const dict of moduleloader.modules.values()) {
    for (const [name, func] of Object.entries(dict)) {
      pushStartsWithTemplate(externalFunctions, name, func)
    }
  }
}

const externalFunctions = []

loadModules()

client.on('ready', () => {
  console.log('내성봇 실행중!')
})

client.on('message', msg => {
  if (msg.author.bot) return
  if (msg.channel.type === 'dm') {
    msg.channel.send('내성봇은 DM에서는 쓸 수 없습니다!')
    return
  }
  prefixCheckAndIfExistsRun(config.prefix, msg, (msg) => {
    blackListCheck(msg)
    const command = stringhandler.cutTextHead(config.prefix, msg.content)
    if (!bulkCommandCheck(msg, command, externalFunctions)) {
      if (command === 'help') {
        let helpstr = '```내성봇 커맨드 리스트:\n\n'
        let index = 0
        for (const dict of moduleloader.modules.values()) {
          for (const [name] of Object.entries(dict)) {
            index += 1
            helpstr += name
            if (index % 5 === 0) helpstr += '\n'
            else helpstr += ' '
          }
        }
        helpstr += '```'
        msg.author.send(helpstr)
      } else msg.channel.send('유효한 명령어가 아닙니다!')
    }
  })
})

client.login(config.token)
