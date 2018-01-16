var arc = require('@architect/functions')
var log = require('@architect/shared/middleware/log.js')

function route(req, res) {
  res({
    json: { msg: "hello JSON" }
  })
}

exports.handler = arc.json.get(log, route)
