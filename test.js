var http = require('http')
http.createServer(function(request,response){
    response.writeHead(200,{'Content-type':'text/plain'})
    response.end('This is the first node http server')
}).listen(9999)