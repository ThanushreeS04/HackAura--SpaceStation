import time
from flask import Flask, request, jsonify

# ---------------------------
# 1️⃣ Flask app
# ---------------------------
app = Flask(__name__)

# This is the line that often fails. We are commenting it out!
# model_path = r"C:\Users\Trisha\Desktop\FalconEDU\Hackathon2_scripts\Hackathon2_scripts\runs\detect\train2\weights\best.pt"
# model = YOLO(model_path) 

# Simple dummy data for testing the Flask server itself
live_data = {"test_object": {"x": 100, "y": 100}}

# ---------------------------
# 4️⃣ Flask endpoint (Same as yours)
# ---------------------------
@app.route('/query', methods=['GET'])
def query_object():
    obj_name = request.args.get('object')
    
    # We will test with the dummy data
    obj_info = live_data.get(obj_name) 
    
    if obj_info:
        return jsonify({"object": obj_name, "position": obj_info})
    else:
        return jsonify({"error": f"Object '{obj_name}' not detected"}), 404

# ---------------------------
# 5️⃣ Start Flask
# ---------------------------
if __name__ == "__main__":
    print("--- ATTEMPTING TO START FLASK SERVER ---")
    app.run(host="0.0.0.0", port=5001, debug=True)