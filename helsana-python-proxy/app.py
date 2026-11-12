from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с любого сайта

BOT_TOKEN = '9058538400:AAF98ajxs7U51eNk8hg0nf1B6VaahEUFrCI'
CHAT_ID = '-1003907097706'

@app.route('/send', methods=['POST'])
def send_to_telegram():
    data = request.get_json()
    message = data.get('message', '')

    if not message:
        return jsonify({'ok': False, 'error': 'Message is required'}), 400

    url = f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage'
    payload = {
        'chat_id': CHAT_ID,
        'text': message,
        'parse_mode': 'Markdown'
    }

    try:
        response = requests.post(url, json=payload)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@app.route('/')
def index():
    return 'Helsana Python Proxy is running'

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
