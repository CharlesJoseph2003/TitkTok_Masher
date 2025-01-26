from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/api/url', methods=['POST'])
def receive_url():
    try:
        print("\n" + "="*50)
        print("RECEIVED NEW REQUEST!")
        
        data = request.json
        if not data:
            print("ERROR: No JSON data received")
            return jsonify({'error': 'No JSON data received'}), 400
            
        url = data.get('url')
        if not url:
            print("ERROR: No URL provided in the data")
            return jsonify({'error': 'No URL provided'}), 400
        
        print(f"✨ RECEIVED URL: {url} ✨")
        print("="*50 + "\n")
        return jsonify({'message': 'URL received successfully', 'url': url})
        
    except Exception as e:
        print(f"ERROR processing request: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n🚀 Starting Flask Server...")
    app.run(debug=True, port=5000)
