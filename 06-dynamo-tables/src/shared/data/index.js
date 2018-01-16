var path = require('path')
var arc = require('@architect/data')

var arcPath = path.join(__dirname, '..', '.arc')
module.exports = arc(arcPath)
