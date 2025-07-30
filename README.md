# WorkWave Route Manager UUID Vehicle App

A web application that connects to WorkWave's Route Manager API to display vehicle External IDs and their corresponding UUIDs.

## Features

- 🚐 **Vehicle Lookup**: Select vehicles by External ID to view their UUID
- 🔄 **Real-time Data**: Fetches live data from WorkWave Route Manager API
- 🎨 **Professional UI**: Clean, responsive design with loading states
- 🔒 **Secure**: Server-side API calls to handle authentication
- 📱 **Mobile Friendly**: Works on desktop and mobile devices

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- WorkWave Route Manager API access

### Installation

1. **Extract the files** to a folder
2. **Open terminal/command prompt** in that folder
3. **Start the server**:
   ```bash
   npm start
   ```
   Or directly:
   ```bash
   node proxy_server.js
   ```
4. **Open your browser** to: `http://localhost:8082`

### Configuration

Edit `proxy_server.js` to update your credentials:

```javascript
const API_KEY = 'your-api-key-here';
const TERRITORY_ID = 'your-territory-id-here';
```

## How It Works

1. **Proxy Server**: Node.js server handles WorkWave API calls to avoid CORS issues
2. **Frontend**: HTML/CSS/JavaScript interface for vehicle selection
3. **API Integration**: Connects to WorkWave Route Manager API using X-WorkWave-Key authentication

## API Endpoints

- `GET /` - Main application page
- `GET /api/vehicles` - Proxy endpoint for WorkWave vehicles API

## File Structure

```
workwave-vehicle-app/
├── index.html          # Main webpage
├── app.js             # Frontend JavaScript
├── style.css          # Styling
├── proxy_server.js    # Node.js proxy server
├── package.json       # Node.js configuration
└── README.md          # This file
```

## Usage

1. Open the application in your browser
2. Wait for vehicles to load automatically
3. Select any vehicle from the dropdown
4. View the corresponding UUID and vehicle details
5. Use "Refresh Vehicles" to reload data after making changes in WorkWave

## Troubleshooting

- **Port already in use**: Change the PORT variable in `proxy_server.js`
- **API errors**: Verify your API_KEY and TERRITORY_ID are correct
- **CORS issues**: The proxy server handles this automatically

## Support

This application was created with ❤️ in ./Los_Angeles by wzly-wrks for WorkWave Route Manager integration.