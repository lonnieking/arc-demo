var arc = require('@architect/functions')

function route(req, res) {
  console.log(JSON.stringify(req, null, 2))
  res({html:`I love lambda`})
}

exports.handler = arc.html.get(route)
