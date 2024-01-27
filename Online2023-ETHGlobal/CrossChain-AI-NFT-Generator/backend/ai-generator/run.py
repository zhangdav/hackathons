from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from package import stablediffusion_API
import ipfspy

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["POST"])
def handle_request():
    data = request.data.decode("utf-8")
    data = json.loads(data)
    file_path = data["userimagepath"]
    description = data["description"]
    if os.path.exists(file_path):
        try:
            sddata = stablediffusion_API.img2img(file_path,description)
            print("AI generated successfully")
        except:
             print("AI generated failed")
        try:
            ipfsdic = ipfspy.ipfsupload(os.path.abspath(sddata["aiimagepath"]), description)
            print("ipfs upload successful")  
        except:
             print("ipfs upload failed")            
        responsedata = dict( sddata, **ipfsdic ) 
        
    else:
        responsedata = {"error": "Invalid input"}
    print(responsedata)
    return responsedata

if __name__ == "__main__":
    from gevent import pywsgi


    server = pywsgi.WSGIServer(('0.0.0.0',12345),app)
    print("Service started successfully")
    server.serve_forever()


