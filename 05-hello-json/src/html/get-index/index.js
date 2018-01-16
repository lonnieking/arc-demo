var arc = require('@architect/functions')
var layout = require('@architect/shared/layout.js')
var log = require('@architect/shared/middleware/log.js')

function route(req, res) {
  var body = `
    <h1>${ req.session.count || 0 }</h1>
    <form action=${req._url(`/count`)} method=post>
      <button>plus one</button>
    </form>
  `

  res({ html: layout(req, body) })
}

exports.handler = arc.html.get(log, route)
