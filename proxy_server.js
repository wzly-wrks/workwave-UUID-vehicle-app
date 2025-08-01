const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const TERRITORY_ID = process.env.TERRITORY_ID;
const WORKWAVE_BASE_URL = 'https://wwrm.workwave.com';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:8082';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/api/vehicles') {
    handleVehiclesAPI(req, res);
    return;
  }

  const basePath = __dirname;
  const pathname = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  const safePath = path.normalize(path.join(basePath, pathname));
  if (!safePath.startsWith(basePath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN });
    res.end('Forbidden');
    return;
  }

  const extname = String(path.extname(safePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(safePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN });
        res.end('404 Not Found', 'utf-8');
      } else {
        res.writeHead(500, { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN });
        res.end('Server Error: ' + error.code + ' ..\\n');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end(content, 'utf-8');
    }
  });
});

function handleVehiclesAPI(req, res) {
  if (!API_KEY || !TERRITORY_ID) {
    res.writeHead(500, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN
    });
    res.end(JSON.stringify({ error: 'Server not configured' }));
    return;
  }

  const apiUrl = `${WORKWAVE_BASE_URL}/api/v1/territories/${TERRITORY_ID}/vehicles`;

  const options = {
    method: 'GET',
    headers: {
      'X-WorkWave-Key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const apiReq = https.request(apiUrl, options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end(data);
    });
  });

  apiReq.on('error', (error) => {
    console.error('API Error:', error);
    res.writeHead(500, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN
    });
    res.end(JSON.stringify({ error: 'Failed to fetch vehicles', details: error.message }));
  });

  apiReq.end();
}

const PORT = 8082;
server.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}/`);
});
