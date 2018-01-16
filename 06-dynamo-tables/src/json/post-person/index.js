var arc = require('@architect/functions')
var log = require('@architect/shared/middleware/log.js')
var data = require('@architect/shared/data')

function route(req, res) {
  data.people.put(req.body, function _scan(err, results) {
    if(err) { res(err) }
    else { res({ json: req.body }) }
  })
}

exports.handler = arc.json.post(log, route)
