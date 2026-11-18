const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); // Раздает index.html и другие файлы

const LOG_FILE = path.join(__dirname, 'clicks.json');

// Прием кликов
app.post('/save_click', (req, res) => {
    const clickData = req.body;
    if (!clickData) return res.status(400).send('No data');

    let clicks = [];
    if (fs.existsSync(LOG_FILE)) {
        clicks = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    }
    clicks.push(clickData);
    fs.writeFileSync(LOG_FILE, JSON.stringify(clicks, null, 2));
    res.status(200).send('OK');
});

// Страница просмотра (секретная ссылка)
app.get('/view_clicks', (req, res) => {
    let clicks = [];
    if (fs.existsSync(LOG_FILE)) {
        clicks = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
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
            </style>
        </head>
        <body>
            <h1>Click Log (${clicks.length} entries)</h1>
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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Click log available at http://localhost:${PORT}/view_clicks`);
});
