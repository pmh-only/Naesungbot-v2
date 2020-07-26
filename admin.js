
try {
  delete require.cache[require.resolve('./data/admins.json')]
} catch (e) {

}
try {
  exports.list = require('./data/admins.json')
} catch (e) {
  exports.list = []
}

exports.check = function (id) {
  return exports.list.includes(Number(id))
}

// 관리 TODO
