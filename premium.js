
try {
  delete require.cache[require.resolve('./data/premium.json')]
} catch (e) {

}
try {
  exports.list = require('./data/premium.json')
} catch (e) {
  exports.list = []
}

exports.check = function (id) {
  return exports.list.includes(Number(id))
}

// 관리 TODO
