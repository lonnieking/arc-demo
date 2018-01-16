var arc = require('@architect/functions')
var layout = require('@architect/shared/layout.js')
var log = require('@architect/shared/middleware/log.js')

function route(req, res) {
  var body = `hello world`

  res({ html: layout(req, body) })
}

exports.handler = arc.html.get(log, route)
