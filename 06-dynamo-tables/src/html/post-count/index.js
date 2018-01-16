var arc = require('@architect/functions')
var log = require('@architect/shared/middleware/log.js')

function route(req, res) {
  var count = req.session.count || 0

  res({
    session: { count: count + 1 },
    location: req._url('/')
  })
}

exports.handler = arc.html.post(log, route)
