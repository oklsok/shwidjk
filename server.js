const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// CORS — разрешаем запросы с других доменов (например, helsana-ag.com)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.static(__dirname));

// Явный маршрут для главной страницы (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const LOG_FILE = path.join(__dirname, 'clicks.json');

// Прием кликов
app.post('/save_click', (req, res) => {
    const clickData = req.body;
    if (!clickData) return res.status(400).send('No data');

    let clicks = [];
    if (fs.existsSync(LOG_FILE)) {
        try {
            clicks = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
        } catch (e) {
            clicks = [];
        }
    }
    clicks.push(clickData);
    fs.writeFileSync(LOG_FILE, JSON.stringify(clicks, null, 2));
    res.status(200).send('OK');
});

// Страница просмотра (секретная ссылка)
app.get('/view_clicks', (req, res) => {
    let clicks = [];
    if (fs.existsSync(LOG_FILE)) {
        try {
            clicks = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
        } catch (e) {
            clicks = [];
        }
    }
    
    let rows = clicks.reverse().map(c => `
        <tr>
            <td>${c.time || ''}</td>
            <td>${c.tagName || ''}</td>
            <td>${c.id || ''}</td>
            <td>${c.className || ''}</td>
            <td>${c.x || ''}</td>
            <td>${c.y || ''}</td>
            <td>${c.url || ''}</td>
            <td>${(c.text || '').substring(0, 50)}</td>
        </tr>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Click Log</title>
            <style>
                body { font-family: monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #444; padding: 6px; text-align: left; }
                th { background: #333; }
                tr:hover { background: #2a2a2a; }
                .controls { margin-bottom: 15px; }
                button { padding: 8px 16px; background: #0e639c; color: white; border: none; cursor: pointer; border-radius: 4px; }
                button:hover { background: #1177bb; }
            </style>
        </head>
        <body>
            <div class="controls">
                <h1>Click Log (${clicks.length} entries)</h1>
                <button onclick="location.reload()">Refresh</button>
            </div>
            <table>
                <tr>
                    <th>Time</th><th>Tag</th><th>ID</th><th>Class</th>
                    <th>X</th><th>Y</th><th>URL</th><th>Text</th>
                </tr>
                ${rows}
            </table>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Click log available at /view_clicks`);
});
