const filehandler = require('./filehandler')

let list
const refresh = () => {
  try {
    delete require.cache[require.resolve('./data/locale.json')]
  } catch (e) {

  }
  try {
    list = require('./data/locale.json')
  } catch (e) {
    list = ['ko']
    save()
  }
  return list[0]
}

exports.get = () => refresh()

const save = () => {
  filehandler.saveFile('locale.json', JSON.stringify(list))
}

exports.change = (lang) => {
  refresh()
  list[0] = lang
  save()
}
