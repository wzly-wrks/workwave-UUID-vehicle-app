const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const TERRITORY_ID = process.env.TERRITORY_ID;
const WORKWAVE_BASE_URL = 'https://wwrm.workwave.com';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Handle API proxy requests
  if (parsedUrl.pathname === '/api/vehicles') {
    handleVehiclesAPI(req, res);
    return;
  }
  
  // Handle static file requests
  const publicDir = __dirname;
  let safePath = path.normalize(parsedUrl.pathname).replace(/^\/+/, '');
  if (safePath === '' || safePath === '/') safePath = 'index.html';
  const filePath = path.join(publicDir, safePath);

  // Prevent path traversal outside the public directory
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
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

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code == 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: '+error.code+' ..\n');
      }
    } else {
      const headers = {
        'Content-Type': contentType
      };
      if (ALLOWED_ORIGIN && req.headers.origin === ALLOWED_ORIGIN) {
        headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN;
        headers['Vary'] = 'Origin';
        headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      }
      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });
});

function handleVehiclesAPI(req, res) {
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
      const headers = { 'Content-Type': 'application/json' };
      if (ALLOWED_ORIGIN && req.headers.origin === ALLOWED_ORIGIN) {
        headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN;
        headers['Vary'] = 'Origin';
        headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      }
      res.writeHead(200, headers);
      res.end(data);
    });
  });
  
  apiReq.on('error', (error) => {
    console.error('API Error:', error);
    const headers = { 'Content-Type': 'application/json' };
    if (ALLOWED_ORIGIN && req.headers.origin === ALLOWED_ORIGIN) {
      headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN;
      headers['Vary'] = 'Origin';
    }
    res.writeHead(500, headers);
    res.end(JSON.stringify({ error: 'Failed to fetch vehicles', details: error.message }));
  });
  
  apiReq.end();
}

const PORT = 8082;
server.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}/`);
});