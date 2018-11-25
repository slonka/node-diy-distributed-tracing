require('./load-tracing');

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
const port2 = 3001;

let delay = 3;

const server = http.createServer((req, res) => {
  console.log('s1: curl headers', req.headers);

  setTimeout(() => {
    http.request({host: hostname, port: port2}, (response) => {
      console.log('s1: response', response.headers);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello, World!\n');
    }).end();
  }, delay * 1000);
  delay = 0;
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});