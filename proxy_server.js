const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const API_KEY = 'a0bfa651-1a5a-42ce-822f-4881aae18753';
const TERRITORY_ID = 'cadd21fb-e3bc-4b27-bdbe-40023e344ace';
const WORKWAVE_BASE_URL = 'https://wwrm.workwave.com';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Handle API proxy requests
  if (parsedUrl.pathname === '/api/vehicles') {
    handleVehiclesAPI(req, res);
    return;
  }
  
  // Handle static file requests
  let filePath = '.' + parsedUrl.pathname;
  if (filePath === './') filePath = './index.html';
  
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
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
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
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ error: 'Failed to fetch vehicles', details: error.message }));
  });
  
  apiReq.end();
}

const PORT = 8082;
server.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}/`);
});