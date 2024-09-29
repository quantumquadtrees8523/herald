from firebase_functions import https_fn
from firebase_admin import initialize_app
from flask_cors import CORS
from flask import Flask, jsonify, request
import requests

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow cross-origin requests with credentials

# Initialize Firebase Admin SDK
initialize_app()

@https_fn.on_request()
def proxy_fetch(req: https_fn.Request) -> https_fn.Response:
    origin = req.headers.get('Origin', '')
    
    if req.method == 'OPTIONS':
        print("Received OPTIONS request")
        headers = {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
        }
        return https_fn.Response('', status=204, headers=headers)
    
    print("Received request to proxy_fetch")
    url = req.args.get('url')

    if not url:
        return https_fn.Response("Missing 'url' parameter", status=400)

    try:
        response = requests.get(url)
        
        # If the content is an image, return it as a blob with CORS headers
        if 'image' in response.headers.get('Content-Type', ''):
            return https_fn.Response(
                response.content, 
                status=response.status_code, 
                headers={
                    'Content-Type': response.headers['Content-Type'],
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Credentials': 'true'
                }
            )
        else:
            return https_fn.Response("The URL did not return an image", status=400)
    
    except requests.RequestException as e:
        print(f"Error fetching data: {str(e)}")
        return https_fn.Response(f"Error fetching data: {str(e)}", status=500)
