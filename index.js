import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 10000;

// Разрешаем запросы с любого сайта (для теста)
app.use(cors());
app.use(express.json());

const BOT_TOKEN = '9058538400:AAF98ajxs7U51eNk8hg0nf1B6VaahEUFrCI';
const CHAT_ID = '-1003907097706';

app.post('/send', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ ok: false, error: 'Message is required' });
  }

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const data = await tgResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Простой health-check
app.get('/', (req, res) => {
  res.send('Helsana Proxy is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
