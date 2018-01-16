module.exports = function layout(req, body) {
  var item = i => `
    <li>
      <a href=${req._url(i.href)}>${i.title}</a>
    </li>
  `

  var nav = [
    { href:'/about', title:'about' }
  ]

  return `
    <!doctype html>
    <html>
      <head>
        <title>arc-demo</title>
      </head>
      <body>
        <div class="container">
          <h2><a href='/'>arc-demo</a></h2>
          <div><ul>${ nav.map(item).join(' ') }</ul></div>
          <div>${ body }</div>
        </div>
      </body>
    </html>
  `
}
