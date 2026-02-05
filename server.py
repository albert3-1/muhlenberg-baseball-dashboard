from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

# Use environment variables (works on Render and locally)
# Locally, you can still use a .env file with python-dotenv
try:
    from dotenv import dotenv_values
    config = dotenv_values('.env')
    ANTHROPIC_API_KEY = config.get('ANTHROPIC_API_KEY') or os.environ.get('ANTHROPIC_API_KEY')
except ImportError:
    ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/scout-report', methods=['POST'])
def scout_report():
    if not ANTHROPIC_API_KEY:
        return jsonify({'error': 'API key not configured'}), 500

    data = request.json
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400

    try:
        response = requests.post(
            'https://api.anthropic.com/v1/messages',
            headers={
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            json={
                'model': 'claude-sonnet-4-20250514',
                'max_tokens': 2000,
                'messages': [{'role': 'user', 'content': prompt}]
            }
        )

        if response.status_code != 200:
            return jsonify({'error': f'Anthropic API error: {response.text}'}), response.status_code

        result = response.json()
        return jsonify({'report': result['content'][0]['text']})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    if not ANTHROPIC_API_KEY:
        print("WARNING: ANTHROPIC_API_KEY not set")
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting server on http://localhost:{port}")
    app.run(debug=True, port=port)
