```
#                                '||`                                      '||            
#                                 ||                                        ||            
#  '\\    //` .|''|, .|''|, '''/  ||  '||  ||`    '\\    //` .|''|, '||''|  || //`  ('''' 
#    \\/\//   ||..|| ||..||  //   ||   `|..||       \\/\//   ||  ||  ||     ||<<     `'') 
#     \/\/    `|...  `|...  /... .||.      ||  ..    \/\/    `|..|' .||.   .|| \\.  `...' 
#                                       ,  |'                                             
#                                                                     
```

# WorkWave Route Manager UUID Vehicle App

A small but mighty web app that connects to WorkWave's Route Manager API and shows you each vehicle's UUID from their External ID. Built with Node.js, no frameworks, no fluff.

---

## 🚀 Features

* **Vehicle Lookup** – Get UUIDs from External IDs instantly
* **Real-time Data** – Pulls live info via WorkWave API
* **CORS-Handled** – Secure proxy server means no browser tantrums
* **Mobile Friendly** – Clean UI works on phones too
* **No API keys exposed** – All calls are server-side

---

## ⚙️ Quick Start

### Prereqs

* Node.js (v14 or higher)
* A valid WorkWave Route Manager API key

### Install & Run

```bash
npm install
npm start
```

Or run directly:

```bash
node proxy_server.js
```

Then open your browser to: [http://localhost:8082](http://localhost:8082)

---

## 💡 .env Setup

Create a `.env` file in the project root like this:

```env
API_KEY=your_workwave_api_key
TERRITORY_ID=your_territory_id
ALLOWED_ORIGIN=http://localhost:8082
```

✅ This file is git-ignored, so your keys stay private.

---

## 🔌 API Routes

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| GET    | `/`             | Main web interface           |
| GET    | `/api/vehicles` | Proxied call to WorkWave API |

---

## 🧾 File Structure

```
workwave-vehicle-app/
├── index.html        # UI
├── app.js            # Frontend logic
├── style.css         # Styling
├── proxy_server.js   # Node.js backend
├── package.json      # NPM config
└── .env              # (not committed)
```

---

## 💡 Usage

1. Open the app
2. Wait for vehicle data to load
3. Select a vehicle from the dropdown
4. View its UUID and metadata
5. Hit “Refresh” if you’ve updated WorkWave

---

## 🪨 Common Issues

* **API not working?** Double-check your `.env` values
* **Port already in use?** Change the `PORT` in `proxy_server.js`
* **CORS errors?** You shouldn't see any — that's the proxy's job

---

## 🧐 Author

Built with ❤️ in ~/Los_Angeles by [wzly.wrks](https://weezly.works).

---

## 🧼 License

MIT — Use it, modify it, deploy it. Just don’t expose your API keys, and we’re cool.
