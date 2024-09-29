from firebase_functions import https_fn
from firebase_admin import initialize_app
from flask_cors import CORS
from flask import Flask, jsonify
import requests

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Initialize Firebase Admin SDK
initialize_app()

@https_fn.on_request()
def proxy_fetch(req: https_fn.Request) -> https_fn.Response:
    print("Received request to proxy_fetch")
    url = req.args.get('url')
    
    if not url:
        return https_fn.Response("Missing 'url' parameter", status=400)
    
    try:
        response = requests.get(url)
        if 'image' in response.headers.get('Content-Type', ''):
            # Return the image as a blob with CORS headers
            return https_fn.Response(response.content, status=response.status_code, headers={
                'Content-Type': response.headers['Content-Type'],
                'Access-Control-Allow-Origin': '*'  # Allow requests from all origins
            })
        else:
            return https_fn.Response("The URL did not return an image", status=400)
    except requests.RequestException as e:
        return https_fn.Response(f"Error fetching data: {str(e)}", status=500)
