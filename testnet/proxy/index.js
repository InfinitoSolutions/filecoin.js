var http = require('http'),
    httpProxy = require('http-proxy');
//
// Setup our server to proxy standard HTTP requests
//
var proxy = new httpProxy.createProxyServer({
    target: {
      host: 'localhost',
      port: 4502
    }
  });

  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,POST,PUT,DELETE');

    if (proxyReq.method === 'OPTIONS'){
      res.statusCode = 200;
      res.end();
      return;
    }
  });

  var proxyServer = http.createServer(function (req, res) {
    proxy.web(req, res);
  });

  //
  // Listen to the `upgrade` event and proxy the
  // WebSocket requests as well.
  //
  proxyServer.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  proxyServer.listen(8000);