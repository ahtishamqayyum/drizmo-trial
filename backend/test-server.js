// Simple HTTP server to serve the HTML test file
// This avoids CORS issues with file:// protocol
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'template-api-test.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`✅ Test server running at http://localhost:${PORT}`);
  console.log(`📝 Open http://localhost:${PORT} in your browser to test APIs`);
});


