from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_URL = ""
API_KEY = ""

@app.route('/api/optimize', methods=['POST'])
def optimize():
    try:
        data = request.json
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": API_KEY
        }
        
        response = requests.post(
            API_URL,
            headers=headers,
            json=data,
            verify=False,
            timeout=60
        )
        
        return jsonify(response.json()), response.status_code
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("=" * 50)
    print("提示词优化助手代理服务器")
    print("=" * 50)
    print("服务器地址: http://localhost:5000")
    print("请在浏览器中打开 index.html 使用")
    print("按 Ctrl+C 停止服务器")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)